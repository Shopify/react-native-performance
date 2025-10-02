"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNativeUuid = exports.getNativeStartupTimestamp = exports.getNativeTime = void 0;
var tslib_1 = require("tslib");
var react_native_1 = require("react-native");
var exceptions_1 = require("../exceptions");
var NATIVE_MODULE_NAME = 'Performance';
var NativePerformanceModule = /** @class */ (function () {
    function NativePerformanceModule() {
        if (!(NATIVE_MODULE_NAME in react_native_1.NativeModules)) {
            throw new exceptions_1.NativeModuleNotFoundError();
        }
    }
    NativePerformanceModule.prototype.getNativeTime = function () {
        return react_native_1.NativeModules[NATIVE_MODULE_NAME].getNativeTime();
    };
    NativePerformanceModule.prototype.getNativeStartupTimestamp = function () {
        return react_native_1.NativeModules[NATIVE_MODULE_NAME].getNativeStartupTimestamp();
    };
    NativePerformanceModule.prototype.getNativeUuid = function () {
        return react_native_1.NativeModules[NATIVE_MODULE_NAME].getNativeUuid();
    };
    return NativePerformanceModule;
}());
function getNativeTime() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, timeSinceEpochMillisString, uptimeMillisString, nativeTimeSinceEpochMillis, nativeUptimeMillis;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, new NativePerformanceModule().getNativeTime()];
                case 1:
                    _a = _b.sent(), timeSinceEpochMillisString = _a.timeSinceEpochMillis, uptimeMillisString = _a.uptimeMillis;
                    nativeTimeSinceEpochMillis = Number.parseFloat(timeSinceEpochMillisString);
                    nativeUptimeMillis = Number.parseFloat(uptimeMillisString);
                    return [2 /*return*/, { nativeTimeSinceEpochMillis: nativeTimeSinceEpochMillis, nativeUptimeMillis: nativeUptimeMillis }];
            }
        });
    });
}
exports.getNativeTime = getNativeTime;
function getNativeStartupTimestamp() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = Number).parseFloat;
                    return [4 /*yield*/, new NativePerformanceModule().getNativeStartupTimestamp()];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        });
    });
}
exports.getNativeStartupTimestamp = getNativeStartupTimestamp;
function getNativeUuid() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2 /*return*/, new NativePerformanceModule().getNativeUuid()];
        });
    });
}
exports.getNativeUuid = getNativeUuid;
//# sourceMappingURL=native-performance-module.js.map