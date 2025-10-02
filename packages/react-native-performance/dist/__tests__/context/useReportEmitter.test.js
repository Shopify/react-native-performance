"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
var react_native_1 = require("@testing-library/react-native");
var react_hooks_1 = require("@testing-library/react-hooks");
var useReportEmitter_1 = tslib_1.__importDefault(require("../../context/useReportEmitter"));
var RenderPassReportGenerator_1 = tslib_1.__importDefault(require("../../RenderPassReportGenerator"));
var Logger_1 = tslib_1.__importStar(require("../../utils/Logger"));
jest.mock('../../RenderPassReportGenerator', function () {
    var mockGenerator = jest.fn();
    return mockGenerator;
});
jest.mock('../../utils/Logger', function () {
    return {
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        LogLevel: {
            Debug: 0,
            Info: 1,
            Warn: 2,
            Error: 3,
        },
    };
});
describe('context/useReportEmitter', function () {
    var onReportPrepared;
    var errorHandler;
    var reportEmitter;
    beforeEach(function () {
        Logger_1.default.logLevel = Logger_1.LogLevel.Info;
        onReportPrepared = jest.fn();
        errorHandler = jest.fn();
        reportEmitter = (0, react_hooks_1.renderHook)(function () { return (0, useReportEmitter_1.default)({ onReportPrepared: onReportPrepared, errorHandler: errorHandler }); }).result.current;
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    it('reports the RenderPassReport if renderPassReportGenerator generates one', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var mockReport;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockReport = { key: 'value' };
                    // @ts-ignore
                    RenderPassReportGenerator_1.default.mockReturnValueOnce(Promise.resolve(mockReport));
                    reportEmitter('screen', undefined, { key: 'some_state' });
                    return [4 /*yield*/, (0, react_native_1.act)(function () { return Promise.resolve(); })];
                case 1:
                    _a.sent();
                    expect(onReportPrepared).toHaveBeenCalledTimes(1);
                    expect(onReportPrepared).toHaveBeenCalledWith(mockReport);
                    expect(Logger_1.default.info).toHaveBeenCalledTimes(1);
                    expect(Logger_1.default.info).toHaveBeenCalledWith("Render Pass Report: ".concat(JSON.stringify(mockReport, undefined, 2)));
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not log RenderPassReport if logger level is not Info', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var mockReport;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Logger_1.default.logLevel = Logger_1.LogLevel.Warn;
                    mockReport = { key: 'value' };
                    // @ts-ignore
                    RenderPassReportGenerator_1.default.mockReturnValueOnce(Promise.resolve(mockReport));
                    reportEmitter('screen', undefined, { key: 'some_state' });
                    return [4 /*yield*/, (0, react_native_1.act)(function () { return Promise.resolve(); })];
                case 1:
                    _a.sent();
                    expect(onReportPrepared).toHaveBeenCalledTimes(1);
                    expect(onReportPrepared).toHaveBeenCalledWith(mockReport);
                    expect(Logger_1.default.info).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not report anything to onReportPrepared if renderPassReportGenerator does not generate a report', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // @ts-ignore
                    RenderPassReportGenerator_1.default.mockReturnValueOnce(Promise.resolve(null));
                    reportEmitter('screen', undefined, { key: 'some_state' });
                    return [4 /*yield*/, (0, react_native_1.act)(function () { return Promise.resolve(); })];
                case 1:
                    _a.sent();
                    expect(onReportPrepared).not.toHaveBeenCalled();
                    expect(Logger_1.default.info).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=useReportEmitter.test.js.map