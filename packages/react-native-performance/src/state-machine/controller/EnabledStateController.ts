import {RenderTimeoutError, ScreenProfilerNotStartedError, PerformanceProfilerError} from '../../exceptions';
import {getNativeStartupTimestamp, getNativeUuid, matchesPattern} from '../../utils';
import GestureResponderEvent from '../../GestureResponderEvent';
import BridgedEventTimestamp, {BridgedEventTimestampBuilder} from '../../BridgedEventTimestamp';
import {State, RenderAborted, Started, Rendered, Mounted, Unmounted} from '../states';
import OngoingOperationsRegistry from '../OngoingOperationsRegistry';
import {reverseReduce, reverseTraverse} from '../states/state-utils';
import logger, {LogLevel} from '../../utils/Logger';

import StateController, {RenderTimeoutConfig, OnStateChangedListener} from './StateController';

export const DESTINATION_SCREEN_NAME_PLACEHOLDER = '__unknown_destination_screen__';

class InvalidNewDestinationScreenError extends PerformanceProfilerError {
  readonly name = 'InvalidNewDestinationScreenError';
  readonly destinationScreen: string;

  constructor(destinationScreen: string, newDestinationScreen: string) {
    super(
      `The destinationScreen (${destinationScreen}) does not match the one recorded inside the new state object (${newDestinationScreen}).`,
      'bug',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, InvalidNewDestinationScreenError.prototype);
  }
}

class InvalidOldDestinationScreenError extends PerformanceProfilerError {
  readonly name = 'InvalidOldDestinationScreenError';
  readonly destinationScreen: string;

  constructor(destinationScreen: string, oldDestinationScreen: string) {
    super(
      `The destinationScreen (${destinationScreen}) does not match the one recorded inside the old state object (${oldDestinationScreen}).`,
      'bug',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, InvalidOldDestinationScreenError.prototype);
  }
}

export class InvalidMountStateError extends PerformanceProfilerError {
  readonly name = 'InvalidMountStateError';
  readonly destinationScreen: string;

  constructor(destinationScreen: string, componentInstanceId: string) {
    super(
      `No matching ${Mounted.STATE_NAME} state found for componentInstanceId ${componentInstanceId} for screen ${destinationScreen}.`,
      'bug',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, InvalidMountStateError.prototype);
  }
}

export class ReuseComponentInstanceIDError extends PerformanceProfilerError {
  readonly name = 'ReuseSnapshotIDError';
  readonly destinationScreen: string;
  constructor(destinationScreen: string, componentInstanceId: string) {
    super(
      `Cannot reuse the same snapshotId ${componentInstanceId} for successive mounts of screen ${destinationScreen}.`,
      'bug',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, ReuseComponentInstanceIDError.prototype);
  }
}

class InvalidStateError extends PerformanceProfilerError {
  readonly name = 'InvalidStateError';
  readonly destinationScreen: string;
  constructor(destinationScreen: string, stateName: string) {
    super(
      `Something went wrong. The state corresponding to the DESTINATION_SCREEN_NAME_PLACEHOLDER screen name should only ever be of type ${Started.STATE_NAME}. It actually is: ${stateName}`,
      'bug',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, InvalidStateError.prototype);
  }
}

/**
 * This can happen if you have a non-standard navigation flow, such as here: https://github.com/Shopify/react-native-performance/issues/97
 */
export class MultipleFlowsError extends PerformanceProfilerError {
  readonly name = 'MultipleFlowsError';
  readonly destinationScreen: string;
  constructor(destinationScreen: string) {
    super(
      'The navigation for one screen was already queued up when another one was added. This ' +
        'could imply that a previously queued screen was never rendered.',
      'fatal',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, MultipleFlowsError.prototype);
  }
}

export default class EnabledStateController implements StateController {
  readonly isEnabled = true;

  private renderTimeoutConfig: RenderTimeoutConfig = {
    enabled: false,
  };

  private readonly stateRegistry: Map<string, State> = new Map();
  private readonly watchdogTimers: Map<any, string> = new Map();
  private readonly onStateChangedListeners: OnStateChangedListener[] = [];

  onAppStarted() {
    this.onFlowStart({
      timestamp: new BridgedEventTimestampBuilder()
        .nativeTimestamp(getNativeStartupTimestamp())
        .epochReference()
        .build(),
      sourceScreen: undefined,
      renderTimeoutMillisOverride: undefined,
      type: 'app_boot',
    });
  }

