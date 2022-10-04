import {Platform} from 'react-native';

import {RenderPassReport, RenderPassEndInfo, RenderPassStartInfo, FlowInfo, SnapshotInfo} from './RenderPassReport';
import {State, Started, Rendered, RenderAborted} from './state-machine/states';
import {PerformanceProfilerError} from './exceptions';
import {getFlowStartState, reverseReduce} from './state-machine/states/state-utils';

export type RenderPassReportGeneratorType = (newState: State) => Promise<RenderPassReport | null>;

type RenderPassEndState = Rendered | RenderAborted;

export class CompletionTimestampError extends PerformanceProfilerError {
  readonly name = 'CompletionTimestampError';
  readonly destinationScreen: string;

  constructor(destinationScreen: string) {
    super('completionTimestamp cannot be before flowStartTimestamp.', 'bug');
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, CompletionTimestampError.prototype);
  }
}

export class MissingJSNativeLatencyError extends PerformanceProfilerError {
  readonly name = 'MissingJSNativeLatencyError';
  readonly destinationScreen: string;

  constructor(destinationScreen: string) {
    super('jsNativeLatency is undefined.', 'bug');
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, MissingJSNativeLatencyError.prototype);
  }
}

const renderPassReportGenerator: RenderPassReportGeneratorType = async newState => {
  const flowStartState = getFlowStartState(newState);

  if (!(newState instanceof Rendered || newState instanceof RenderAborted)) {
    return null;
  }

  const previouslyReported = reverseReduce(
    newState,
    (state, previouslyReported) => {
      // There might be more than 1 Rendered/RenderAborted states for the same render pass.
      // Everytime there is an operation state change, a new copy of the previous state is created,
      // and only the ongoingOperations property is changed. We do this to keep a complete timeline of all events.
      // However, we don't need to generate a new report everytime this happens.
      return (
        previouslyReported ||
        ((state instanceof Rendered || state instanceof RenderAborted) &&
          state !== newState &&
          state.snapshotId === newState.snapshotId)
      );
    },
    false,
  );

  if (previouslyReported) {
    return null;
  }

  const [snapshotInfo, flowInfo, startInfo, endInfo] = await Promise.all([
    prepareSnapshotInfo(newState),
    prepareFlowInfo(flowStartState),
    prepareRenderPassStartInfo(flowStartState),
    prepareRenderPassEndInfo(flowStartState, newState),
  ]);

  return {
    ...snapshotInfo,
    ...flowInfo,
    ...startInfo,
    ...endInfo,
  };
};

const prepareSnapshotInfo = async (newState: RenderPassEndState): Promise<SnapshotInfo> => {
  return {
    reportId: await newState.snapshotId,
  };
};

const prepareFlowInfo = async (flowStartState: Started): Promise<FlowInfo> => {
  return {
    flowInstanceId: await flowStartState.snapshotId,
    sourceScreen: 'sourceScreen' in flowStartState ? flowStartState.sourceScreen : undefined,
    destinationScreen: flowStartState.destinationScreen,
  };
};

const prepareRenderPassEndInfo = async (
  flowStartState: Started,
  newState: RenderPassEndState,
): Promise<RenderPassEndInfo> => {
  const timeToCompletionMillis = await (async () => {
    if (flowStartState.type === 'app_boot') {
      // For the app_boot case, do not include the boot time into the timeToCompletionMillis times.
      // Hence, we use flowStartState.timestamp.jsTimestamp.
      return (
        (await (newState.timestamp.nativeTimestamp ?? newState.timestamp.jsTimestamp)) -
        flowStartState.timestamp.jsTimestamp
      );
    } else {
      // For regular in-app flows, we can use both the nativeTimestamp and jsTimestamp for the
      // flowStartState. Using nativeTimestamp will include the touch-event-propagation latency
      // in the render times (when applicable).
      return (
        (await (newState.timestamp.nativeTimestamp ?? newState.timestamp.jsTimestamp)) -
        (await (flowStartState.timestamp.nativeTimestamp ?? flowStartState.timestamp.jsTimestamp))
      );
    }
  })();

  if (
    timeToCompletionMillis < 0 &&
    // The android emulator clock is not shared with the dev mac system. When running in DEV mode,
    // the two clocks can be a few milliseconds off, leading to these kind of errors.
    // This is a known limitation, so don't throw errors, and cause an annoyance for devs.
    !(Platform.OS === 'android' && __DEV__)
  ) {
    throw new CompletionTimestampError(newState.destinationScreen);
  }

  if (newState instanceof Rendered) {
    return {
      renderPassName: newState.renderPassName,
      timeToRenderMillis: timeToCompletionMillis,
      interactive: newState.interactive,
    };
  } else {
    return {
      timeToAbortMillis: timeToCompletionMillis,
      interactive: false,
    };
  }
};

const prepareRenderPassStartInfo = async (flowStartState: Started): Promise<RenderPassStartInfo> => {
  const jsNativeLatency = flowStartState.timestamp.jsNativeLatency && (await flowStartState.timestamp.jsNativeLatency);

  if (flowStartState.type === 'app_boot') {
    if (jsNativeLatency === undefined) {
      throw new MissingJSNativeLatencyError(flowStartState.destinationScreen);
    }
    return {
      // For the app-boot, mark the flow startup instant when the JS booted up.
      // This ensures that the boot-times are not included in the render times for this screen.
      // This ensures the final render-times to not be vastly different in-case the same screen
      // is re-renderd through an in-app navigation flow.
      flowStartTimeSinceEpochMillis: flowStartState.timestamp.jsTimestamp,
      timeToBootJsMillis: jsNativeLatency,
    };
  } else {
    return {
      // For in-app navagation, if the user had provided the uiEvent object, mark the
      // flowStartTimeSinceEpochMillis as when the native onPress event occurred. If that
      // information is not available, fallback to the less accurate JS onPress event.
      flowStartTimeSinceEpochMillis: await (flowStartState.timestamp.nativeTimestamp ??
        flowStartState.timestamp.jsTimestamp),
      timeToConsumeTouchEventMillis: jsNativeLatency,
    };
  }
};

export default renderPassReportGenerator;
