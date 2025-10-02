"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
var react_hooks_1 = require("@testing-library/react-hooks");
var react_native_1 = require("@testing-library/react-native");
var useRenderPassReport_1 = tslib_1.__importDefault(require("../../hooks/useRenderPassReport"));
var RenderPassReportGenerator_1 = tslib_1.__importDefault(require("../../RenderPassReportGenerator"));
var profilerTestWrapper_1 = tslib_1.__importDefault(require("../profilerTestWrapper"));
jest.mock('../../RenderPassReportGenerator', function () {
    var renderPassReportGenerator = jest.fn();
    return renderPassReportGenerator;
});
describe('useRenderPassReport', function () {
    var stateController;
    var wrapper;
    beforeEach(function () {
        var _a;
        // @ts-ignore
        RenderPassReportGenerator_1.default.mockReturnValue(Promise.resolve(null));
        (_a = (0, profilerTestWrapper_1.default)(), wrapper = _a.wrapper, stateController = _a.stateController);
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    it('subscribes to changes from the state controller', function () {
        expect(stateController.addStateChangedListener).not.toHaveBeenCalled();
        (0, react_hooks_1.renderHook)(function () {
            return (0, useRenderPassReport_1.default)({
                destinationScreen: 'foo',
            });
        }, { wrapper: wrapper });
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    });
    it('ignores state changes from screens that the user does not care about', function () {
        var report = (0, react_hooks_1.renderHook)(function () {
            return (0, useRenderPassReport_1.default)({
                destinationScreen: 'foo',
            });
        }, { wrapper: wrapper }).result.current;
        // @ts-ignore
        stateController.addStateChangedListener.mock.calls[0][0]('bar', { name: 'old state' }, { name: 'new state' });
        expect(RenderPassReportGenerator_1.default).not.toHaveBeenCalled();
        expect(report).toBeUndefined();
    });
    it('passes the state changes to the renderPassReportGenerator', function () {
        var _a;
        var report = (0, react_hooks_1.renderHook)(function () {
            return (0, useRenderPassReport_1.default)({
                destinationScreen: new RegExp('^f[o]+$'),
            });
        }, { wrapper: wrapper }).result.current;
        var stateChangeArgs = ['fooooo', { name: 'old state' }, { name: 'new state' }];
        expect(RenderPassReportGenerator_1.default).not.toHaveBeenCalled();
        // @ts-ignore
        (_a = stateController.addStateChangedListener.mock.calls[0])[0].apply(_a, tslib_1.__spreadArray([], tslib_1.__read(stateChangeArgs), false));
        expect(RenderPassReportGenerator_1.default).toHaveBeenCalledTimes(1);
        expect(RenderPassReportGenerator_1.default).toHaveBeenCalledWith(stateChangeArgs[2]);
        expect(report).toBeUndefined();
    });
    it('updates the output result if renderPassReportGenerator prepares a report', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var mockReport, renderHookResult, stateChangeArgs;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockReport = { tti: 10 };
                    // @ts-ignore
                    RenderPassReportGenerator_1.default.mockReturnValue(Promise.resolve(mockReport));
                    renderHookResult = (0, react_hooks_1.renderHook)(function () {
                        return (0, useRenderPassReport_1.default)({
                            destinationScreen: 'foo',
                        });
                    }, { wrapper: wrapper });
                    stateChangeArgs = ['foo', { name: 'old state' }, { name: 'new state' }];
                    return [4 /*yield*/, (0, react_native_1.act)(function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return tslib_1.__generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        // @ts-ignore
                                        (_a = stateController.addStateChangedListener.mock.calls[0])[0].apply(_a, tslib_1.__spreadArray([], tslib_1.__read(stateChangeArgs), false));
                                        // Flush the report preparation promise
                                        return [4 /*yield*/, new Promise(function (resolve) { return setImmediate(resolve); })];
                                    case 1:
                                        // Flush the report preparation promise
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect(renderHookResult.result.current).toBe(mockReport);
                    return [2 /*return*/];
            }
        });
    }); });
    it('does not unsubscribe and re-subscribe if the hook is re-rendered with a regex destinationScreen', function () {
        expect(stateController.addStateChangedListener).not.toHaveBeenCalled();
        var renderHookResult = (0, react_hooks_1.renderHook)(function () {
            return (0, useRenderPassReport_1.default)({
                destinationScreen: new RegExp('.*'),
            });
        }, { wrapper: wrapper });
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();
        renderHookResult.rerender();
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=useRenderPassReport.test.js.map