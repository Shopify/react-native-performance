"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingJSNativeLatencyError = exports.CompletionTimestampError = void 0;
var tslib_1 = require("tslib");
var react_native_1 = require("react-native");
var states_1 = require("./state-machine/states");
var exceptions_1 = require("./exceptions");
var state_utils_1 = require("./state-machine/states/state-utils");
var CompletionTimestampError = /** @class */ (function (_super) {
    tslib_1.__extends(CompletionTimestampError, _super);
    function CompletionTimestampError(destinationScreen) {
        var _this = _super.call(this, 'completionTimestamp cannot be before flowStartTimestamp.', 'bug') || this;
        _this.name = 'CompletionTimestampError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, CompletionTimestampError.prototype);
        return _this;
    }
    return CompletionTimestampError;
}(exceptions_1.PerformanceProfilerError));
exports.CompletionTimestampError = CompletionTimestampError;
var MissingJSNativeLatencyError = /** @class */ (function (_super) {
    tslib_1.__extends(MissingJSNativeLatencyError, _super);
    function MissingJSNativeLatencyError(destinationScreen) {
        var _this = _super.call(this, 'jsNativeLatency is undefined.', 'bug') || this;
        _this.name = 'MissingJSNativeLatencyError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, MissingJSNativeLatencyError.prototype);
        return _this;
    }
    return MissingJSNativeLatencyError;
}(exceptions_1.PerformanceProfilerError));
exports.MissingJSNativeLatencyError = MissingJSNativeLatencyError;
var renderPassReportGenerator = function (newState) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var flowStartState, previouslyReported, _a, snapshotInfo, flowInfo, startInfo, endInfo;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                flowStartState = (0, state_utils_1.getFlowStartState)(newState);
                if (!(newState instanceof states_1.Rendered || newState instanceof states_1.RenderAborted)) {
                    return [2 /*return*/, null];
                }
                previouslyReported = (0, state_utils_1.reverseReduce)(newState, function (state, previouslyReported) {
                    // There might be more than 1 Rendered/RenderAborted states for the same render pass.
                    // Everytime there is an operation state change, a new copy of the previous state is created,
                    // and only the ongoingOperations property is changed. We do this to keep a complete timeline of all events.
                    // However, we don't need to generate a new report everytime this happens.
                    return (previouslyReported ||
                        ((state instanceof states_1.Rendered || state instanceof states_1.RenderAborted) &&
                            state !== newState &&
                            state.snapshotId === newState.snapshotId));
                }, false);
                if (previouslyReported) {
                    return [2 /*return*/, null];
                }
                return [4 /*yield*/, Promise.all([
                        prepareSnapshotInfo(newState),
                        prepareFlowInfo(flowStartState),
                        prepareRenderPassStartInfo(flowStartState),
                        prepareRenderPassEndInfo(flowStartState, newState),
                    ])];
            case 1:
                _a = tslib_1.__read.apply(void 0, [_b.sent(), 4]), snapshotInfo = _a[0], flowInfo = _a[1], startInfo = _a[2], endInfo = _a[3];
                return [2 /*return*/, tslib_1.__assign(tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, snapshotInfo), flowInfo), startInfo), endInfo)];
        }
    });
}); };
var prepareSnapshotInfo = function (newState) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {};
                return [4 /*yield*/, newState.snapshotId];
            case 1: return [2 /*return*/, (_a.reportId = _b.sent(),
                    _a)];
        }
    });
}); };
var prepareFlowInfo = function (flowStartState) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var _a;
    return tslib_1.__generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {};
                return [4 /*yield*/, flowStartState.snapshotId];
            case 1: return [2 /*return*/, (_a.flowInstanceId = _b.sent(),
                    _a.sourceScreen = 'sourceScreen' in flowStartState ? flowStartState.sourceScreen : undefined,
                    _a.destinationScreen = flowStartState.destinationScreen,
                    _a)];
        }
    });
}); };
var prepareRenderPassEndInfo = function (flowStartState, newState) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var timeToCompletionMillis;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var _a;
                    var _b, _c, _d;
                    return tslib_1.__generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                if (!(flowStartState.type === 'app_boot')) return [3 /*break*/, 2];
                                return [4 /*yield*/, ((_b = newState.timestamp.nativeTimestamp) !== null && _b !== void 0 ? _b : newState.timestamp.jsTimestamp)];
                            case 1: 
                            // For the app_boot case, do not include the boot time into the timeToCompletionMillis times.
                            // Hence, we use flowStartState.timestamp.jsTimestamp.
                            return [2 /*return*/, ((_e.sent()) -
                                    flowStartState.timestamp.jsTimestamp)];
                            case 2: return [4 /*yield*/, ((_c = newState.timestamp.nativeTimestamp) !== null && _c !== void 0 ? _c : newState.timestamp.jsTimestamp)];
                            case 3:
                                _a = (_e.sent());
                                return [4 /*yield*/, ((_d = flowStartState.timestamp.nativeTimestamp) !== null && _d !== void 0 ? _d : flowStartState.timestamp.jsTimestamp)];
                            case 4: 
                            // For regular in-app flows, we can use both the nativeTimestamp and jsTimestamp for the
                            // flowStartState. Using nativeTimestamp will include the touch-event-propagation latency
                            // in the render times (when applicable).
                            return [2 /*return*/, (_a -
                                    (_e.sent()))];
                        }
                    });
                }); })()];
            case 1:
                timeToCompletionMillis = _a.sent();
                if (timeToCompletionMillis < 0 &&
                    // The android emulator clock is not shared with the dev mac system. When running in DEV mode,
                    // the two clocks can be a few milliseconds off, leading to these kind of errors.
                    // This is a known limitation, so don't throw errors, and cause an annoyance for devs.
                    !(react_native_1.Platform.OS === 'android' && __DEV__)) {
                    throw new CompletionTimestampError(newState.destinationScreen);
                }
                if (newState instanceof states_1.Rendered) {
                    return [2 /*return*/, {
                            renderPassName: newState.renderPassName,
                            timeToRenderMillis: timeToCompletionMillis,
                            interactive: newState.interactive,
                        }];
                }
                else {
                    return [2 /*return*/, {
                            timeToAbortMillis: timeToCompletionMillis,
                            interactive: false,
                        }];
                }
                return [2 /*return*/];
        }
    });
}); };
var prepareRenderPassStartInfo = function (flowStartState) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var jsNativeLatency, _a;
    var _b;
    var _c;
    return tslib_1.__generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = flowStartState.timestamp.jsNativeLatency;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, flowStartState.timestamp.jsNativeLatency];
            case 1:
                _a = (_d.sent());
                _d.label = 2;
            case 2:
                jsNativeLatency = _a;
                if (!(flowStartState.type === 'app_boot')) return [3 /*break*/, 3];
                if (jsNativeLatency === undefined) {
                    throw new MissingJSNativeLatencyError(flowStartState.destinationScreen);
                }
                return [2 /*return*/, {
                        // For the app-boot, mark the flow startup instant when the JS booted up.
                        // This ensures that the boot-times are not included in the render times for this screen.
                        // This ensures the final render-times to not be vastly different in-case the same screen
                        // is re-renderd through an in-app navigation flow.
                        flowStartTimeSinceEpochMillis: flowStartState.timestamp.jsTimestamp,
                        timeToBootJsMillis: jsNativeLatency,
                    }];
            case 3:
                _b = {};
                return [4 /*yield*/, ((_c = flowStartState.timestamp.nativeTimestamp) !== null && _c !== void 0 ? _c : flowStartState.timestamp.jsTimestamp)];
            case 4: return [2 /*return*/, (
                // For in-app navigation, if the user had provided the uiEvent object, mark the
                // flowStartTimeSinceEpochMillis as when the native onPress event occurred. If that
                // information is not available, fallback to the less accurate JS onPress event.
                _b.flowStartTimeSinceEpochMillis = _d.sent(),
                    _b.timeToConsumeTouchEventMillis = jsNativeLatency,
                    _b)];
        }
    });
}); };
exports.default = renderPassReportGenerator;
//# sourceMappingURL=RenderPassReportGenerator.js.map