"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var state_machine_1 = require("../../../state-machine");
var BridgedEventTimestamp_1 = tslib_1.__importStar(require("../../../BridgedEventTimestamp"));
var exceptions_1 = require("../../../exceptions");
var utils_1 = require("../../../utils");
var Logger_1 = tslib_1.__importStar(require("../../../utils/Logger"));
var EnabledStateController_1 = require("../../../state-machine/controller/EnabledStateController");
var RENDER_TIMEOUT_MILLIS = 5000;
jest.mock('../../../utils/native-performance-module', function () {
    var actual = jest.requireActual('../../../utils/native-performance-module');
    return tslib_1.__assign(tslib_1.__assign({}, actual), { getNativeUuid: jest.fn() });
});
jest.mock('../../../utils/Logger', function () {
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
var getNativeUuidMock = utils_1.getNativeUuid;
var getNativeStartupTimestampMock = utils_1.getNativeStartupTimestamp;
var matchesPatternMock = utils_1.matchesPattern;
jest.mock('../../../utils', function () {
    return {
        getNativeUuid: jest.fn(),
        getNativeStartupTimestamp: jest.fn(),
        matchesPattern: jest.fn(),
    };
});
describe('state-machine/controller/EnabledStateController', function () {
    var onStateChangedListener;
    var stateController;
    var onRenderTimeout;
    beforeEach(function () {
        Logger_1.default.logLevel = Logger_1.LogLevel.Info;
        jest.spyOn(Date, 'now').mockReturnValueOnce(1500);
        jest.useFakeTimers('legacy');
        onStateChangedListener = jest.fn();
        onRenderTimeout = jest.fn();
        stateController = new state_machine_1.EnabledStateController();
        stateController.configureRenderTimeout({
            enabled: true,
            renderTimeoutMillis: RENDER_TIMEOUT_MILLIS,
            onRenderTimeout: onRenderTimeout,
        });
        stateController.addStateChangedListener(onStateChangedListener);
        getNativeUuidMock.mockImplementation(function () { return Promise.resolve("".concat(Math.random())); });
        getNativeStartupTimestampMock.mockImplementation(function () { return Promise.resolve(1500); });
        matchesPatternMock.mockImplementation(function (screenA, screenB) { return screenA === screenB; });
    });
    afterEach(function () {
        jest.clearAllTimers();
        jest.useRealTimers();
        jest.resetAllMocks();
    });
    it('starts the state machine in the Started state when onAppStarted is called', function () {
        Date.now = jest.fn().mockReturnValueOnce(1500);
        stateController.onAppStarted();
        var expectedState = new state_machine_1.Started({
            timestamp: new BridgedEventTimestamp_1.default(1500, expect.any(Promise)),
            sourceScreen: undefined,
            componentInstanceId: state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER,
            destinationScreen: state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER,
            previousState: undefined,
            snapshotId: expect.any(Promise),
            type: 'app_boot',
        });
        expect(onStateChangedListener).toHaveBeenCalledTimes(1);
        expect(onStateChangedListener).toHaveBeenCalledWith(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER, undefined, expectedState);
        expect(Logger_1.default.debug).toHaveBeenCalledTimes(1);
        expect(stateController.getCurrentStateFor(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER)).toBeInstanceOf(state_machine_1.Started);
    });
    it("registers the main screen's name once the first state transition occurs", function () {
        stateController.onAppStarted();
        // The destinationScreen in the state registry and the state object is DESTINATION_SCREEN_NAME_PLACEHOLDER in the beginning
        var state = stateController.getCurrentStateFor(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER);
        expect(state.destinationScreen).toBe(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER);
        // No listeners are triggered for the internal Started state migration to adopt the known destinationScreen name.
        stateController.onRenderPassCompleted({
            destinationScreen: 'SomeInitialScreen',
            componentInstanceId: 'id',
            renderPassName: 'pass1',
            interactive: false,
            timestamp: 2000,
        });
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeInitialScreen', expect.any(state_machine_1.Started), expect.any(state_machine_1.Rendered));
        expect(onStateChangedListener).not.toHaveBeenCalledWith(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER, expect.any(state_machine_1.Started), expect.any(state_machine_1.Rendered));
        matchesPatternMock.mockReturnValue(true);
        state = stateController.getCurrentStateFor('SomeInitialScreen#id');
        expect(state.destinationScreen).toBe('SomeInitialScreen');
        // The original Started state link is also migrated to use the new name
        expect((0, state_machine_1.getFlowStartState)(state).destinationScreen).toBe('SomeInitialScreen');
    });
    it('skips state transition if onNavigationStarted is called and the current state is Started of type app_boot', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            Date.now = jest.fn().mockReturnValueOnce(1500);
            stateController.onAppStarted();
            stateController.onNavigationStarted({});
            expect(onStateChangedListener).toHaveBeenLastCalledWith(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER, undefined, new state_machine_1.Started({
                timestamp: new BridgedEventTimestamp_1.default(1500, expect.any(Promise)),
                sourceScreen: undefined,
                destinationScreen: state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER,
                componentInstanceId: state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER,
                previousState: undefined,
                snapshotId: expect.any(Promise),
                type: 'app_boot',
            }));
            return [2 /*return*/];
        });
    }); });
    it('transitions to Started when onNavigationStarted is called', function () {
        stateController.onNavigationStarted({});
        expect(onStateChangedListener).toHaveBeenLastCalledWith(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER, undefined, expect.any(state_machine_1.Started));
    });
    it('throws an error if onNavigationStarted is called for a screen twice', function () {
        stateController.onNavigationStarted({});
        expect(function () {
            stateController.onNavigationStarted({});
        }).toThrowError(EnabledStateController_1.MultipleFlowsError);
    });
    it('does not throw an error if onNavigationStarted is called again when there was no other pending screen in a Started state', function () {
        var componentInstanceId = 'id';
        stateController.onNavigationStarted({});
        stateController.onScreenMounted({
            destinationScreen: 'SomeTargetScreen',
            componentInstanceId: componentInstanceId,
        });
        stateController.onRenderPassCompleted({
            destinationScreen: 'SomeTargetScreen',
            componentInstanceId: componentInstanceId,
            timestamp: 2000,
            renderPassName: 'rendered_completely',
            interactive: true,
        });
        Date.now = jest.fn().mockReturnValueOnce(2100);
        stateController.onScreenUnmounted({
            destinationScreen: 'SomeTargetScreen',
            componentInstanceId: componentInstanceId,
        });
        Date.now = jest.fn().mockReturnValueOnce(2200);
        stateController.onNavigationStarted({});
        expect(onStateChangedListener).toHaveBeenLastCalledWith(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER, undefined, expect.any(state_machine_1.Started));
    });
    it('transitions to Rendered state if onRenderPassCompleted is called when the current state is Started', function () {
        stateController.onAppStarted();
        stateController.onRenderPassCompleted({
            destinationScreen: 'SomeTargetScreen',
            componentInstanceId: 'id',
            timestamp: 2000,
            renderPassName: 'rendered_completely',
            interactive: true,
        });
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeTargetScreen', expect.any(state_machine_1.Started), new state_machine_1.Rendered({
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(2000).epochReference().build(),
            destinationScreen: 'SomeTargetScreen',
            componentInstanceId: 'id',
            renderPassName: 'rendered_completely',
            previousState: expect.any(state_machine_1.Started),
            interactive: true,
            snapshotId: expect.any(Promise),
        }));
    });
    it('throws a RenderTimeoutError if the screen stays on Started state for more than the max allowed time', function () {
        stateController.onAppStarted();
        expect(onRenderTimeout).not.toHaveBeenCalled();
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
        expect(onRenderTimeout).toHaveBeenCalledTimes(1);
        expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(exceptions_1.RenderTimeoutError));
    });
    it('does not throw a RenderTimeoutError if the navigation started flow is stopped', function () {
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
    it('throws a RenderTimeoutError if the screen stays on Rendered(interactive = false) state for more than the max allowed time', function () {
        stateController.onAppStarted();
        stateController.onRenderPassCompleted({
            destinationScreen: 'SomeScreenName',
            componentInstanceId: 'id',
            timestamp: 1000,
            renderPassName: 'rendered_completely',
            interactive: false,
        });
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Started), expect.any(state_machine_1.Rendered));
        expect(onRenderTimeout).not.toHaveBeenCalled();
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
        expect(onRenderTimeout).toHaveBeenCalledTimes(1);
        expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(exceptions_1.RenderTimeoutError));
    });
    it('does not throw a RenderTimeoutError if the screen reaches Rendered(interactive = true) before the max allowed time', function () {
        stateController.onAppStarted();
        stateController.onRenderPassCompleted({
            destinationScreen: 'SomeScreenName',
            componentInstanceId: 'id',
            timestamp: 1000,
            renderPassName: 'rendered_completely',
            interactive: true,
        });
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Started), expect.any(state_machine_1.Rendered));
    });
    it('does not throw a RenderTimeoutError if the screen aborts render before the max allowed time', function () {
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
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Unmounted), expect.any(state_machine_1.RenderAborted));
    });
    it('does not throw a RenderTimeoutError if the flow is reset before the max allowed time', function () {
        stateController.onAppStarted();
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS * 0.5);
        stateController.onFlowReset({
            destinationScreen: 'SomeScreenName',
            componentInstanceId: 'id',
        });
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS * 0.75);
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Started), expect.any(state_machine_1.Started));
        expect(onRenderTimeout).not.toHaveBeenCalled();
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS * 0.25);
        expect(onRenderTimeout).toHaveBeenCalledTimes(1);
        expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(exceptions_1.RenderTimeoutError));
    });
    it('does not throw a RenderTimeoutError if the render watchdogs are disabled', function () {
        stateController.configureRenderTimeout({ enabled: false });
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
        expect(onRenderTimeout).not.toHaveBeenCalled();
    });
    it('does not transition to RenderAborted state if the screen is unmounted after an interactive state is reached', function () {
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
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Mounted), expect.any(state_machine_1.Rendered));
        Date.now = jest.fn().mockReturnValueOnce(1650);
        stateController.onScreenUnmounted({
            destinationScreen: 'SomeScreenName',
            componentInstanceId: 'id',
        });
        // Does not transition to RenderAborted, since at least 1 interactive state was reached
        expect(onStateChangedListener).toHaveBeenCalledTimes(5);
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Rendered), expect.any(state_machine_1.Unmounted));
        expect(stateController.getCurrentStateFor('SomeScreenName')).toBeUndefined();
    });
    it('transitions to RenderAborted state if the screen is unmounted before an interactive state is reached', function () {
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
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Mounted), expect.any(state_machine_1.Rendered));
        Date.now = jest.fn().mockReturnValueOnce(1650);
        stateController.onScreenUnmounted({
            destinationScreen: 'SomeScreenName',
            componentInstanceId: 'id',
        });
        // Transitions to RenderAborted, since at least 1 interactive state was reached
        expect(onStateChangedListener).toHaveBeenCalledTimes(6);
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Unmounted), expect.any(state_machine_1.RenderAborted));
        expect(stateController.getCurrentStateFor('SomeScreenName')).toBeUndefined();
    });
    it('transitions to RenderAborted state if the screen is unmounted before any Rendered state is reached', function () {
        stateController.onAppStarted();
        stateController.onScreenMounted({
            destinationScreen: 'SomeScreenName',
            componentInstanceId: 'id',
        });
        stateController.onScreenUnmounted({
            destinationScreen: 'SomeScreenName',
            componentInstanceId: 'id',
        });
        expect(onStateChangedListener).toHaveBeenLastCalledWith('SomeScreenName', expect.any(state_machine_1.Unmounted), expect.any(state_machine_1.RenderAborted));
        expect(stateController.getCurrentStateFor('SomeScreenName')).toBeUndefined();
    });
    it('adds a new state changed listener correctly', function () {
        stateController.onAppStarted();
        var onStateChangedListener2 = jest.fn();
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
        expect(onStateChangedListener2).toHaveBeenCalledWith('SomeScreenName', expect.any(state_machine_1.Started), expect.any(state_machine_1.Rendered));
    });
    it('removes a previously added state changed listener correctly', function () {
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
    it('returns the correct state when polled via getCurrentStateFor with a string screen name', function () {
        stateController.onAppStarted();
        Date.now = jest.fn().mockReturnValueOnce(1600);
        stateController.onRenderPassCompleted({
            renderPassName: 'rendered_completely',
            destinationScreen: 'SomeScreenName',
            componentInstanceId: 'id',
            interactive: true,
            timestamp: 1000,
        });
        expect(stateController.getCurrentStateFor('SomeScreenName')).toBeInstanceOf(state_machine_1.Rendered);
    });
    it('does not throw an error if a screen is opened again if the previous render were aborted', function () {
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
        expect(onStateChangedListener).toHaveBeenLastCalledWith(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER, undefined, expect.any(state_machine_1.Started));
    });
    it('transitions to Rendered(interactive = false) if onRenderPassCompleted is called when the current state is Started', function () {
        stateController.onAppStarted();
        stateController.onRenderPassCompleted({
            renderPassName: 'pass_1',
            componentInstanceId: 'id',
            timestamp: 10,
            destinationScreen: 'some_screen',
            interactive: false,
        });
        expect(stateController.getCurrentStateFor('some_screen')).toStrictEqual(new state_machine_1.Rendered({
            renderPassName: 'pass_1',
            componentInstanceId: 'id',
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(10).epochReference().build(),
            destinationScreen: 'some_screen',
            interactive: false,
            previousState: expect.any(state_machine_1.Started),
            snapshotId: expect.any(Promise),
        }));
    });
    it('transitions to Rendered(interactive = true) if onRenderPassCompleted is called when the current state is Started', function () {
        stateController.onAppStarted();
        stateController.onRenderPassCompleted({
            renderPassName: 'pass_1',
            componentInstanceId: 'id',
            timestamp: 20,
            destinationScreen: 'some_screen',
            interactive: true,
        });
        expect(stateController.getCurrentStateFor('some_screen')).toStrictEqual(new state_machine_1.Rendered({
            renderPassName: 'pass_1',
            componentInstanceId: 'id',
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(20).epochReference().build(),
            destinationScreen: 'some_screen',
            interactive: true,
            previousState: expect.any(state_machine_1.Started),
            snapshotId: expect.any(Promise),
        }));
    });
    it('allows for two non-interactive render-completed events to arrive consecutively', function () {
        stateController.onAppStarted();
        stateController.onRenderPassCompleted({
            renderPassName: 'pass_1',
            componentInstanceId: 'id',
            timestamp: 10,
            destinationScreen: 'some_screen',
            interactive: false,
        });
        var renderPass1Complete = stateController.getCurrentStateFor('some_screen');
        expect(renderPass1Complete).toStrictEqual(new state_machine_1.Rendered({
            renderPassName: 'pass_1',
            componentInstanceId: 'id',
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(10).epochReference().build(),
            destinationScreen: 'some_screen',
            interactive: false,
            previousState: expect.any(state_machine_1.Started),
            snapshotId: expect.any(Promise),
        }));
        stateController.onRenderPassCompleted({
            renderPassName: 'pass_2',
            componentInstanceId: 'id',
            timestamp: 15,
            destinationScreen: 'some_screen',
            interactive: false,
        });
        var renderPass2Complete = stateController.getCurrentStateFor('some_screen');
        expect(renderPass2Complete).toStrictEqual(new state_machine_1.Rendered({
            renderPassName: 'pass_2',
            componentInstanceId: 'id',
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(15).epochReference().build(),
            destinationScreen: 'some_screen',
            interactive: false,
            previousState: renderPass1Complete,
            snapshotId: expect.any(Promise),
        }));
    });
    it('allows for an interactive render-completed event to arrive after a non-interactive render-completed event', function () {
        stateController.onAppStarted();
        stateController.onRenderPassCompleted({
            renderPassName: 'pass_1',
            componentInstanceId: 'id',
            timestamp: 10,
            destinationScreen: 'some_screen',
            interactive: false,
        });
        var renderPass1Complete = stateController.getCurrentStateFor('some_screen');
        expect(renderPass1Complete).toStrictEqual(new state_machine_1.Rendered({
            renderPassName: 'pass_1',
            componentInstanceId: 'id',
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(10).epochReference().build(),
            destinationScreen: 'some_screen',
            interactive: false,
            previousState: expect.any(state_machine_1.Started),
            snapshotId: expect.any(Promise),
        }));
        stateController.onRenderPassCompleted({
            renderPassName: 'pass_2',
            componentInstanceId: 'id',
            timestamp: 15,
            destinationScreen: 'some_screen',
            interactive: true,
        });
        var renderPass2Complete = stateController.getCurrentStateFor('some_screen');
        expect(renderPass2Complete).toStrictEqual(new state_machine_1.Rendered({
            renderPassName: 'pass_2',
            componentInstanceId: 'id',
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(15).epochReference().build(),
            destinationScreen: 'some_screen',
            interactive: true,
            previousState: renderPass1Complete,
            snapshotId: expect.any(Promise),
        }));
    });
    it('allows for a screen to be unmounted in the Rendered(interactive = false) state', function () {
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
        expect(onStateChangedListener).toHaveBeenLastCalledWith('some_screen', expect.any(state_machine_1.Unmounted), expect.any(state_machine_1.RenderAborted));
    });
    it('makes an info log if the same render pass name is used twice', function () {
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
        expect(Logger_1.default.info).toHaveBeenCalledTimes(1);
    });
    it('does not make an info log if the same render pass name is used twice and logger level is higher than info', function () {
        Logger_1.default.logLevel = Logger_1.LogLevel.Warn;
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
        expect(Logger_1.default.info).not.toHaveBeenCalled();
    });
    it('allows for the same render pass name if the flow was reset in between', function () {
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
        var lastState = stateController.getCurrentStateFor('some_screen');
        expect(lastState).toBeInstanceOf(state_machine_1.Rendered);
        expect(lastState.renderPassName).toBe('pass_1');
    });
    it('makes a debug log if the same render pass name is used twice when a non-interactive render is completed', function () {
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
        expect(Logger_1.default.info).toHaveBeenCalledTimes(1);
    });
    it('makes a debug log if the same render pass name is used twice when an interactive render is completed', function () {
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
        expect(Logger_1.default.info).toHaveBeenCalledTimes(1);
    });
    it('updates the state even if `renderPassName` is reused', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var state1, state2, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    stateController.onAppStarted();
                    stateController.onRenderPassCompleted({
                        renderPassName: 'pass_1',
                        componentInstanceId: 'id',
                        timestamp: 10,
                        destinationScreen: 'some_screen',
                        interactive: true,
                    });
                    state1 = stateController.getCurrentStateFor('some_screen');
                    stateController.onRenderPassCompleted({
                        renderPassName: 'pass_1',
                        componentInstanceId: 'id',
                        timestamp: 20,
                        destinationScreen: 'some_screen',
                        interactive: true,
                    });
                    expect(Logger_1.default.info).toHaveBeenCalledTimes(1);
                    expect(onStateChangedListener).toHaveBeenLastCalledWith('some_screen', state1, expect.any(state_machine_1.Rendered));
                    state2 = stateController.getCurrentStateFor('some_screen');
                    expect(state2).not.toBe(state1);
                    _a = expect;
                    return [4 /*yield*/, state2.timestamp.nativeTimestamp];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(20);
                    expect(state2.renderPassName).toBe('pass_1');
                    return [2 /*return*/];
            }
        });
    }); });
    it('uses a custom source screen name if one is provided when resetting the flow', function () {
        stateController.onAppStarted();
        Date.now = jest.fn().mockReturnValue(1700);
        stateController.onFlowReset({
            sourceScreen: 'some_source_screen',
            componentInstanceId: 'id',
            destinationScreen: 'some_screen',
        });
        expect(onStateChangedListener).toHaveBeenCalledTimes(3);
        var expectedFlowRestartState = new state_machine_1.Started({
            sourceScreen: 'some_source_screen',
            componentInstanceId: 'id',
            destinationScreen: 'some_screen',
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().epochReference().build(),
            previousState: expect.any(state_machine_1.Started),
            snapshotId: expect.any(Promise),
            type: 'flow_reset',
        });
        expect(onStateChangedListener).toHaveBeenLastCalledWith('some_screen', expect.any(state_machine_1.Started), expectedFlowRestartState);
    });
    it('uses the renderTimeoutMillisOverride when one is provided on navigation start', function () {
        stateController.onNavigationStarted({
            sourceScreen: 'some_source_screen',
            renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS + 500,
        });
        expect(onRenderTimeout).not.toHaveBeenCalled();
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
        expect(onRenderTimeout).not.toHaveBeenCalled();
        jest.advanceTimersByTime(500);
        expect(onRenderTimeout).toHaveBeenCalledTimes(1);
        expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(exceptions_1.RenderTimeoutError));
    });
    it('uses the renderTimeoutMillisOverride when one is provided on flow reset', function () {
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
        expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(exceptions_1.RenderTimeoutError));
    });
    it('does not configure render timeouts if renderTimeoutMillisOverride is provided on navigation start if they were disabled at the controller level', function () {
        stateController.configureRenderTimeout({ enabled: false });
        stateController.onNavigationStarted({
            sourceScreen: 'some_source_screen',
            renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS + 500,
        });
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS + 600);
        expect(onRenderTimeout).not.toHaveBeenCalled();
    });
    it('does not configure render timeouts if renderTimeoutMillisOverride is provided on flow reset if they were disabled at the controller level', function () {
        stateController.configureRenderTimeout({ enabled: false });
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
    it('checks that the same componentInstanceId is not reused on successive mounts', function () {
        stateController.onNavigationStarted({
            sourceScreen: 'some_source_screen',
        });
        stateController.onScreenMounted({
            destinationScreen: 'some_destination_screen',
            componentInstanceId: 'id',
        });
        expect(function () {
            stateController.onScreenMounted({
                destinationScreen: 'some_destination_screen',
                componentInstanceId: 'id',
            });
        }).toThrowError(EnabledStateController_1.ReuseComponentInstanceIDError);
    });
    it('transitions the state to Mounted when onScreenMounted is called', function () {
        stateController.onNavigationStarted({
            sourceScreen: 'some_source_screen',
        });
        stateController.onScreenMounted({
            destinationScreen: 'some_destination_screen',
            componentInstanceId: 'id',
        });
        expect(onStateChangedListener).toHaveBeenLastCalledWith('some_destination_screen', expect.any(state_machine_1.Started), new state_machine_1.Mounted({
            destinationScreen: 'some_destination_screen',
            componentInstanceId: 'id',
            snapshotId: expect.any(Promise),
            previousState: expect.any(state_machine_1.Started),
            timestamp: expect.any(BridgedEventTimestamp_1.default),
        }));
    });
    it('checks that there was a matching Mounted state when onScreenUnmounted is called', function () {
        stateController.onNavigationStarted({
            sourceScreen: 'some_source_screen',
        });
        stateController.onScreenMounted({
            destinationScreen: 'some_destination_screen',
            componentInstanceId: 'id',
        });
        expect(function () {
            stateController.onScreenUnmounted({
                destinationScreen: 'some_destination_screen',
                componentInstanceId: 'id-2',
            });
        }).toThrowError(EnabledStateController_1.InvalidMountStateError);
    });
    it('retains the source screen name once the main screen name is captured', function () {
        var _a;
        stateController.onNavigationStarted({
            sourceScreen: 'some_source_screen',
        });
        stateController.onScreenMounted({
            destinationScreen: 'some_destination_screen',
            componentInstanceId: 'id-2',
        });
        var currentState = stateController.getCurrentStateFor('some_destination_screen');
        expect(currentState).toBeInstanceOf(state_machine_1.Mounted);
        expect(currentState === null || currentState === void 0 ? void 0 : currentState.previousState).toBeInstanceOf(state_machine_1.Started);
        expect((currentState === null || currentState === void 0 ? void 0 : currentState.previousState).type).toBe('flow_start');
        expect((_a = currentState === null || currentState === void 0 ? void 0 : currentState.previousState) === null || _a === void 0 ? void 0 : _a.previousState).toBeUndefined();
        expect((currentState === null || currentState === void 0 ? void 0 : currentState.previousState).sourceScreen).toBe('some_source_screen');
    });
    it('does not throw an error if a screen is unmounted after a flow reset', function () {
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
        expect(function () {
            stateController.onScreenUnmounted({
                destinationScreen: 'some_destination_screen',
                componentInstanceId: 'id',
            });
        }).not.toThrowError(EnabledStateController_1.InvalidMountStateError);
        expect(stateController.getCurrentStateFor('some_destination_screen')).toBeUndefined();
    });
    it("replaces the old flow's Started state with the new one if onNavigationStarted is called twice for a screen", function () {
        var _a;
        Date.now = jest.fn().mockReturnValueOnce(1500);
        stateController.onNavigationStarted({});
        expect((_a = stateController.getCurrentStateFor(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER)) === null || _a === void 0 ? void 0 : _a.timestamp).toStrictEqual(new BridgedEventTimestamp_1.default(1500, undefined));
        Date.now = jest.fn().mockReturnValueOnce(1700);
        expect(function () {
            stateController.onNavigationStarted({});
        }).toThrowError(EnabledStateController_1.MultipleFlowsError);
        expect(stateController.getCurrentStateFor(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER)).toStrictEqual(new state_machine_1.Started({
            sourceScreen: undefined,
            componentInstanceId: state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER,
            destinationScreen: state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER,
            type: 'flow_start',
            timestamp: new BridgedEventTimestamp_1.default(1700, undefined),
            previousState: undefined,
            snapshotId: expect.any(Promise),
        }));
    });
    it("replaces the old flow's watchdog timer with a new one if onNavigationStarted is called twice for a screen", function () {
        stateController.onNavigationStarted({});
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS * 0.5);
        Date.now = jest.fn().mockReturnValueOnce(1700);
        expect(function () {
            stateController.onNavigationStarted({
                renderTimeoutMillisOverride: RENDER_TIMEOUT_MILLIS + 500,
            });
        }).toThrowError(EnabledStateController_1.MultipleFlowsError);
        jest.advanceTimersByTime(RENDER_TIMEOUT_MILLIS);
        expect(onRenderTimeout).not.toHaveBeenCalledWith(expect.any(exceptions_1.RenderTimeoutError));
        jest.advanceTimersByTime(500);
        expect(onRenderTimeout).toHaveBeenCalledWith(expect.any(exceptions_1.RenderTimeoutError));
    });
    it('stops the current flow if instance is not already mounted', function () {
        stateController.onNavigationStarted({});
        stateController.onScreenMounted({
            destinationScreen: 'some_destination_screen',
            componentInstanceId: 'id',
        });
        stateController.onNavigationStarted({});
        stateController.stopFlowIfNeeded('id-2');
        expect(stateController.getCurrentStateFor(state_machine_1.DESTINATION_SCREEN_NAME_PLACEHOLDER)).not.toBeUndefined();
    });
    it('throws a ScreenProfilerNotStartedError when screen mounted without navigation started event first', function () {
        expect(function () {
            stateController.onScreenMounted({
                destinationScreen: 'some_destination_screen',
                componentInstanceId: 'id',
            });
        }).toThrowError(new exceptions_1.ScreenProfilerNotStartedError('some_destination_screen', 'id'));
    });
});
//# sourceMappingURL=EnabledStateController.test.js.map