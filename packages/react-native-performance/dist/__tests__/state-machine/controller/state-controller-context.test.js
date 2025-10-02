"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_hooks_1 = require("@testing-library/react-hooks");
var exceptions_1 = require("../../../exceptions");
var state_machine_1 = require("../../../state-machine");
var utils_1 = require("../../../utils");
describe('state-machine/controller/state-controller-context', function () {
    describe('useStateController', function () {
        it('provides the state controller instance available through the context', function () {
            var mockStateController = {
                onSomeEvent: jest.fn(),
            };
            var actualStateController = (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, {
                wrapper: function wrapper(_a) {
                    var children = _a.children;
                    return (react_1.default.createElement(state_machine_1.StateControllerContextProvider, { value: mockStateController }, children));
                },
            }).result.current;
            expect(actualStateController).toBe(mockStateController);
        });
        it('provides the fallback disabled state controller if none is available via the context', function () {
            var actualStateController = (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, {
                wrapper: function wrapper(_a) {
                    var children = _a.children;
                    return react_1.default.createElement(utils_1.ErrorHandlerContextProvider, { value: jest.fn() }, children);
                },
            }).result.current;
            expect(actualStateController).toBeInstanceOf(state_machine_1.DisabledStateController);
        });
        it('reports a missing controller in the context to the error handler', function () {
            var errorHandler = jest.fn();
            (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateController)(); }, {
                wrapper: function wrapper(_a) {
                    var children = _a.children;
                    return react_1.default.createElement(utils_1.ErrorHandlerContextProvider, { value: errorHandler }, children);
                },
            });
            expect(errorHandler).toHaveBeenCalledTimes(1);
            expect(errorHandler).toHaveBeenCalledWith(expect.any(exceptions_1.PerformanceProfilerUninitializedError));
        });
    });
});
//# sourceMappingURL=state-controller-context.test.js.map