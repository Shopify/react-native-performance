"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
var react_native_1 = require("@testing-library/react-native");
var react_hooks_1 = require("@testing-library/react-hooks");
var useProfilerStateChangeListener_1 = tslib_1.__importDefault(require("../../hooks/useProfilerStateChangeListener"));
var profilerTestWrapper_1 = tslib_1.__importDefault(require("../profilerTestWrapper"));
describe('hooks/useProfilerStateChangeListener', function () {
    var stateController;
    var onStateChanged;
    var wrapper;
    beforeEach(function () {
        var _a;
        onStateChanged = jest.fn();
        (_a = (0, profilerTestWrapper_1.default)(), wrapper = _a.wrapper, stateController = _a.stateController);
    });
    it("initializes the state with the state controller's current state", function () {
        var mockInitialState = { name: 'some state' };
        // @ts-ignore
        stateController.getCurrentStateFor.mockReturnValueOnce(mockInitialState);
        (0, react_hooks_1.renderHook)(function () {
            return (0, useProfilerStateChangeListener_1.default)({
                destinationScreen: 'foo',
                onStateChanged: onStateChanged,
            });
        }, { wrapper: wrapper });
        expect(onStateChanged).toHaveBeenCalledWith(mockInitialState);
    });
    it('subscribes to state changes from the state controller', function () {
        var mockNewState = { name: 'some state' };
        expect(stateController.addStateChangedListener).not.toHaveBeenCalled();
        (0, react_hooks_1.renderHook)(function () {
            return (0, useProfilerStateChangeListener_1.default)({
                destinationScreen: 'foo',
                onStateChanged: onStateChanged,
            });
        }, { wrapper: wrapper });
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(onStateChanged).not.toHaveBeenCalled();
        // @ts-ignore
        (0, react_native_1.act)(function () { return stateController.addStateChangedListener.mock.calls[0][0]('foo', undefined, mockNewState); });
        expect(onStateChanged).toHaveBeenCalledWith(mockNewState);
    });
    it('ignores state changes from screens that the user does not care about', function () {
        expect(stateController.addStateChangedListener).not.toHaveBeenCalled();
        (0, react_hooks_1.renderHook)(function () {
            return (0, useProfilerStateChangeListener_1.default)({
                destinationScreen: 'foo',
                onStateChanged: onStateChanged,
            });
        }, { wrapper: wrapper });
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        // @ts-ignore
        stateController.addStateChangedListener.mock.calls[0][0]('bar', undefined, {
            name: 'some state',
        });
        expect(onStateChanged).not.toHaveBeenCalled();
    });
    it('unsubscribes to the state changes when unmounted', function () {
        var renderHookResult = (0, react_hooks_1.renderHook)(function () {
            return (0, useProfilerStateChangeListener_1.default)({
                destinationScreen: 'foo',
                onStateChanged: onStateChanged,
            });
        }, {
            wrapper: wrapper,
        });
        expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();
        renderHookResult.unmount();
        expect(stateController.removeStateChangedListener).toHaveBeenCalledTimes(1);
    });
    it('does not unsubscribe and re-subscribe if the hook is re-rendered with a regex destinationScreen', function () {
        expect(stateController.addStateChangedListener).not.toHaveBeenCalled();
        var renderHookResult = (0, react_hooks_1.renderHook)(function () {
            return (0, useProfilerStateChangeListener_1.default)({
                destinationScreen: new RegExp('.*'),
                onStateChanged: onStateChanged,
            });
        }, { wrapper: wrapper });
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();
        renderHookResult.rerender();
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=useProfilerStateChangeListener.test.js.map