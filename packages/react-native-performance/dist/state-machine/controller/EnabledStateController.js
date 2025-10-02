"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleFlowsError = exports.ReuseComponentInstanceIDError = exports.InvalidMountStateError = exports.DESTINATION_SCREEN_NAME_PLACEHOLDER = void 0;
var tslib_1 = require("tslib");
var exceptions_1 = require("../../exceptions");
var utils_1 = require("../../utils");
var BridgedEventTimestamp_1 = require("../../BridgedEventTimestamp");
var states_1 = require("../states");
var state_utils_1 = require("../states/state-utils");
var Logger_1 = tslib_1.__importStar(require("../../utils/Logger"));
exports.DESTINATION_SCREEN_NAME_PLACEHOLDER = '__unknown_destination_screen__';
var InvalidNewDestinationScreenError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidNewDestinationScreenError, _super);
    function InvalidNewDestinationScreenError(destinationScreen, newDestinationScreen) {
        var _this = _super.call(this, "The destinationScreen (".concat(destinationScreen, ") does not match the one recorded inside the new state object (").concat(newDestinationScreen, ")."), 'bug') || this;
        _this.name = 'InvalidNewDestinationScreenError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, InvalidNewDestinationScreenError.prototype);
        return _this;
    }
    return InvalidNewDestinationScreenError;
}(exceptions_1.PerformanceProfilerError));
var InvalidOldDestinationScreenError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidOldDestinationScreenError, _super);
    function InvalidOldDestinationScreenError(destinationScreen, oldDestinationScreen) {
        var _this = _super.call(this, "The destinationScreen (".concat(destinationScreen, ") does not match the one recorded inside the old state object (").concat(oldDestinationScreen, ")."), 'bug') || this;
        _this.name = 'InvalidOldDestinationScreenError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, InvalidOldDestinationScreenError.prototype);
        return _this;
    }
    return InvalidOldDestinationScreenError;
}(exceptions_1.PerformanceProfilerError));
var InvalidMountStateError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidMountStateError, _super);
    function InvalidMountStateError(destinationScreen, componentInstanceId) {
        var _this = _super.call(this, "No matching ".concat(states_1.Mounted.STATE_NAME, " state found for componentInstanceId ").concat(componentInstanceId, " for screen ").concat(destinationScreen, "."), 'bug') || this;
        _this.name = 'InvalidMountStateError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, InvalidMountStateError.prototype);
        return _this;
    }
    return InvalidMountStateError;
}(exceptions_1.PerformanceProfilerError));
exports.InvalidMountStateError = InvalidMountStateError;
var ReuseComponentInstanceIDError = /** @class */ (function (_super) {
    tslib_1.__extends(ReuseComponentInstanceIDError, _super);
    function ReuseComponentInstanceIDError(destinationScreen, componentInstanceId) {
        var _this = _super.call(this, "Cannot reuse the same snapshotId ".concat(componentInstanceId, " for successive mounts of screen ").concat(destinationScreen, "."), 'bug') || this;
        _this.name = 'ReuseSnapshotIDError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, ReuseComponentInstanceIDError.prototype);
        return _this;
    }
    return ReuseComponentInstanceIDError;
}(exceptions_1.PerformanceProfilerError));
exports.ReuseComponentInstanceIDError = ReuseComponentInstanceIDError;
var InvalidStateError = /** @class */ (function (_super) {
    tslib_1.__extends(InvalidStateError, _super);
    function InvalidStateError(destinationScreen, stateName) {
        var _this = _super.call(this, "Something went wrong. The state corresponding to the DESTINATION_SCREEN_NAME_PLACEHOLDER screen name should only ever be of type ".concat(states_1.Started.STATE_NAME, ". It actually is: ").concat(stateName), 'bug') || this;
        _this.name = 'InvalidStateError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, InvalidStateError.prototype);
        return _this;
    }
    return InvalidStateError;
}(exceptions_1.PerformanceProfilerError));
/**
 * This can happen if you have a non-standard navigation flow, such as here: https://github.com/Shopify/react-native-performance/issues/97
 */