  configureRenderTimeout(config: RenderTimeoutConfig) {
    this.renderTimeoutConfig = config;
    if (config.enabled) {
      this.addWatchdogTimersForUnwatchedComponents();
    } else {
      this.clearAllWatchdogTimers();
    }
  }

  addStateChangedListener(listener: OnStateChangedListener) {
    this.onStateChangedListeners.push(listener);
  }

  removeStateChangedListener(listener: OnStateChangedListener) {
    this.onStateChangedListeners
      .reduce<number[]>((indices, currentListener, index) => {
        if (listener === currentListener) {
          indices.push(index);
        }
        return indices;
      }, [])
      .forEach(index => {
        this.onStateChangedListeners.splice(index, 1);
      });
  }

  getCurrentStateFor(destinationScreenToReportPattern: string | RegExp): State | undefined {
    for (const state of this.stateRegistry.values()) {
      if (matchesPattern(state.destinationScreen, destinationScreenToReportPattern)) {
        return state;
      }
    }

    return undefined;
  }

  onNavigationStarted({
    sourceScreen,
    uiEvent,
    renderTimeoutMillisOverride,
  }: {
    sourceScreen?: string;
    uiEvent?: GestureResponderEvent;
    renderTimeoutMillisOverride?: number;
  }) {
    const oldState = this.stateRegistry.get(DESTINATION_SCREEN_NAME_PLACEHOLDER);
    if (oldState instanceof Started && oldState.type === 'app_boot') {
      logger.debug('Skipping starting new flow after navigation started since app_boot flow is already in progress');
      return;
    }
    this.onFlowStart({
      timestamp: new BridgedEventTimestampBuilder()
        .nativeTimestamp(uiEvent?.nativeEvent.timestamp)
        .systemBootReference()
        .build(),
      sourceScreen,
      renderTimeoutMillisOverride,
      type: 'flow_start',
    });
  }

  onScreenMounted({destinationScreen, componentInstanceId}: {destinationScreen: string; componentInstanceId: string}) {
    if (this.stateRegistry.has(componentInstanceId)) {
      throw new ReuseComponentInstanceIDError(destinationScreen, componentInstanceId);
    }
    const oldState = this.safeGetCurrentState(destinationScreen, componentInstanceId);

    this.changeStateTo(
      destinationScreen,
      componentInstanceId,
      new Mounted({
        destinationScreen,
        componentInstanceId,
        snapshotId: getNativeUuid(),
        previousState: oldState,
        operationsSnapshot: oldState.ongoingOperations,
        timestamp: new BridgedEventTimestampBuilder().build(),
      }),
    );
  }

  onScreenUnmounted({
    destinationScreen,
    componentInstanceId,
  }: {
    destinationScreen: string;
    componentInstanceId: string;
  }) {
    if (!this.stateRegistry.get(componentInstanceId)) {
      throw new InvalidMountStateError(destinationScreen, componentInstanceId);
    }
    const oldState = this.safeGetCurrentState(destinationScreen, componentInstanceId);

    const unmounted = new Unmounted({
      destinationScreen,
      componentInstanceId,
      snapshotId: getNativeUuid(),
      previousState: oldState,
      operationsSnapshot: oldState.ongoingOperations,
      timestamp: new BridgedEventTimestampBuilder().build(),
    });

    this.changeStateTo(destinationScreen, componentInstanceId, unmounted);

    const isScreenReadyForUnmount = this.hasMatchingMountUnmountPairs(destinationScreen, componentInstanceId);

    if (isScreenReadyForUnmount) {
      this.stopWatchdogTimerForComponent(componentInstanceId);

      const reachedInteractiveRenderedState = reverseReduce(
        oldState,
        (state, reachedInteractiveRenderedState) => {
          return reachedInteractiveRenderedState || (state instanceof Rendered && state.interactive);
        },
        false,
      );

      if (!reachedInteractiveRenderedState) {
        this.changeStateTo(
          destinationScreen,
          componentInstanceId,
          new RenderAborted({
            destinationScreen,
            componentInstanceId,
            previousState: oldState,
            operationsSnapshot: oldState.ongoingOperations,
            timestamp: new BridgedEventTimestampBuilder().build(),
            snapshotId: getNativeUuid(),
          }),
        );
      }

      // Cleanup the memory associated with this screen now that it has been fully torn down.
      this.stateRegistry.delete(componentInstanceId);
    }
  }

