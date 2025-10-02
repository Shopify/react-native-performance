"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var constants_1 = require("../constants");
var PerformanceProfilerError_1 = tslib_1.__importDefault(require("./PerformanceProfilerError"));
var RenderTimeoutError = /** @class */ (function (_super) {
    tslib_1.__extends(RenderTimeoutError, _super);
    function RenderTimeoutError(destinationScreen, renderTimeoutMillis, stateAtTimeout) {
        var _this = _super.call(this, "Screen '".concat(destinationScreen, "' failed to render in ").concat(renderTimeoutMillis, " milliseconds. One of the following could happen:\n") +
            "1. You notified the profiler of the navigation-start event via the useStartProfiler hook, but forgot to notify of the render-completion event via <PerformanceMeasureView/>\n" +
            "Read the usage here: ".concat(constants_1.DOCUMENTATION_LINKS.measuringTTITimes, ".\n") +
            "2. You use useStartProfiler hook instead of useResetFlow hook when re-render is occurring because the flow is essentially being restarted.\n" +
            "Read the usage here: ".concat(constants_1.DOCUMENTATION_LINKS.measuringRerenderTimes, ".\n") +
            " The state at timeout was: ".concat(stateAtTimeout, "."), 'fatal') || this;
        _this.name = 'RenderTimeoutError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, RenderTimeoutError.prototype);
        return _this;
    }
    return RenderTimeoutError;
}(PerformanceProfilerError_1.default));
exports.default = RenderTimeoutError;
//# sourceMappingURL=RenderTimeoutError.js.map