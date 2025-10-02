"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_native_1 = require("@testing-library/react-native");
var PromiseController_1 = tslib_1.__importDefault(require("../../utils/PromiseController"));
describe('utils/PromiseController', function () {
    var resultFn = jest.fn();
    var errorFn = jest.fn();
    var controller;
    beforeEach(function () {
        jest.resetAllMocks();
        controller = new PromiseController_1.default();
        controller.promise.then(resultFn).catch(errorFn);
    });
    it('resolves the promise when asked', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect(resultFn).not.toHaveBeenCalled();
                    expect(errorFn).not.toHaveBeenCalled();
                    controller.resolve(10);
                    return [4 /*yield*/, (0, react_native_1.act)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); })];
                case 1:
                    _a.sent();
                    expect(resultFn).toHaveBeenCalledTimes(1);
                    expect(resultFn).toHaveBeenCalledWith(10);
                    expect(errorFn).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('rejects the promise when asked', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var actualError;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expect(resultFn).not.toHaveBeenCalled();
                    expect(errorFn).not.toHaveBeenCalled();
                    actualError = new Error('some error');
                    controller.reject(actualError);
                    return [4 /*yield*/, (0, react_native_1.act)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () { return tslib_1.__generator(this, function (_a) {
                            return [2 /*return*/];
                        }); }); })];
                case 1:
                    _a.sent();
                    expect(resultFn).not.toHaveBeenCalled();
                    expect(errorFn).toHaveBeenCalledTimes(1);
                    expect(errorFn).toHaveBeenCalledWith(actualError);
                    return [2 /*return*/];
            }
        });
    }); });
    it('remembers the resolution result', function () {
        expect(controller.rejectionReason).toBeUndefined();
        expect(controller.result).toBeUndefined();
        controller.resolve(10);
        expect(controller.rejectionReason).toBeUndefined();
        expect(controller.result).toBe(10);
    });
    it('remembers the rejection reason', function () {
        expect(controller.rejectionReason).toBeUndefined();
        expect(controller.result).toBeUndefined();
        var actualError = new Error('some error');
        controller.reject(actualError);
        expect(controller.rejectionReason).toBe(actualError);
        expect(controller.result).toBeUndefined();
    });
    it('marks the promise as completed after reject', function () {
        expect(controller.hasCompleted).toBe(false);
        controller.reject(new Error('some error'));
        expect(controller.hasCompleted).toBe(true);
    });
    it('marks the promise as completed after resolve', function () {
        expect(controller.hasCompleted).toBe(false);
        controller.resolve(10);
        expect(controller.hasCompleted).toBe(true);
    });
    it('marks the promise as a completed after resolving with an undefined value', function () {
        var controller = new PromiseController_1.default();
        controller.promise.then(resultFn).catch(errorFn);
        expect(controller.hasCompleted).toBe(false);
        controller.resolve();
        expect(controller.hasCompleted).toBe(true);
    });
});
//# sourceMappingURL=PromiseController.test.js.map