  onFlowReset({
    sourceScreen,
    destinationScreen,
    uiEvent,
    renderTimeoutMillisOverride,
    componentInstanceId,
  }: {
    sourceScreen?: string;
    destinationScreen: string;
    uiEvent?: GestureResponderEvent;
    renderTimeoutMillisOverride?: number;
    componentInstanceId: string;
  }) {
    const oldState = this.safeGetCurrentState(destinationScreen, componentInstanceId);
    this.stopWatchdogTimerForComponent(componentInstanceId);

    const stateWithAbortedOperations = oldState.onAllOngoingOperationsCancelled();
    if (stateWithAbortedOperations !== oldState) {
      this.changeStateTo(destinationScreen, componentInstanceId, stateWithAbortedOperations);
    }

    this.changeStateTo(
      destinationScreen,
      componentInstanceId,
      new Started({
        // If no source screen is provided explicitly, the screen is being reset internally.
        // So the destination === source.
        sourceScreen: sourceScreen ?? destinationScreen,
        destinationScreen,
        componentInstanceId,
        timestamp: new BridgedEventTimestampBuilder()
          .nativeTimestamp(uiEvent?.nativeEvent.timestamp)
          .systemBootReference()
          .build(),
        previousState: stateWithAbortedOperations,
        snapshotId: getNativeUuid(),
        operationsSnapshot: new OngoingOperationsRegistry(),
        type: 'flow_reset',
      }),
    );

    this.addRenderWatchdogTimerIfEnabled(componentInstanceId, renderTimeoutMillisOverride);
  }

  onRenderPassCompleted(props: {
    renderPassName: string;
    timestamp: number;
    destinationScreen: string;
    interactive: boolean;
    componentInstanceId: string;
  }) {
    const oldState = this.safeGetCurrentState(props.destinationScreen, props.componentInstanceId);
    if (props.interactive) {
      this.stopWatchdogTimerForComponent(props.componentInstanceId);
    }

    const nextState = new Rendered({
      ...props,
      previousState: oldState,
      operationsSnapshot: oldState.ongoingOperations,
      timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(props.timestamp).epochReference().build(),
      snapshotId: getNativeUuid(),
    });

    this.changeStateTo(props.destinationScreen, props.componentInstanceId, nextState);
  }

  private onFlowStart({
    timestamp,
    sourceScreen,
    type,
    renderTimeoutMillisOverride,
  }: {
    timestamp: BridgedEventTimestamp;
    sourceScreen: string | undefined;
    type: 'app_boot' | 'flow_start';
    renderTimeoutMillisOverride: number | undefined;
  }) {
    let startedMultipleFlows = false;
    if (this.stateRegistry.has(DESTINATION_SCREEN_NAME_PLACEHOLDER)) {
      startedMultipleFlows = true;
      const oldState = this.stateRegistry.get(DESTINATION_SCREEN_NAME_PLACEHOLDER)!;
      this.stopWatchdogTimerForComponent(DESTINATION_SCREEN_NAME_PLACEHOLDER);
      const stateWithAbortedOperations = oldState.onAllOngoingOperationsCancelled();
      if (stateWithAbortedOperations !== oldState) {
        this.changeStateTo(
          DESTINATION_SCREEN_NAME_PLACEHOLDER,
          DESTINATION_SCREEN_NAME_PLACEHOLDER,
          stateWithAbortedOperations,
        );
      }
      this.stateRegistry.delete(DESTINATION_SCREEN_NAME_PLACEHOLDER);
    }

    // The root screen's name is unknown in the beginning.
    // This will get migrated once the main screen's name is known.
    this.changeStateTo(
      DESTINATION_SCREEN_NAME_PLACEHOLDER,
      DESTINATION_SCREEN_NAME_PLACEHOLDER,
      new Started({
        timestamp,
        sourceScreen,
        componentInstanceId: DESTINATION_SCREEN_NAME_PLACEHOLDER,
        destinationScreen: DESTINATION_SCREEN_NAME_PLACEHOLDER,
        previousState: undefined,
        snapshotId: getNativeUuid(),
        operationsSnapshot: new OngoingOperationsRegistry(),
        type,
      }),
    );

    this.addRenderWatchdogTimerIfEnabled(DESTINATION_SCREEN_NAME_PLACEHOLDER, renderTimeoutMillisOverride);

    // Throw the error at the very end to ensure that if this warning is suppressed, the state machine
    // still continues operating in a semi-reasonable way. We're choosing to drop the previous "Started"
    // state in favour of the new flow.
    if (startedMultipleFlows) {
      throw new MultipleFlowsError(DESTINATION_SCREEN_NAME_PLACEHOLDER);
    }
  }

