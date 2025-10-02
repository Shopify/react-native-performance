"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// @refresh reset
// Fast refresh saves the React state but unmounts and mounts the component again.
// Since for `PerformanceProfiler` the state depends on mount/unmount, it would often result in invalid operations
// such as `PerformaneProfilerNotStartedError`
var react_1 = tslib_1.__importStar(require("react"));
var react_native_1 = require("react-native");
var utils_1 = require("../utils");
var state_machine_1 = require("../state-machine");
var Logger_1 = tslib_1.__importDefault(require("../utils/Logger"));
var exceptions_1 = require("../exceptions");
var useReportEmitter_1 = tslib_1.__importDefault(require("./useReportEmitter"));
var DEFAULT_RENDER_TIMEOUT_MILLIS = 5 * 1000;
var PerformanceProfiler = function (_a) {
    var children = _a.children, _b = _a.onReportPrepared, onReportPrepared = _b === void 0 ? function () { } : _b, _c = _a.renderTimeoutMillis, renderTimeoutMillis = _c === void 0 ? DEFAULT_RENDER_TIMEOUT_MILLIS : _c, _d = _a.errorHandler, errorHandler = _d === void 0 ? function () { } : _d, _e = _a.enabled, enabled = _e === void 0 ? true : _e, _f = _a.useRenderTimeouts, useRenderTimeouts = _f === void 0 ? true : _f, _g = _a.logLevel, logLevel = _g === void 0 ? utils_1.LogLevel.Warn : _g;
    var reportEmitter = (0, useReportEmitter_1.default)({ onReportPrepared: onReportPrepared, errorHandler: errorHandler });
    Logger_1.default.logLevel = logLevel;
    /**
     * `errorHandler` wrapped in custom logic that should be out of users' control (such as logging of internal errors).
     */
    var performanceProfilerErrorHandler = (0, react_1.useCallback)(function (error) {
        // If profiler throws an error in parallel with navigation, it might visibly delay animation.
        // To prevent that error handler is wrapped in runAfterInteractions.
        // It's not significant when an error gets reported, but it unblocks navigation transition.
        react_native_1.InteractionManager.runAfterInteractions(function () {
            // We want to provide a custom message for `bug` errors.
            // We also don't want to run `errorHandler` for these bugs since then users would have to make that distinction themselves
            // and we want to save them from that complexity.
            if (error instanceof exceptions_1.PerformanceProfilerError && error.type === 'bug') {
                Logger_1.default.error("You have hit an internal error, please report this: https://github.com/Shopify/react-native-performance/issues/new\n" +
                    "".concat(error.name, ": ").concat(error.message));
            }
            else {
                Logger_1.default.error("".concat(error.name, ": ").concat(error.message));
                errorHandler(error);
            }
        });
    }, [errorHandler]);
    var stateController = (0, state_machine_1.useStateControllerInitializer)({
        enabled: enabled,
        errorHandler: performanceProfilerErrorHandler,
        reportEmitter: reportEmitter,
        useRenderTimeouts: useRenderTimeouts,
        renderTimeoutMillis: renderTimeoutMillis,
    });
    return (react_1.default.createElement(state_machine_1.StateControllerContextProvider, { value: stateController },
        react_1.default.createElement(utils_1.ErrorHandlerContextProvider, { value: performanceProfilerErrorHandler }, children)));
};
exports.default = PerformanceProfiler;
//# sourceMappingURL=PerformanceProfiler.js.map