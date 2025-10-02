"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_hooks_1 = require("@testing-library/react-hooks");
var useResetFlow_1 = tslib_1.__importDefault(require("../../hooks/useResetFlow"));
var profilerTestWrapper_1 = tslib_1.__importDefault(require("../profilerTestWrapper"));
describe('hooks/useResetFlow', function () {
    var mockStateController;
    var wrapper;
    beforeEach(function () {
        var _a;
        (_a = (0, profilerTestWrapper_1.default)(), wrapper = _a.wrapper, mockStateController = _a.stateController);
    });
    it('calls stateController.onFlowReset when the flow is reset', function () {
        var _a = (0, react_hooks_1.renderHook)(function () { return (0, useResetFlow_1.default)(); }, { wrapper: wrapper }).result.current, resetFlow = _a.resetFlow, componentInstanceId = _a.componentInstanceId;
        expect(mockStateController.onFlowReset).not.toHaveBeenCalled();
        resetFlow({
            destination: 'SomeDestinationScreen',
        });
        expect(mockStateController.onFlowReset).toHaveBeenCalledTimes(1);
        expect(mockStateController.onFlowReset).toHaveBeenCalledWith({
            destinationScreen: 'SomeDestinationScreen',
            componentInstanceId: componentInstanceId,
        });
    });
    it('provides the renderTimeoutMillisOverride when one is provided on flow reset', function () {
        var _a = (0, react_hooks_1.renderHook)(function () { return (0, useResetFlow_1.default)(); }, { wrapper: wrapper }).result.current, resetFlow = _a.resetFlow, componentInstanceId = _a.componentInstanceId;
        resetFlow({
            destination: 'SomeSourceScreen',
            renderTimeoutMillisOverride: 34,
        });
        expect(mockStateController.onFlowReset).toHaveBeenCalledTimes(1);
        expect(mockStateController.onFlowReset).toBeCalledWith({
            destinationScreen: 'SomeSourceScreen',
            renderTimeoutMillisOverride: 34,
            componentInstanceId: componentInstanceId,
        });
    });
});
//# sourceMappingURL=useResetFlow.test.js.map