  /**
   * Stops current flow if the screen was already mounted.
   * This can occur when navigating repeatedly to the same instance of a screen.
   * @param componentInstanceId Instance ID of the mounted screen.
   */
  stopFlowIfNeeded(componentInstanceId: string): void {
    const oldState = this.stateRegistry.get(componentInstanceId);
    if (oldState !== undefined) {
      this.stateRegistry.delete(DESTINATION_SCREEN_NAME_PLACEHOLDER);
      const watchdogTimerId = this.findWatchdogTimerIdForComponent(DESTINATION_SCREEN_NAME_PLACEHOLDER);
      if (watchdogTimerId !== undefined) {
        clearTimeout(watchdogTimerId);
        this.watchdogTimers.delete(watchdogTimerId);
      }
    }
  }

  private safeGetCurrentState(destinationScreen: string, componentInstanceId: string): State {
    this.onDestinationScreenNameAcquired({
      destinationScreen,
      componentInstanceId,
    });
    const oldState = this.stateRegistry.get(componentInstanceId);
    if (oldState === undefined) {
      throw new ScreenProfilerNotStartedError(destinationScreen, componentInstanceId);
    }
    return oldState;
  }

  private onDestinationScreenNameAcquired(props: {destinationScreen: string; componentInstanceId: string}) {
    const oldState = this.stateRegistry.get(props.componentInstanceId);

    if (oldState === undefined && this.stateRegistry.has(DESTINATION_SCREEN_NAME_PLACEHOLDER)) {
      // Migrate the previous state that was linked to an unknown screen name
      // to this one. The destination screen's name is unknown when the "start flow" or "start app" events arrive.
      const actualOldState = this.stateRegistry.get(DESTINATION_SCREEN_NAME_PLACEHOLDER)!;
      if (!(actualOldState instanceof Started)) {
        throw new InvalidStateError(props.destinationScreen, actualOldState.getStateName());
      }

      const migratedState = actualOldState.updateState(props.destinationScreen, props.componentInstanceId);
      this.stateRegistry.set(props.componentInstanceId, migratedState);
      this.stateRegistry.delete(DESTINATION_SCREEN_NAME_PLACEHOLDER);
      const watchdogTimerId = this.findWatchdogTimerIdForComponent(DESTINATION_SCREEN_NAME_PLACEHOLDER);
      if (watchdogTimerId !== undefined) {
        this.watchdogTimers.set(watchdogTimerId, props.componentInstanceId);
      }
      this.onStateChangedListeners.forEach(listener =>
        listener(props.destinationScreen, actualOldState, migratedState),
      );
    }
  }

  private changeStateTo(destinationScreen: string, componentInstanceId: string, newState: State) {
    if (destinationScreen !== newState.destinationScreen) {
      throw new InvalidNewDestinationScreenError(destinationScreen, newState.destinationScreen);
    }

    const oldState = this.stateRegistry.get(componentInstanceId);

    if (oldState !== undefined && oldState.destinationScreen !== destinationScreen) {
      throw new InvalidOldDestinationScreenError(destinationScreen, oldState.destinationScreen);
    }

    this.stateRegistry.set(componentInstanceId, newState);
    this.onStateChangedListeners.forEach(listener => listener(destinationScreen, oldState, newState));
    logger.debug(`State: ${newState.toString()}`);
    assertRenderPassNamesUnique(newState);
  }

  private stopWatchdogTimerForComponent(componentInstanceId: string) {
    const watchdogTimerId = this.findWatchdogTimerIdForComponent(componentInstanceId);
    if (watchdogTimerId !== undefined) {
      clearTimeout(watchdogTimerId);
      this.watchdogTimers.delete(watchdogTimerId);
    }
  }

  private findWatchdogTimerIdForComponent(componentInstanceId: string): number | undefined {
    for (const [watchdogTimerId, _componentInstanceId] of this.watchdogTimers.entries()) {
      if (_componentInstanceId === componentInstanceId) {
        return watchdogTimerId;
      }
    }
    return undefined;
  }

