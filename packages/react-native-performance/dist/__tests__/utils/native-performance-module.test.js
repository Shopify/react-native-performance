"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_native_1 = require("react-native");
var exceptions_1 = require("../../exceptions");
var native_performance_module_1 = require("../../utils/native-performance-module");
jest.mock('react-native', function () {
    return {
        NativeModules: {},
    };
});
describe('native-performance-module', function () {
    describe('getNativeTime', function () {
        beforeEach(function () {
            react_native_1.NativeModules.Performance = {
                getNativeTime: function () {
                    return Promise.resolve({
                        timeSinceEpochMillis: '1234',
                        uptimeMillis: '56',
                    });
                },
            };
        });
        afterEach(function () {
            delete react_native_1.NativeModules.Performance;
        });
        it('throws error if native module not found', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delete react_native_1.NativeModules.Performance;
                        return [4 /*yield*/, expect(native_performance_module_1.getNativeTime).rejects.toThrowError(exceptions_1.NativeModuleNotFoundError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('fetches the time from the native module', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var _a, nativeTimeSinceEpochMillis, nativeUptimeMillis;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, native_performance_module_1.getNativeTime)()];
                    case 1:
                        _a = _b.sent(), nativeTimeSinceEpochMillis = _a.nativeTimeSinceEpochMillis, nativeUptimeMillis = _a.nativeUptimeMillis;
                        expect(nativeTimeSinceEpochMillis).toBe(1234);
                        expect(nativeUptimeMillis).toBe(56);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getStartupTimestamp', function () {
        beforeEach(function () {
            react_native_1.NativeModules.Performance = {
                getNativeStartupTimestamp: function () {
                    return Promise.resolve('1234');
                },
            };
        });
        afterEach(function () {
            delete react_native_1.NativeModules.Performance;
        });
        it('fetches the time from the native module', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var nativeStartupTimestamp;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, native_performance_module_1.getNativeStartupTimestamp)()];
                    case 1:
                        nativeStartupTimestamp = _a.sent();
                        expect(nativeStartupTimestamp).toBe(1234);
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws error if native module not found', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delete react_native_1.NativeModules.Performance;
                        return [4 /*yield*/, expect(native_performance_module_1.getNativeStartupTimestamp).rejects.toThrowError(exceptions_1.NativeModuleNotFoundError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getNativeUuid', function () {
        beforeEach(function () {
            react_native_1.NativeModules.Performance = {
                getNativeUuid: function () {
                    return Promise.resolve('1234-5678-0987');
                },
            };
        });
        afterEach(function () {
            delete react_native_1.NativeModules.Performance;
        });
        it('fetches the uuid from the native module', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            var uuid;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, native_performance_module_1.getNativeUuid)()];
                    case 1:
                        uuid = _a.sent();
                        expect(uuid).toBe('1234-5678-0987');
                        return [2 /*return*/];
                }
            });
        }); });
        it('throws error if native module not found', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        delete react_native_1.NativeModules.Performance;
                        return [4 /*yield*/, expect(native_performance_module_1.getNativeUuid).rejects.toThrowError(exceptions_1.NativeModuleNotFoundError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=native-performance-module.test.js.map