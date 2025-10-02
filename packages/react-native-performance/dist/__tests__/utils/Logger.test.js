"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("../../utils");
var Logger_1 = tslib_1.__importDefault(require("../../utils/Logger"));
describe('utils/Logger', function () {
    var debugMessage = 'Debug message';
    beforeEach(function () {
        console.debug = jest.fn();
        console.info = jest.fn();
        console.warn = jest.fn();
        console.error = jest.fn();
    });
    it('logs all messages with logLevel = Debug', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            Logger_1.default.logLevel = utils_1.LogLevel.Debug;
            Logger_1.default.debug(debugMessage);
            expect(console.debug).toBeCalledWith(debugMessage);
            Logger_1.default.info(debugMessage);
            expect(console.info).toBeCalledWith(debugMessage);
            Logger_1.default.warn(debugMessage);
            expect(console.warn).toBeCalledWith(debugMessage);
            Logger_1.default.error(debugMessage);
            expect(console.error).toBeCalledWith(debugMessage);
            return [2 /*return*/];
        });
    }); });
    it('logs only Info & Warn & Error messages with logLevel = Info', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            Logger_1.default.logLevel = utils_1.LogLevel.Info;
            Logger_1.default.debug(debugMessage);
            expect(console.debug).not.toHaveBeenCalled();
            Logger_1.default.info(debugMessage);
            expect(console.info).toBeCalledWith(debugMessage);
            Logger_1.default.warn(debugMessage);
            expect(console.warn).toBeCalledWith(debugMessage);
            Logger_1.default.error(debugMessage);
            expect(console.error).toBeCalledWith(debugMessage);
            return [2 /*return*/];
        });
    }); });
    it('logs only Warn & Error messages with logLevel = Warn', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            Logger_1.default.logLevel = utils_1.LogLevel.Warn;
            Logger_1.default.debug(debugMessage);
            expect(console.debug).not.toHaveBeenCalled();
            Logger_1.default.info(debugMessage);
            expect(console.info).not.toHaveBeenCalled();
            Logger_1.default.warn(debugMessage);
            expect(console.warn).toBeCalledWith(debugMessage);
            Logger_1.default.error(debugMessage);
            expect(console.error).toBeCalledWith(debugMessage);
            return [2 /*return*/];
        });
    }); });
    it('logs only Error messages with logLevel = Error', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            Logger_1.default.logLevel = utils_1.LogLevel.Error;
            Logger_1.default.debug(debugMessage);
            expect(console.debug).not.toHaveBeenCalled();
            Logger_1.default.info(debugMessage);
            expect(console.info).not.toHaveBeenCalled();
            Logger_1.default.warn(debugMessage);
            expect(console.warn).not.toHaveBeenCalled();
            Logger_1.default.error(debugMessage);
            expect(console.error).toBeCalledWith(debugMessage);
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=Logger.test.js.map