import {
  EnabledStateController,
  DESTINATION_SCREEN_NAME_PLACEHOLDER,
  OnStateChangedListener,
  Started,
  RenderAborted,
  Rendered,
  State,
  Unmounted,
  Mounted,
  OngoingOperationsRegistry,
  getFlowStartState,
} from '../../../state-machine';
import BridgedEventTimestamp, {BridgedEventTimestampBuilder} from '../../../BridgedEventTimestamp';
import {RenderTimeoutError, ScreenProfilerNotStartedError} from '../../../exceptions';
import {getNativeStartupTimestamp, getNativeUuid, matchesPattern} from '../../../utils';
import logger, {LogLevel} from '../../../utils/Logger';
import {
  ReuseComponentInstanceIDError,
  InvalidMountStateError,
  MultipleFlowsError,
} from '../../../state-machine/controller/EnabledStateController';

const RENDER_TIMEOUT_MILLIS = 5000;

jest.mock('../../../utils/native-performance-module', () => {
  const actual = jest.requireActual('../../../utils/native-performance-module');
  return {
    ...actual,
    getNativeUuid: jest.fn(),
  };
});

jest.mock('../../../utils/Logger', () => {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    LogLevel: {
      Debug: 0,
      Info: 1,
      Warn: 2,
      Error: 3,
    },
  };
});

const getNativeUuidMock = getNativeUuid as jest.Mock;
const getNativeStartupTimestampMock = getNativeStartupTimestamp as jest.Mock;
const matchesPatternMock = matchesPattern as jest.Mock;

jest.mock('../../../utils', () => {
  return {
    getNativeUuid: jest.fn(),
    getNativeStartupTimestamp: jest.fn(),
    matchesPattern: jest.fn(),
  };
});

