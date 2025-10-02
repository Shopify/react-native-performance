"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PerformanceProfilerError = /** @class */ (function (_super) {
    tslib_1.__extends(PerformanceProfilerError, _super);
    function PerformanceProfilerError(message, type) {
        var _this = _super.call(this, message) || this;
        _this.type = type;
        Object.setPrototypeOf(_this, PerformanceProfilerError.prototype);
        return _this;
    }
    return PerformanceProfilerError;
}(Error));
exports.default = PerformanceProfilerError;
//# sourceMappingURL=PerformanceProfilerError.js.map