var MultipleFlowsError = /** @class */ (function (_super) {
    tslib_1.__extends(MultipleFlowsError, _super);
    function MultipleFlowsError(destinationScreen) {
        var _this = _super.call(this, 'The navigation for one screen was already queued up when another one was added. This ' +
            'could imply that a previously queued screen was never rendered.', 'fatal') || this;
        _this.name = 'MultipleFlowsError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, MultipleFlowsError.prototype);
        return _this;
    }
    return MultipleFlowsError;
}(exceptions_1.PerformanceProfilerError));
exports.MultipleFlowsError = MultipleFlowsError;
var EnabledStateController = /** @class */ (function () {
    function EnabledStateController() {
        this.isEnabled = true;
        this.renderTimeoutConfig = {
            enabled: false,
        };
        this.stateRegistry = new Map();
        this.watchdogTimers = new Map();
        this.onStateChangedListeners = [];
    }
    EnabledStateController.prototype.onAppStarted = function () {
        this.onFlowStart({
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder()
                .nativeTimestamp((0, utils_1.getNativeStartupTimestamp)())
                .epochReference()
                .build(),
            sourceScreen: undefined,
            renderTimeoutMillisOverride: undefined,
            type: 'app_boot',
        });
    };
    EnabledStateController.prototype.configureRenderTimeout = function (config) {
        this.renderTimeoutConfig = config;
        if (config.enabled) {
            this.addWatchdogTimersForUnwatchedComponents();
        }
        else {
            this.clearAllWatchdogTimers();
        }
    };
    EnabledStateController.prototype.addStateChangedListener = function (listener) {
        this.onStateChangedListeners.push(listener);
    };
    EnabledStateController.prototype.removeStateChangedListener = function (listener) {
        var _this = this;
        this.onStateChangedListeners
            .reduce(function (indices, currentListener, index) {
            if (listener === currentListener) {
                indices.push(index);
            }
            return indices;
        }, [])
            .forEach(function (index) {
            _this.onStateChangedListeners.splice(index, 1);
        });
    };
    EnabledStateController.prototype.getCurrentStateFor = function (destinationScreenToReportPattern) {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.stateRegistry.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var state = _c.value;
                if ((0, utils_1.matchesPattern)(state.destinationScreen, destinationScreenToReportPattern)) {
                    return state;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return undefined;
    };
    EnabledStateController.prototype.onNavigationStarted = function (_a) {
        var sourceScreen = _a.sourceScreen, uiEvent = _a.uiEvent, renderTimeoutMillisOverride = _a.renderTimeoutMillisOverride;
        var oldState = this.stateRegistry.get(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
        if (oldState instanceof states_1.Started && oldState.type === 'app_boot') {
            Logger_1.default.debug('Skipping starting new flow after navigation started since app_boot flow is already in progress');
            return;
        }
        this.onFlowStart({
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder()
                .nativeTimestamp(uiEvent === null || uiEvent === void 0 ? void 0 : uiEvent.nativeEvent.timestamp)
                .systemBootReference()
                .build(),
            sourceScreen: sourceScreen,
            renderTimeoutMillisOverride: renderTimeoutMillisOverride,
            type: 'flow_start',
        });
    };
    EnabledStateController.prototype.onScreenMounted = function (_a) {
        var destinationScreen = _a.destinationScreen, componentInstanceId = _a.componentInstanceId;
        if (this.stateRegistry.has(componentInstanceId)) {
            throw new ReuseComponentInstanceIDError(destinationScreen, componentInstanceId);
        }
        var oldState = this.safeGetCurrentState(destinationScreen, componentInstanceId);
        this.changeStateTo(destinationScreen, componentInstanceId, new states_1.Mounted({
            destinationScreen: destinationScreen,
            componentInstanceId: componentInstanceId,
            snapshotId: (0, utils_1.getNativeUuid)(),
            previousState: oldState,
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
        }));
    };
    EnabledStateController.prototype.onScreenUnmounted = function (_a) {
        var destinationScreen = _a.destinationScreen, componentInstanceId = _a.componentInstanceId;
        if (!this.stateRegistry.get(componentInstanceId)) {
            throw new InvalidMountStateError(destinationScreen, componentInstanceId);
        }
        var oldState = this.safeGetCurrentState(destinationScreen, componentInstanceId);
        var unmounted = new states_1.Unmounted({
            destinationScreen: destinationScreen,
            componentInstanceId: componentInstanceId,
            snapshotId: (0, utils_1.getNativeUuid)(),
            previousState: oldState,
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
        });
        this.changeStateTo(destinationScreen, componentInstanceId, unmounted);
        var isScreenReadyForUnmount = this.hasMatchingMountUnmountPairs(destinationScreen, componentInstanceId);
        if (isScreenReadyForUnmount) {
            this.stopWatchdogTimerForComponent(componentInstanceId);
            var reachedInteractiveRenderedState = (0, state_utils_1.reverseReduce)(oldState, function (state, reachedInteractiveRenderedState) {
                return reachedInteractiveRenderedState || (state instanceof states_1.Rendered && state.interactive);
            }, false);
            if (!reachedInteractiveRenderedState) {
                this.changeStateTo(destinationScreen, componentInstanceId, new states_1.RenderAborted({
                    destinationScreen: destinationScreen,
                    componentInstanceId: componentInstanceId,
                    previousState: oldState,
                    timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().build(),
                    snapshotId: (0, utils_1.getNativeUuid)(),
                }));
            }
            // Cleanup the memory associated with this screen now that it has been fully torn down.
            this.stateRegistry.delete(componentInstanceId);
        }
    };
    EnabledStateController.prototype.onFlowReset = function (_a) {
        var sourceScreen = _a.sourceScreen, destinationScreen = _a.destinationScreen, uiEvent = _a.uiEvent, renderTimeoutMillisOverride = _a.renderTimeoutMillisOverride, componentInstanceId = _a.componentInstanceId;
        var previousState = this.safeGetCurrentState(destinationScreen, componentInstanceId);
        this.stopWatchdogTimerForComponent(componentInstanceId);
        this.changeStateTo(destinationScreen, componentInstanceId, new states_1.Started({
            // If no source screen is provided explicitly, the screen is being reset internally.
            // So the destination === source.
            sourceScreen: sourceScreen !== null && sourceScreen !== void 0 ? sourceScreen : destinationScreen,
            destinationScreen: destinationScreen,
            componentInstanceId: componentInstanceId,
            timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder()
                .nativeTimestamp(uiEvent === null || uiEvent === void 0 ? void 0 : uiEvent.nativeEvent.timestamp)
                .systemBootReference()
                .build(),
            previousState: previousState,
            snapshotId: (0, utils_1.getNativeUuid)(),
            type: 'flow_reset',
        }));
        this.addRenderWatchdogTimerIfEnabled(componentInstanceId, renderTimeoutMillisOverride);
    };
    EnabledStateController.prototype.onRenderPassCompleted = function (props) {
        var oldState = this.safeGetCurrentState(props.destinationScreen, props.componentInstanceId);
        if (props.interactive) {
            this.stopWatchdogTimerForComponent(props.componentInstanceId);
        }
        var nextState = new states_1.Rendered(tslib_1.__assign(tslib_1.__assign({}, props), { previousState: oldState, timestamp: new BridgedEventTimestamp_1.BridgedEventTimestampBuilder().nativeTimestamp(props.timestamp).epochReference().build(), snapshotId: (0, utils_1.getNativeUuid)() }));
        this.changeStateTo(props.destinationScreen, props.componentInstanceId, nextState);
    };
    EnabledStateController.prototype.onFlowStart = function (_a) {
        var timestamp = _a.timestamp, sourceScreen = _a.sourceScreen, type = _a.type, renderTimeoutMillisOverride = _a.renderTimeoutMillisOverride;
        var startedMultipleFlows = false;
        if (this.stateRegistry.has(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER)) {
            startedMultipleFlows = true;
            this.stopWatchdogTimerForComponent(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
            this.stateRegistry.delete(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
        }
        // The root screen's name is unknown in the beginning.
        // This will get migrated once the main screen's name is known.
        this.changeStateTo(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER, exports.DESTINATION_SCREEN_NAME_PLACEHOLDER, new states_1.Started({
            timestamp: timestamp,
            sourceScreen: sourceScreen,
            componentInstanceId: exports.DESTINATION_SCREEN_NAME_PLACEHOLDER,
            destinationScreen: exports.DESTINATION_SCREEN_NAME_PLACEHOLDER,
            previousState: undefined,
            snapshotId: (0, utils_1.getNativeUuid)(),
            type: type,
        }));
        this.addRenderWatchdogTimerIfEnabled(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER, renderTimeoutMillisOverride);
        // Throw the error at the very end to ensure that if this warning is suppressed, the state machine
        // still continues operating in a semi-reasonable way. We're choosing to drop the previous "Started"
        // state in favour of the new flow.
        if (startedMultipleFlows) {
            throw new MultipleFlowsError(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
        }
    };
    /**
     * Stops current flow if the screen was already mounted.
     * This can occur when navigating repeatedly to the same instance of a screen.
     * @param componentInstanceId Instance ID of the mounted screen.
     */
    EnabledStateController.prototype.stopFlowIfNeeded = function (componentInstanceId) {
        var oldState = this.stateRegistry.get(componentInstanceId);
        if (oldState !== undefined) {
            this.stateRegistry.delete(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
            var watchdogTimerId = this.findWatchdogTimerIdForComponent(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
            if (watchdogTimerId !== undefined) {
                clearTimeout(watchdogTimerId);
                this.watchdogTimers.delete(watchdogTimerId);
            }
        }
    };
    EnabledStateController.prototype.safeGetCurrentState = function (destinationScreen, componentInstanceId) {
        this.onDestinationScreenNameAcquired({
            destinationScreen: destinationScreen,
            componentInstanceId: componentInstanceId,
        });
        var oldState = this.stateRegistry.get(componentInstanceId);
        if (oldState === undefined) {
            throw new exceptions_1.ScreenProfilerNotStartedError(destinationScreen, componentInstanceId);
        }
        return oldState;
    };
    EnabledStateController.prototype.onDestinationScreenNameAcquired = function (props) {
        var oldState = this.stateRegistry.get(props.componentInstanceId);
        if (oldState === undefined && this.stateRegistry.has(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER)) {
            // Migrate the previous state that was linked to an unknown screen name
            // to this one. The destination screen's name is unknown when the "start flow" or "start app" events arrive.
            var actualOldState_1 = this.stateRegistry.get(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
            if (!(actualOldState_1 instanceof states_1.Started)) {
                throw new InvalidStateError(props.destinationScreen, actualOldState_1.getStateName());
            }
            var migratedState_1 = actualOldState_1.updateState(props.destinationScreen, props.componentInstanceId);
            this.stateRegistry.set(props.componentInstanceId, migratedState_1);
            this.stateRegistry.delete(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
            var watchdogTimerId = this.findWatchdogTimerIdForComponent(exports.DESTINATION_SCREEN_NAME_PLACEHOLDER);
            if (watchdogTimerId !== undefined) {
                this.watchdogTimers.set(watchdogTimerId, props.componentInstanceId);
            }
            this.onStateChangedListeners.forEach(function (listener) {
                return listener(props.destinationScreen, actualOldState_1, migratedState_1);
            });
        }
    };
    EnabledStateController.prototype.changeStateTo = function (destinationScreen, componentInstanceId, newState) {
        if (destinationScreen !== newState.destinationScreen) {
            throw new InvalidNewDestinationScreenError(destinationScreen, newState.destinationScreen);
        }
        var oldState = this.stateRegistry.get(componentInstanceId);
        if (oldState !== undefined && oldState.destinationScreen !== destinationScreen) {
            throw new InvalidOldDestinationScreenError(destinationScreen, oldState.destinationScreen);
        }
        this.stateRegistry.set(componentInstanceId, newState);
        this.onStateChangedListeners.forEach(function (listener) { return listener(destinationScreen, oldState, newState); });
        Logger_1.default.debug("State: ".concat(newState.toString()));
        assertRenderPassNamesUnique(newState);
    };
    EnabledStateController.prototype.stopWatchdogTimerForComponent = function (componentInstanceId) {
        var watchdogTimerId = this.findWatchdogTimerIdForComponent(componentInstanceId);
        if (watchdogTimerId !== undefined) {
            clearTimeout(watchdogTimerId);
            this.watchdogTimers.delete(watchdogTimerId);
        }
    };
    EnabledStateController.prototype.findWatchdogTimerIdForComponent = function (componentInstanceId) {
        var e_2, _a;
        try {
            for (var _b = tslib_1.__values(this.watchdogTimers.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = tslib_1.__read(_c.value, 2), watchdogTimerId = _d[0], _componentInstanceId = _d[1];
                if (_componentInstanceId === componentInstanceId) {
                    return watchdogTimerId;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return undefined;
    };
    EnabledStateController.prototype.addRenderWatchdogTimerIfEnabled = function (componentInstanceId, renderTimeoutMillisOverride) {
        var _this = this;
        if (renderTimeoutMillisOverride === void 0) { renderTimeoutMillisOverride = undefined; }
        if (!this.renderTimeoutConfig.enabled) {
            return;
        }
        var effectiveTimeoutMillis = renderTimeoutMillisOverride !== null && renderTimeoutMillisOverride !== void 0 ? renderTimeoutMillisOverride : this.renderTimeoutConfig.renderTimeoutMillis;
        var onRenderTimeout = this.renderTimeoutConfig.onRenderTimeout;
        var timeoutId = setTimeout(function () {
            // Re-fetch the screen name from the map, because the main screen's placeholder
            // name might've been replaced with the actual name by this point.
            var currentComponentInstanceId = _this.watchdogTimers.get(timeoutId);
            var currentState = _this.stateRegistry.get(currentComponentInstanceId);
            _this.watchdogTimers.delete(timeoutId);
            var reachedInteractiveRenderedState = currentState &&
                (0, state_utils_1.reverseReduce)(currentState, function (state, reachedInteractiveRenderedState) {
                    return reachedInteractiveRenderedState || (state instanceof states_1.Rendered && state.interactive);
                }, false);
            if (currentState !== undefined && reachedInteractiveRenderedState === false) {
                onRenderTimeout(new exceptions_1.RenderTimeoutError(currentState.destinationScreen, effectiveTimeoutMillis, currentState));
            }
        }, effectiveTimeoutMillis);
        this.watchdogTimers.set(timeoutId, componentInstanceId);
    };
    EnabledStateController.prototype.clearAllWatchdogTimers = function () {
        this.watchdogTimers.forEach(function (_, watchdogTimerId) { return clearTimeout(watchdogTimerId); });
        this.watchdogTimers.clear();
    };
    EnabledStateController.prototype.addWatchdogTimersForUnwatchedComponents = function () {
        var e_3, _a;
        var componentInstanceIdsWithWatchdogs = new Set(this.watchdogTimers.values());
        try {
            for (var _b = tslib_1.__values(this.stateRegistry.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var state = _c.value;
                if (!componentInstanceIdsWithWatchdogs.has(state.componentInstanceId)) {
                    this.addRenderWatchdogTimerIfEnabled(state.componentInstanceId);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    EnabledStateController.prototype.hasMatchingMountUnmountPairs = function (destinationScreen, componentInstanceId) {
        var e_4, _a;
        var oldState = this.stateRegistry.get(componentInstanceId);
        if (oldState === undefined) {
            throw new exceptions_1.ScreenProfilerNotStartedError(destinationScreen, componentInstanceId);
        }
        var mountUnmountRecord = (0, state_utils_1.reverseReduce)(oldState, function (state, registry) {
            var _a;
            if (state instanceof states_1.Mounted || state instanceof states_1.Unmounted) {
                var entry = (_a = registry.get(state.componentInstanceId)) !== null && _a !== void 0 ? _a : {};
                if (state instanceof states_1.Mounted) {
                    entry.mounted = state;
                }
                else {
                    entry.unmounted = state;
                }
                registry.set(state.componentInstanceId, entry);
            }
            return registry;
        }, new Map(), {
            // It's possible that the flow was reset after the screen was mounted. So we need to traverse back all the way
            // to the first known state in the chain, and not stop at the last "Started" state.
            stopAtStartState: false,
        }).values();
        try {
            for (var mountUnmountRecord_1 = tslib_1.__values(mountUnmountRecord), mountUnmountRecord_1_1 = mountUnmountRecord_1.next(); !mountUnmountRecord_1_1.done; mountUnmountRecord_1_1 = mountUnmountRecord_1.next()) {
                var _b = mountUnmountRecord_1_1.value, mounted = _b.mounted, unmounted = _b.unmounted;
                if (mounted === undefined || unmounted === undefined) {
                    return false;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (mountUnmountRecord_1_1 && !mountUnmountRecord_1_1.done && (_a = mountUnmountRecord_1.return)) _a.call(mountUnmountRecord_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return true;
    };
    return EnabledStateController;
}());
exports.default = EnabledStateController;
function assertRenderPassNamesUnique(finalState) {
    if (Logger_1.default.logLevel > Logger_1.LogLevel.Info) {
        return;
    }
    var seenRenderPasses = new Map();
    (0, state_utils_1.reverseTraverse)(finalState, function (state) {
        if (state instanceof states_1.Rendered) {
            var previousRenderedState = seenRenderPasses.get(state.renderPassName);
            if (previousRenderedState !== undefined && previousRenderedState.snapshotId !== state.snapshotId) {
                Logger_1.default.info("Looks like you used the same render pass name '".concat(state.renderPassName, "' multiple times on the ").concat(state.destinationScreen, " screen. ") +
                    'A renderPassName can help uniquely identifying a UI state in which a given screen can render (e.g., "loading", "cached_render", "first_contentful_paint", etc.). ' +
                    'If you do not expect to see the same renderPassName multiple times, it is often a sign that your screen might be going through ' +
                    'some unexpected state changes. If you are debugging a performance issue, we recommend:\n' +
                    'i) debugging the prop/state change that is leading to these unnecessary re-renders, and fix them if the re-renders were not expected,\n' +
                    'ii) assigning different renderPassNames to these render passes so that you can distinguish between them in the output reports if the re-renders were expected.');
            }
            seenRenderPasses.set(state.renderPassName, state);
        }
    });
}
//# sourceMappingURL=EnabledStateController.js.map