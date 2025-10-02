"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PerformanceProfilerError_1 = tslib_1.__importDefault(require("./PerformanceProfilerError"));
var NativeModuleNotFoundError = /** @class */ (function (_super) {
    tslib_1.__extends(NativeModuleNotFoundError, _super);
    function NativeModuleNotFoundError() {
        var _this = _super.call(this, 'Performance module not found in NativeModules. ' +
            "Chances are you're in a test environment, but the mocks have not been setup correctly.", 'bug') || this;
        _this.name = 'NativeModuleNotFoundError';
        _this.destinationScreen = undefined;
        Object.setPrototypeOf(_this, NativeModuleNotFoundError.prototype);
        return _this;
    }
    return NativeModuleNotFoundError;
}(PerformanceProfilerError_1.default));
exports.default = NativeModuleNotFoundError;
//# sourceMappingURL=NativeModuleNotFoundError.js.map