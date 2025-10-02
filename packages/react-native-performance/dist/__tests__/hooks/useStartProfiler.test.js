"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_hooks_1 = require("@testing-library/react-hooks");
var useStartProfiler_1 = tslib_1.__importDefault(require("../../hooks/useStartProfiler"));
var profilerTestWrapper_1 = tslib_1.__importDefault(require("../profilerTestWrapper"));
describe('hooks/useStartProfiler', function () {
    var mockStateController;
    var wrapper;
    beforeEach(function () {
        var _a;
        (_a = (0, profilerTestWrapper_1.default)(), wrapper = _a.wrapper, mockStateController = _a.stateController);
    });
    it('calls stateController.onNavigationStarted', function () {
        var start = (0, react_hooks_1.renderHook)(function () { return (0, useStartProfiler_1.default)(); }, { wrapper: wrapper }).result.current;
        expect(mockStateController.onNavigationStarted).not.toHaveBeenCalled();
        start({
            source: 'SomeSourceScreen',
            uiEvent: {
                nativeEvent: {
                    timestamp: 1000,
                },
            },
        });
        expect(mockStateController.onNavigationStarted).toHaveBeenCalledTimes(1);
        expect(mockStateController.onNavigationStarted).toHaveBeenCalledWith({
            sourceScreen: 'SomeSourceScreen',
            uiEvent: {
                nativeEvent: {
                    timestamp: 1000,
                },
            },
        });
    });
    it('provides the renderTimeoutMillisOverride when one is provided on navigation start', function () {
        var start = (0, react_hooks_1.renderHook)(function () { return (0, useStartProfiler_1.default)(); }, { wrapper: wrapper }).result.current;
        expect(mockStateController.onNavigationStarted).not.toHaveBeenCalled();
        start({
            source: 'SomeSourceScreen',
            renderTimeoutMillisOverride: 34,
        });
        expect(mockStateController.onNavigationStarted).toHaveBeenCalledTimes(1);
        expect(mockStateController.onNavigationStarted).toHaveBeenCalledWith({
            sourceScreen: 'SomeSourceScreen',
            renderTimeoutMillisOverride: 34,
        });
    });
});
//# sourceMappingURL=useStartProfiler.test.js.map