"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
var react_1 = tslib_1.__importDefault(require("react"));
var react_hooks_1 = require("@testing-library/react-hooks");
var context_1 = require("../../context");
var useReportEmitter_1 = tslib_1.__importDefault(require("../../context/useReportEmitter"));
var state_machine_1 = require("../../state-machine");
jest.mock('../../state-machine/controller/useStateControllerInitializer', function () {
    return jest.fn();
});
jest.mock('../../context/useReportEmitter', function () {
    return jest.fn();
});
describe('context/PerformanceProfiler', function () {
    var mockStateController = { key: 'value' };
    var mockReportEmitter;
    beforeEach(function () {
        mockReportEmitter = jest.fn();
        // @ts-ignore
        state_machine_1.useStateControllerInitializer.mockReturnValue(mockStateController);
        // @ts-ignore
        useReportEmitter_1.default.mockReturnValue(mockReportEmitter);
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    it('intializes the state controller via the useStateControllerInitializer hook', function () {
        var wrapper = function (_a) {
            var children = _a.children;
            return (react_1.default.createElement(context_1.PerformanceProfiler, { onReportPrepared: jest.fn() }, children));
        };
        var resolvedStateController = (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, {
            wrapper: wrapper,
        }).result.current;
        expect(resolvedStateController).toBe(mockStateController);
    });
    it('uses the report emitter prepared by the useReportEmitter hook', function () {
        var wrapper = function (_a) {
            var children = _a.children;
            return (react_1.default.createElement(context_1.PerformanceProfiler, { onReportPrepared: jest.fn() }, children));
        };
        expect(state_machine_1.useStateControllerInitializer).not.toHaveBeenCalled();
        (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, { wrapper: wrapper });
        expect(state_machine_1.useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({ reportEmitter: mockReportEmitter }));
    });
    it('uses render timeouts by default', function () {
        var wrapper = function (_a) {
            var children = _a.children;
            return (react_1.default.createElement(context_1.PerformanceProfiler, { onReportPrepared: jest.fn() }, children));
        };
        (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, { wrapper: wrapper });
        expect(state_machine_1.useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({ useRenderTimeouts: true }));
    });
    it('does not use render timeouts if turned off', function () {
        var wrapper = function (_a) {
            var children = _a.children;
            return (react_1.default.createElement(context_1.PerformanceProfiler, { useRenderTimeouts: false, onReportPrepared: jest.fn() }, children));
        };
        (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, { wrapper: wrapper });
        expect(state_machine_1.useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({ useRenderTimeouts: false }));
    });
    it('overrides render timeout if provided', function () {
        var wrapper = function (_a) {
            var children = _a.children;
            return (react_1.default.createElement(context_1.PerformanceProfiler, { renderTimeoutMillis: 3000, onReportPrepared: jest.fn() }, children));
        };
        (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, { wrapper: wrapper });
        expect(state_machine_1.useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({ renderTimeoutMillis: 3000 }));
    });
    it('does not use render timeout if turned off, but override is provided', function () {
        var wrapper = function (_a) {
            var children = _a.children;
            return (react_1.default.createElement(context_1.PerformanceProfiler, { renderTimeoutMillis: 3000, useRenderTimeouts: false, onReportPrepared: jest.fn() }, children));
        };
        (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, { wrapper: wrapper });
        expect(state_machine_1.useStateControllerInitializer).toHaveBeenCalledWith(expect.objectContaining({ useRenderTimeouts: false }));
    });
});
//# sourceMappingURL=PerformanceProfiler.test.js.map