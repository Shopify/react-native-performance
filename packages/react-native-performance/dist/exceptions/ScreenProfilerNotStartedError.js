"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var constants_1 = require("../constants");
var PerformanceProfilerError_1 = tslib_1.__importDefault(require("./PerformanceProfilerError"));
var ScreenProfilerNotStartedError = /** @class */ (function (_super) {
    tslib_1.__extends(ScreenProfilerNotStartedError, _super);
    function ScreenProfilerNotStartedError(destinationScreen, componentInstanceId) {
        var _this = _super.call(this, "No previous state was found for screen '".concat(destinationScreen, "' with componentInstanceId ").concat(componentInstanceId, ". This probably means that the navigation-start event was never recorded, ") +
            "while a subsequent render flow event was (render pass start, data operation profiling, etc.). You seem to have used some profiling API " +
            "but likely forgot to use the 'useStartProfiler' hook to start the flow. Read the usage here: " +
            "".concat(constants_1.DOCUMENTATION_LINKS.measuringTTITimes, "."), 'fatal') || this;
        _this.name = 'ScreenProfilerNotStartedError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, ScreenProfilerNotStartedError.prototype);
        return _this;
    }
    return ScreenProfilerNotStartedError;
}(PerformanceProfilerError_1.default));
exports.default = ScreenProfilerNotStartedError;
//# sourceMappingURL=ScreenProfilerNotStartedError.js.map