  private addRenderWatchdogTimerIfEnabled(
    componentInstanceId: string,
    renderTimeoutMillisOverride: number | undefined = undefined,
  ) {
    if (!this.renderTimeoutConfig.enabled) {
      return;
    }

    const effectiveTimeoutMillis = renderTimeoutMillisOverride ?? this.renderTimeoutConfig.renderTimeoutMillis;
    const {onRenderTimeout} = this.renderTimeoutConfig;

    const timeoutId = setTimeout(() => {
      // Re-fetch the screen name from the map, because the main screen's placeholder
      // name might've been replaced with the actual name by this point.
      const currentComponentInstanceId = this.watchdogTimers.get(timeoutId) as string;
      const currentState = this.stateRegistry.get(currentComponentInstanceId);

      this.watchdogTimers.delete(timeoutId);

      const reachedInteractiveRenderedState =
        currentState &&
        reverseReduce(
          currentState,
          (state, reachedInteractiveRenderedState) => {
            return reachedInteractiveRenderedState || (state instanceof Rendered && state.interactive);
          },
          false,
        );

      if (currentState !== undefined && reachedInteractiveRenderedState === false) {
        onRenderTimeout(new RenderTimeoutError(currentState.destinationScreen, effectiveTimeoutMillis, currentState));
      }
    }, effectiveTimeoutMillis);

    this.watchdogTimers.set(timeoutId, componentInstanceId);
  }

  private clearAllWatchdogTimers() {
    this.watchdogTimers.forEach((_, watchdogTimerId) => clearTimeout(watchdogTimerId));
    this.watchdogTimers.clear();
  }

  private addWatchdogTimersForUnwatchedComponents() {
    const componentInstanceIdsWithWatchdogs = new Set(this.watchdogTimers.values());
    for (const state of this.stateRegistry.values()) {
      if (!componentInstanceIdsWithWatchdogs.has(state.componentInstanceId)) {
        this.addRenderWatchdogTimerIfEnabled(state.componentInstanceId);
      }
    }
  }

  private hasMatchingMountUnmountPairs(destinationScreen: string, componentInstanceId: string) {
    interface MountUnmountRecord {
      mounted?: Mounted;
      unmounted?: Unmounted;
    }

    const oldState = this.stateRegistry.get(componentInstanceId);

    if (oldState === undefined) {
      throw new ScreenProfilerNotStartedError(destinationScreen, componentInstanceId);
    }

    const mountUnmountRecord = reverseReduce(
      oldState,
      (state, registry) => {
        if (state instanceof Mounted || state instanceof Unmounted) {
          const entry = registry.get(state.componentInstanceId) ?? {};
          if (state instanceof Mounted) {
            entry.mounted = state;
          } else {
            entry.unmounted = state;
          }
          registry.set(state.componentInstanceId, entry);
        }

        return registry;
      },
      new Map<string, MountUnmountRecord>(),
      {
        // It's possible that the flow was reset after the screen was mounted. So we need to traverse back all the way
        // to the first known state in the chain, and not stop at the last "Started" state.
        stopAtStartState: false,
      },
    ).values();

    for (const {mounted, unmounted} of mountUnmountRecord) {
      if (mounted === undefined || unmounted === undefined) {
        return false;
      }
    }

    return true;
  }
}

function assertRenderPassNamesUnique(finalState: State) {
  if (logger.logLevel > LogLevel.Info) {
    return;
  }

  const seenRenderPasses: Map<string, Rendered> = new Map();

  reverseTraverse(finalState, state => {
    if (state instanceof Rendered) {
      const previousRenderedState = seenRenderPasses.get(state.renderPassName);
      if (previousRenderedState !== undefined && previousRenderedState.snapshotId !== state.snapshotId) {
        logger.info(
          `Looks like you used the same render pass name '${state.renderPassName}' multiple times on the ${state.destinationScreen} screen. ` +
            'A renderPassName can help uniquely identifying a UI state in which a given screen can render (e.g., "loading", "cached_render", "first_contentful_paint", etc.). ' +
            'If you do not expect to see the same renderPassName multiple times, it is often a sign that your screen might be going through ' +
            'some unexpected state changes. If you are debugging a performance issue, we recommend:\n' +
            'i) debugging the prop/state change that is leading to these unnecessary re-renders, and fix them if the re-renders were not expected,\n' +
            'ii) assigning different renderPassNames to these render passes so that you can distinguish between them in the output reports if the re-renders were expected or\n' +
            'iii) notifying the profiler library of that via the useResetFlow hook and by setting a componentInstanceId to ReactNavigationPerformanceView' +
            'if the re-render is occurring because the flow is essentially being restarted.',
        );
      }
      seenRenderPasses.set(state.renderPassName, state);
    }
  });
}