describe('state-machine/controller/EnabledStateController', () => {
  let onStateChangedListener: OnStateChangedListener;
  let stateController: EnabledStateController;
  let onRenderTimeout: (_: RenderTimeoutError) => void;

  beforeEach(() => {
    logger.logLevel = LogLevel.Info;
    jest.spyOn(Date, 'now').mockReturnValueOnce(1500);
    jest.useFakeTimers('legacy');
    onStateChangedListener = jest.fn();
    onRenderTimeout = jest.fn();
    stateController = new EnabledStateController();
    stateController.configureRenderTimeout({
      enabled: true,
      renderTimeoutMillis: RENDER_TIMEOUT_MILLIS,
      onRenderTimeout,
    });
    stateController.addStateChangedListener(onStateChangedListener);
    getNativeUuidMock.mockImplementation(() => Promise.resolve(`${Math.random()}`));
    getNativeStartupTimestampMock.mockImplementation(() => Promise.resolve(1500));
    matchesPatternMock.mockImplementation((screenA, screenB) => screenA === screenB);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('starts the state machine in the Started state when onAppStarted is called', () => {
    Date.now = jest.fn().mockReturnValueOnce(1500);
    stateController.onAppStarted();
    const expectedState = new Started({
      timestamp: new BridgedEventTimestamp(1500, expect.any(Promise)),
      sourceScreen: undefined,
      componentInstanceId: DESTINATION_SCREEN_NAME_PLACEHOLDER,
      destinationScreen: DESTINATION_SCREEN_NAME_PLACEHOLDER,
      previousState: undefined,
      snapshotId: expect.any(Promise),
      operationsSnapshot: new OngoingOperationsRegistry(),
      type: 'app_boot',
    });
    expect(onStateChangedListener).toHaveBeenCalledTimes(1);
    expect(onStateChangedListener).toHaveBeenCalledWith(DESTINATION_SCREEN_NAME_PLACEHOLDER, undefined, expectedState);
    expect(logger.debug).toHaveBeenCalledTimes(1);
    expect(stateController.getCurrentStateFor(DESTINATION_SCREEN_NAME_PLACEHOLDER)).toBeInstanceOf(Started);
  });

  it("registers the main screen's name once the first state transition occurs", () => {
    stateController.onAppStarted();
    // The destinationScreen in the state registry and the state object is DESTINATION_SCREEN_NAME_PLACEHOLDER in the beginning
    let state: State = stateController.getCurrentStateFor(DESTINATION_SCREEN_NAME_PLACEHOLDER) as Started;
    expect(state.destinationScreen).toBe(DESTINATION_SCREEN_NAME_PLACEHOLDER);

    // No listeners are triggered for the internal Started state migration to adopt the known destinationScreen name.
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeInitialScreen',
      componentInstanceId: 'id',
      renderPassName: 'pass1',
      interactive: false,
      timestamp: 2000,
    });
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeInitialScreen',
      expect.any(Started),
      expect.any(Rendered),
    );
    expect(onStateChangedListener).not.toHaveBeenCalledWith(
      DESTINATION_SCREEN_NAME_PLACEHOLDER,
      expect.any(Started),
      expect.any(Rendered),
    );

    matchesPatternMock.mockReturnValue(true);
    state = stateController.getCurrentStateFor('SomeInitialScreen#id') as Rendered;
    expect(state.destinationScreen).toBe('SomeInitialScreen');
    // The original Started state link is also migrated to use the new name
    expect(getFlowStartState(state as Rendered).destinationScreen).toBe('SomeInitialScreen');
  });

  it('skips state transition if onNavigationStarted is called and the current state is Started of type app_boot', async () => {
    Date.now = jest.fn().mockReturnValueOnce(1500);
    stateController.onAppStarted();
    stateController.onNavigationStarted({});

    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      DESTINATION_SCREEN_NAME_PLACEHOLDER,
      undefined,
      new Started({
        timestamp: new BridgedEventTimestamp(1500, expect.any(Promise)),
        sourceScreen: undefined,
        destinationScreen: DESTINATION_SCREEN_NAME_PLACEHOLDER,
        componentInstanceId: DESTINATION_SCREEN_NAME_PLACEHOLDER,
        previousState: undefined,
        snapshotId: expect.any(Promise),
        operationsSnapshot: new OngoingOperationsRegistry(),
        type: 'app_boot',
      }),
    );
  });

  it('transitions to Started when onNavigationStarted is called', () => {
    stateController.onNavigationStarted({});
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      DESTINATION_SCREEN_NAME_PLACEHOLDER,
      undefined,
      expect.any(Started),
    );
  });

  it('throws an error if onNavigationStarted is called for a screen twice', () => {
    stateController.onNavigationStarted({});
    expect(() => {
      stateController.onNavigationStarted({});
    }).toThrowError(MultipleFlowsError);
  });

  it('does not throw an error if onNavigationStarted is called again when there was no other pending screen in a Started state', () => {
    const componentInstanceId = 'id';
    stateController.onNavigationStarted({});
    stateController.onScreenMounted({
      destinationScreen: 'SomeTargetScreen',
      componentInstanceId,
    });
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeTargetScreen',
      componentInstanceId,
      timestamp: 2000,
      renderPassName: 'rendered_completely',
      interactive: true,
    });

    Date.now = jest.fn().mockReturnValueOnce(2100);
    stateController.onScreenUnmounted({
      destinationScreen: 'SomeTargetScreen',
      componentInstanceId,
    });

    Date.now = jest.fn().mockReturnValueOnce(2200);
    stateController.onNavigationStarted({});
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      DESTINATION_SCREEN_NAME_PLACEHOLDER,
      undefined,
      expect.any(Started),
    );
  });

  it('transitions to Rendered state if onRenderPassCompleted is called when the current state is Started', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeTargetScreen',
      componentInstanceId: 'id',
      timestamp: 2000,
      renderPassName: 'rendered_completely',
      interactive: true,
    });
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeTargetScreen',
      expect.any(Started),
      new Rendered({
        timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(2000).epochReference().build(),
        destinationScreen: 'SomeTargetScreen',
        componentInstanceId: 'id',
        renderPassName: 'rendered_completely',
        operationsSnapshot: new OngoingOperationsRegistry(),
        previousState: expect.any(Started),
        interactive: true,
        snapshotId: expect.any(Promise),
      }),
    );
  });

  it('throws a RenderTimeoutError if the screen stays on Started state for more than the max allowed time', () => {
    stateController.onAppStarted();
    expect(onRenderTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
    expect(onRenderTimeout).toHaveBeenCalledTimes(1);
    expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(RenderTimeoutError));
  });

  it('does not throw a RenderTimeoutError if the navigation started flow is stopped', () => {
    stateController.onNavigationStarted({});
    stateController.onScreenMounted({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id',
    });
    stateController.onRenderPassCompleted({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id',
      interactive: true,
      renderPassName: 'interactive',
      timestamp: 1000,
    });
    stateController.onNavigationStarted({});
    stateController.stopFlowIfNeeded('id');
    expect(onRenderTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
    expect(onRenderTimeout).toHaveBeenCalledTimes(0);
  });

  it('throws a RenderTimeoutError if the screen stays on Rendered(interactive = false) state for more than the max allowed time', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
      timestamp: 1000,
      renderPassName: 'rendered_completely',
      interactive: false,
    });
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeScreenName',
      expect.any(Started),
      expect.any(Rendered),
    );
    expect(onRenderTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
    expect(onRenderTimeout).toHaveBeenCalledTimes(1);
    expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(RenderTimeoutError));
  });

  it('does not throw a RenderTimeoutError if the screen reaches Rendered(interactive = true) before the max allowed time', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
      timestamp: 1000,
      renderPassName: 'rendered_completely',
      interactive: true,
    });
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeScreenName',
      expect.any(Started),
      expect.any(Rendered),
    );
  });

  it('does not throw a RenderTimeoutError if the screen aborts render before the max allowed time', () => {
    stateController.onAppStarted();
    stateController.onScreenMounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    stateController.onScreenUnmounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeScreenName',
      expect.any(Unmounted),
      expect.any(RenderAborted),
    );
  });

  it('does not throw a RenderTimeoutError if the flow is reset before the max allowed time', () => {
    stateController.onAppStarted();
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS * 0.5);
    stateController.onFlowReset({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS * 0.75);
    expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(Started), expect.any(Started));

    expect(onRenderTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS * 0.25);
    expect(onRenderTimeout).toHaveBeenCalledTimes(1);
    expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(RenderTimeoutError));
  });

  it('does not throw a RenderTimeoutError if the render watchdogs are disabled', () => {
    stateController.configureRenderTimeout({enabled: false});
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
    expect(onRenderTimeout).not.toHaveBeenCalled();
  });

  it('does not transition to RenderAborted state if the screen is unmounted after an interactive state is reached', () => {
    stateController.onAppStarted();
    stateController.onScreenMounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    Date.now = jest.fn().mockReturnValueOnce(1550);
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
      timestamp: 1600,
      renderPassName: 'rendered_completely',
      interactive: true,
    });
    expect(onStateChangedListener).toHaveBeenCalledTimes(4);
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeScreenName',
      expect.any(Mounted),
      expect.any(Rendered),
    );
    Date.now = jest.fn().mockReturnValueOnce(1650);
    stateController.onScreenUnmounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });

    // Does not transition to RenderAborted, since at least 1 interactive state was reached
    expect(onStateChangedListener).toHaveBeenCalledTimes(5);
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeScreenName',
      expect.any(Rendered),
      expect.any(Unmounted),
    );

    expect(stateController.getCurrentStateFor('SomeScreenName')).toBeUndefined();
  });

  it('transitions to RenderAborted state if the screen is unmounted before an interactive state is reached', () => {
    stateController.onAppStarted();
    stateController.onScreenMounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    Date.now = jest.fn().mockReturnValueOnce(1550);
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
      timestamp: 1600,
      renderPassName: 'rendered_completely',
      interactive: false,
    });
    expect(onStateChangedListener).toHaveBeenCalledTimes(4);
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeScreenName',
      expect.any(Mounted),
      expect.any(Rendered),
    );
    Date.now = jest.fn().mockReturnValueOnce(1650);
    stateController.onScreenUnmounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });

    // Transitions to RenderAborted, since at least 1 interactive state was reached
    expect(onStateChangedListener).toHaveBeenCalledTimes(6);

    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeScreenName',
      expect.any(Unmounted),
      expect.any(RenderAborted),
    );

    expect(stateController.getCurrentStateFor('SomeScreenName')).toBeUndefined();
  });

  it('transitions to RenderAborted state if the screen is unmounted before any Rendered state is reached', () => {
    stateController.onAppStarted();
    stateController.onScreenMounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    stateController.onScreenUnmounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'SomeScreenName',
      expect.any(Unmounted),
      expect.any(RenderAborted),
    );

    expect(stateController.getCurrentStateFor('SomeScreenName')).toBeUndefined();
  });

  it('adds a new state changed listener correctly', () => {
    stateController.onAppStarted();
    const onStateChangedListener2 = jest.fn();
    stateController.addStateChangedListener(onStateChangedListener2);
    expect(onStateChangedListener2).not.toHaveBeenCalled();
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
      timestamp: 1000,
      renderPassName: 'rendered_completely',
      interactive: true,
    });
    expect(onStateChangedListener2).toHaveBeenCalledTimes(2);
    expect(onStateChangedListener2).toHaveBeenCalledWith('SomeScreenName', expect.any(Started), expect.any(Rendered));
  });

  it('removes a previously added state changed listener correctly', () => {
    stateController.onAppStarted();
    expect(onStateChangedListener).toHaveBeenCalledTimes(1);
    stateController.removeStateChangedListener(onStateChangedListener);
    stateController.onRenderPassCompleted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
      timestamp: 1000,
      renderPassName: 'rendered_completely',
      interactive: true,
    });
    expect(onStateChangedListener).toHaveBeenCalledTimes(1);
  });

  it('returns the correct state when polled via getCurrentStateFor with a string screen name', () => {
    stateController.onAppStarted();
    Date.now = jest.fn().mockReturnValueOnce(1600);
    stateController.onRenderPassCompleted({
      renderPassName: 'rendered_completely',
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
      interactive: true,
      timestamp: 1000,
    });
    expect(stateController.getCurrentStateFor('SomeScreenName')).toBeInstanceOf(Rendered);
  });

  it('does not throw an error if a screen is opened again if the previous render were aborted', () => {
    stateController.onAppStarted();
    stateController.onScreenMounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    stateController.onScreenUnmounted({
      destinationScreen: 'SomeScreenName',
      componentInstanceId: 'id',
    });
    Date.now = jest.fn().mockReturnValueOnce(1700);
    stateController.onNavigationStarted({});
    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      DESTINATION_SCREEN_NAME_PLACEHOLDER,
      undefined,
      expect.any(Started),
    );
  });

  it('transitions to Rendered(interactive = false) if onRenderPassCompleted is called when the current state is Started', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 10,
      destinationScreen: 'some_screen',
      interactive: false,
    });
    expect(stateController.getCurrentStateFor('some_screen')).toStrictEqual(
      new Rendered({
        renderPassName: 'pass_1',
        componentInstanceId: 'id',
        timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(10).epochReference().build(),
        destinationScreen: 'some_screen',
        interactive: false,
        operationsSnapshot: new OngoingOperationsRegistry(),
        previousState: expect.any(Started),
        snapshotId: expect.any(Promise),
      }),
    );
  });

  it('transitions to Rendered(interactive = true) if onRenderPassCompleted is called when the current state is Started', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 20,
      destinationScreen: 'some_screen',
      interactive: true,
    });
    expect(stateController.getCurrentStateFor('some_screen')).toStrictEqual(
      new Rendered({
        renderPassName: 'pass_1',
        componentInstanceId: 'id',
        timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(20).epochReference().build(),
        destinationScreen: 'some_screen',
        interactive: true,
        operationsSnapshot: new OngoingOperationsRegistry(),
        previousState: expect.any(Started),
        snapshotId: expect.any(Promise),
      }),
    );
  });

  it('allows for two non-interactive render-completed events to arrive consecutively', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 10,
      destinationScreen: 'some_screen',
      interactive: false,
    });

    const renderPass1Complete = stateController.getCurrentStateFor('some_screen');
    expect(renderPass1Complete).toStrictEqual(
      new Rendered({
        renderPassName: 'pass_1',
        componentInstanceId: 'id',
        timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(10).epochReference().build(),
        destinationScreen: 'some_screen',
        interactive: false,
        operationsSnapshot: new OngoingOperationsRegistry(),
        previousState: expect.any(Started),
        snapshotId: expect.any(Promise),
      }),
    );

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_2',
      componentInstanceId: 'id',
      timestamp: 15,
      destinationScreen: 'some_screen',
      interactive: false,
    });

    const renderPass2Complete = stateController.getCurrentStateFor('some_screen');
    expect(renderPass2Complete).toStrictEqual(
      new Rendered({
        renderPassName: 'pass_2',
        componentInstanceId: 'id',
        timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(15).epochReference().build(),
        destinationScreen: 'some_screen',
        interactive: false,
        operationsSnapshot: new OngoingOperationsRegistry(),
        previousState: renderPass1Complete,
        snapshotId: expect.any(Promise),
      }),
    );
  });

  it('allows for an interactive render-completed event to arrive after a non-interactive render-completed event', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 10,
      destinationScreen: 'some_screen',
      interactive: false,
    });

    const renderPass1Complete = stateController.getCurrentStateFor('some_screen');
    expect(renderPass1Complete).toStrictEqual(
      new Rendered({
        renderPassName: 'pass_1',
        componentInstanceId: 'id',
        timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(10).epochReference().build(),
        destinationScreen: 'some_screen',
        interactive: false,
        operationsSnapshot: new OngoingOperationsRegistry(),
        previousState: expect.any(Started),
        snapshotId: expect.any(Promise),
      }),
    );

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_2',
      componentInstanceId: 'id',
      timestamp: 15,
      destinationScreen: 'some_screen',
      interactive: true,
    });

    const renderPass2Complete = stateController.getCurrentStateFor('some_screen');
    expect(renderPass2Complete).toStrictEqual(
      new Rendered({
        renderPassName: 'pass_2',
        componentInstanceId: 'id',
        timestamp: new BridgedEventTimestampBuilder().nativeTimestamp(15).epochReference().build(),
        destinationScreen: 'some_screen',
        interactive: true,
        operationsSnapshot: new OngoingOperationsRegistry(),
        previousState: renderPass1Complete,
        snapshotId: expect.any(Promise),
      }),
    );
  });

  it('allows for a screen to be unmounted in the Rendered(interactive = false) state', () => {
    stateController.onAppStarted();
    stateController.onScreenMounted({
      destinationScreen: 'some_screen',
      componentInstanceId: 'id',
    });

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 10,
      destinationScreen: 'some_screen',
      interactive: false,
    });

    stateController.onScreenUnmounted({
      destinationScreen: 'some_screen',
      componentInstanceId: 'id',
    });

    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'some_screen',
      expect.any(Unmounted),
      expect.any(RenderAborted),
    );
  });

  it('makes an info log if the same render pass name is used twice', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      destinationScreen: 'some_screen',
      interactive: false,
      timestamp: 100,
    });

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      destinationScreen: 'some_screen',
      interactive: true,
      timestamp: 200,
    });
    expect(logger.info).toHaveBeenCalledTimes(1);
  });

  it('does not make an info log if the same render pass name is used twice and logger level is higher than info', () => {
    logger.logLevel = LogLevel.Warn;
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      destinationScreen: 'some_screen',
      interactive: false,
      timestamp: 100,
    });

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      destinationScreen: 'some_screen',
      interactive: true,
      timestamp: 200,
    });
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('allows for the same render pass name if the flow was reset in between', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      destinationScreen: 'some_screen',
      timestamp: 1000,
      interactive: false,
    });

    stateController.onFlowReset({
      destinationScreen: 'some_screen',
      componentInstanceId: 'id',
    });

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      destinationScreen: 'some_screen',
      timestamp: 1000,
      interactive: false,
    });

    const lastState = stateController.getCurrentStateFor('some_screen') as Rendered;
    expect(lastState).toBeInstanceOf(Rendered);
    expect(lastState.renderPassName).toBe('pass_1');
  });

  it('makes a debug log if the same render pass name is used twice when a non-interactive render is completed', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 10,
      destinationScreen: 'some_screen',
      interactive: false,
    });

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 20,
      destinationScreen: 'some_screen',
      interactive: false,
    });
    expect(logger.info).toHaveBeenCalledTimes(1);
  });

  it('makes a debug log if the same render pass name is used twice when an interactive render is completed', () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 10,
      destinationScreen: 'some_screen',
      interactive: true,
    });

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 20,
      destinationScreen: 'some_screen',
      interactive: true,
    });
    expect(logger.info).toHaveBeenCalledTimes(1);
  });

  it('updates the state even if `renderPassName` is reused', async () => {
    stateController.onAppStarted();
    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 10,
      destinationScreen: 'some_screen',
      interactive: true,
    });

    const state1 = stateController.getCurrentStateFor('some_screen');

    stateController.onRenderPassCompleted({
      renderPassName: 'pass_1',
      componentInstanceId: 'id',
      timestamp: 20,
      destinationScreen: 'some_screen',
      interactive: true,
    });
    expect(logger.info).toHaveBeenCalledTimes(1);

    expect(onStateChangedListener).toHaveBeenLastCalledWith('some_screen', state1, expect.any(Rendered));

    const state2 = stateController.getCurrentStateFor('some_screen');
    expect(state2).not.toBe(state1);

    expect(await (state2 as Rendered).timestamp.nativeTimestamp).toBe(20);
    expect((state2 as Rendered).renderPassName).toBe('pass_1');
  });

  it('uses a custom source screen name if one is provided when resetting the flow', () => {
    stateController.onAppStarted();
    Date.now = jest.fn().mockReturnValueOnce(1700);
    stateController.onFlowReset({
      sourceScreen: 'some_source_screen',
      componentInstanceId: 'id',
      destinationScreen: 'some_screen',
    });

    expect(onStateChangedListener).toHaveBeenCalledTimes(3);

    const expectedFlowRestartState = new Started({
      sourceScreen: 'some_source_screen',
      componentInstanceId: 'id',
      destinationScreen: 'some_screen',
      timestamp: new BridgedEventTimestampBuilder().epochReference().build(),
      previousState: expect.any(Started),
      snapshotId: expect.any(Promise),
      operationsSnapshot: new OngoingOperationsRegistry(),
      type: 'flow_reset',
    });

    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'some_screen',
      expect.any(Started),
      expectedFlowRestartState,
    );
  });

  it('uses the renderTimeoutMillisOverride when one is provided on navigation start', () => {
    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
      renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS + 500,
    });
    expect(onRenderTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
    expect(onRenderTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(onRenderTimeout).toHaveBeenCalledTimes(1);
    expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(RenderTimeoutError));
  });

  it('uses the renderTimeoutMillisOverride when one is provided on flow reset', () => {
    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
      renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS,
    });
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS / 2);

    stateController.onFlowReset({
      sourceScreen: 'some_source_screen',
      destinationScreen: 'some_source_screen',
      componentInstanceId: 'id',
      renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS + 500,
    });

    expect(onRenderTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
    expect(onRenderTimeout).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(onRenderTimeout).toHaveBeenCalledTimes(1);
    expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(RenderTimeoutError));
  });

  it('does not configure render timeouts if renderTimeoutMillisOverride is provided on navigation start if they were disabled at the controller level', () => {
    stateController.configureRenderTimeout({enabled: false});

    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
      renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS + 500,
    });
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS + 600);
    expect(onRenderTimeout).not.toHaveBeenCalled();
  });

  it('does not configure render timeouts if renderTimeoutMillisOverride is provided on flow reset if they were disabled at the controller level', () => {
    stateController.configureRenderTimeout({enabled: false});

    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
    });

    stateController.onFlowReset({
      sourceScreen: 'some_source_screen',
      destinationScreen: 'some_source_screen',
      componentInstanceId: 'id',
      renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS + 500,
    });
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS + 600);
    expect(onRenderTimeout).not.toHaveBeenCalled();
  });

  it('checks that the same componentInstanceId is not reused on successive mounts', () => {
    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
    });

    stateController.onScreenMounted({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id',
    });

    expect(() => {
      stateController.onScreenMounted({
        destinationScreen: 'some_destination_screen',
        componentInstanceId: 'id',
      });
    }).toThrowError(ReuseComponentInstanceIDError);
  });

  it('transitions the state to Mounted when onScreenMounted is called', () => {
    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
    });

    stateController.onScreenMounted({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id',
    });

    expect(onStateChangedListener).toHaveBeenLastCalledWith(
      'some_destination_screen',
      expect.any(Started),
      new Mounted({
        destinationScreen: 'some_destination_screen',
        componentInstanceId: 'id',
        snapshotId: expect.any(Promise),
        previousState: expect.any(Started),
        operationsSnapshot: new OngoingOperationsRegistry(),
        timestamp: expect.any(BridgedEventTimestamp),
      }),
    );
  });

  it('checks that there was a matching Mounted state when onScreenUnmounted is called', () => {
    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
    });

    stateController.onScreenMounted({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id',
    });

    expect(() => {
      stateController.onScreenUnmounted({
        destinationScreen: 'some_destination_screen',
        componentInstanceId: 'id-2',
      });
    }).toThrowError(InvalidMountStateError);
  });

  it('retains the source screen name once the main screen name is captured', () => {
    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
    });

    stateController.onScreenMounted({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id-2',
    });

    const currentState = stateController.getCurrentStateFor('some_destination_screen');

    expect(currentState).toBeInstanceOf(Mounted);
    expect(currentState?.previousState).toBeInstanceOf(Started);
    expect((currentState?.previousState as Started).type).toBe('flow_start');
    expect(currentState?.previousState?.previousState).toBeUndefined();
    expect((currentState?.previousState as Started).sourceScreen).toBe('some_source_screen');
  });

  it('does not throw an error if a screen is unmounted after a flow reset', () => {
    stateController.onNavigationStarted({
      sourceScreen: 'some_source_screen',
    });

    stateController.onScreenMounted({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id',
    });

    stateController.onRenderPassCompleted({
      renderPassName: 'pass1',
      timestamp: 1234,
      destinationScreen: 'some_destination_screen',
      interactive: true,
      componentInstanceId: 'id',
    });

    stateController.onFlowReset({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id',
    });

    stateController.onRenderPassCompleted({
      renderPassName: 'pass1',
      timestamp: 1234,
      componentInstanceId: 'id',
      destinationScreen: 'some_destination_screen',
      interactive: true,
    });

    expect(() => {
      stateController.onScreenUnmounted({
        destinationScreen: 'some_destination_screen',
        componentInstanceId: 'id',
      });
    }).not.toThrowError(InvalidMountStateError);

    expect(stateController.getCurrentStateFor('some_destination_screen')).toBeUndefined();
  });

  it("replaces the old flow's Started state with the new one if onNavigationStarted is called twice for a screen", () => {
    Date.now = jest.fn().mockReturnValueOnce(1500);

    stateController.onNavigationStarted({});
    expect(stateController.getCurrentStateFor(DESTINATION_SCREEN_NAME_PLACEHOLDER)?.timestamp).toStrictEqual(
      new BridgedEventTimestamp(1500, undefined),
    );

    Date.now = jest.fn().mockReturnValueOnce(1700);
    expect(() => {
      stateController.onNavigationStarted({});
    }).toThrowError(MultipleFlowsError);

    expect(stateController.getCurrentStateFor(DESTINATION_SCREEN_NAME_PLACEHOLDER)).toStrictEqual(
      new Started({
        sourceScreen: undefined,
        componentInstanceId: DESTINATION_SCREEN_NAME_PLACEHOLDER,
        destinationScreen: DESTINATION_SCREEN_NAME_PLACEHOLDER,
        type: 'flow_start',
        timestamp: new BridgedEventTimestamp(1700, undefined),
        previousState: undefined,
        snapshotId: expect.any(Promise),
        operationsSnapshot: new OngoingOperationsRegistry(),
      }),
    );
  });

  it("replaces the old flow's watchdog timer with a new one if onNavigationStarted is called twice for a screen", () => {
    stateController.onNavigationStarted({});
    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS * 0.5);

    Date.now = jest.fn().mockReturnValueOnce(1700);
    expect(() => {
      stateController.onNavigationStarted({
        renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS + 500,
      });
    }).toThrowError(MultipleFlowsError);

    jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);

    expect(onRenderTimeout).not.toHaveBeenCalledWith(expect.any(RenderTimeoutError));

    jest.advanceTimersByTime(500);

    expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(RenderTimeoutError));
  });

  it('stops the current flow if instance is not already mounted', () => {
    stateController.onNavigationStarted({});
    stateController.onScreenMounted({
      destinationScreen: 'some_destination_screen',
      componentInstanceId: 'id',
    });
    stateController.onNavigationStarted({});
    stateController.stopFlowIfNeeded('id-2');
    expect(stateController.getCurrentStateFor(DESTINATION_SCREEN_NAME_PLACEHOLDER)).not.toBeUndefined();
  });

  it('throws a ScreenProfilerNotStartedError when screen mounted without navigation started event first', () => {
    expect(() => {
      stateController.onScreenMounted({
        destinationScreen: 'some_destination_screen',
        componentInstanceId: 'id',
      });
    }).toThrowError(new ScreenProfilerNotStartedError('some_destination_screen', 'id'));
  });
});
