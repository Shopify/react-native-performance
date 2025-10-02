"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PerformanceProfilerError_1 = tslib_1.__importDefault(require("./PerformanceProfilerError"));
var PerformanceProfilerUninitializedError = /** @class */ (function (_super) {
    tslib_1.__extends(PerformanceProfilerUninitializedError, _super);
    function PerformanceProfilerUninitializedError(destinationScreen) {
        var _this = _super.call(this, 'Performance profiler was not initialized correctly. Did you forget to mount the <PerformanceProfiler /> component in the App tree?', 'fatal') || this;
        _this.name = 'PerformanceProfilerUninitializedError';
        _this.destinationScreen = destinationScreen;
        Object.setPrototypeOf(_this, PerformanceProfilerUninitializedError.prototype);
        return _this;
    }
    return PerformanceProfilerUninitializedError;
}(PerformanceProfilerError_1.default));
exports.default = PerformanceProfilerUninitializedError;
//# sourceMappingURL=PerformanceProfilerUninitializedError.js.map