"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_hooks_1 = require("@testing-library/react-hooks");
var state_machine_1 = require("../../../state-machine");
jest.mock('../../../state-machine/controller/EnabledStateController', function () {
    var MockStateController = jest.requireActual('../../MockStateController').default;
    var MockEnabledStateController = /** @class */ (function (_super) {
        tslib_1.__extends(MockEnabledStateController, _super);
        function MockEnabledStateController() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isEnabled = true;
            return _this;
        }
        return MockEnabledStateController;
    }(MockStateController));
    return MockEnabledStateController;
});
jest.mock('../../../state-machine/controller/DisabledStateController', function () {
    var MockStateController = jest.requireActual('../../MockStateController').default;
    var MockDisabledStateController = /** @class */ (function (_super) {
        tslib_1.__extends(MockDisabledStateController, _super);
        function MockDisabledStateController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MockDisabledStateController;
    }(MockStateController));
    return MockDisabledStateController;
});
jest.mock('../../../state-machine/controller/ErrorHandlerStateController', function () {
    var MockStateController = jest.requireActual('../../MockStateController').default;
    var MockErrorHandlerStateController = /** @class */ (function (_super) {
        tslib_1.__extends(MockErrorHandlerStateController, _super);
        function MockErrorHandlerStateController(innerStateController, errorHandler) {
            var _this = _super.call(this) || this;
            _this.innerStateController = innerStateController;
            _this.errorHandler = errorHandler;
            return _this;
        }
        Object.defineProperty(MockErrorHandlerStateController.prototype, "isEnabled", {
            get: function () {
                return this.innerStateController.isEnabled;
            },
            enumerable: false,
            configurable: true
        });
        return MockErrorHandlerStateController;
    }(MockStateController));
    return MockErrorHandlerStateController;
});
describe('state-machine/controller/useStateControllerInitializer', function () {
    var errorHandler;
    var reportEmitter;
    beforeEach(function () {
        errorHandler = jest.fn();
        reportEmitter = jest.fn();
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    it('initializes the state controller with the correct values when the profiler is enabled', function () {
        var stateController = (0, react_hooks_1.renderHook)(function () {
            return (0, state_machine_1.useStateControllerInitializer)({
                enabled: true,
                errorHandler: errorHandler,
                reportEmitter: reportEmitter,
                useRenderTimeouts: true,
                renderTimeoutMillis: 100,
            });
        }).result.current;
        expect(stateController).toBeInstanceOf(state_machine_1.ErrorHandlerStateController);
        expect(stateController.errorHandler).toBe(errorHandler);
        var innerStateController = stateController.innerStateController;
        expect(innerStateController).toBeInstanceOf(state_machine_1.EnabledStateController);
        expect(stateController.onAppStarted).toHaveBeenCalledTimes(1);
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController.configureRenderTimeout).toHaveBeenCalledTimes(1);
        expect(stateController.addStateChangedListener).toHaveBeenCalledWith(reportEmitter);
        expect(stateController.configureRenderTimeout).toHaveBeenCalledWith({
            enabled: true,
            onRenderTimeout: errorHandler,
            renderTimeoutMillis: 100,
        });
    });
    it('initializes the state controller with the correct values when the profiler is disabled', function () {
        var stateController = (0, react_hooks_1.renderHook)(function () {
            return (0, state_machine_1.useStateControllerInitializer)({
                enabled: false,
                errorHandler: errorHandler,
                reportEmitter: reportEmitter,
                useRenderTimeouts: true,
                renderTimeoutMillis: 100,
            });
        }).result.current;
        expect(stateController).toBeInstanceOf(state_machine_1.ErrorHandlerStateController);
        expect(stateController.errorHandler).toBe(errorHandler);
        var innerStateController = stateController.innerStateController;
        expect(innerStateController).toBeInstanceOf(state_machine_1.DisabledStateController);
        expect(stateController.onAppStarted).toHaveBeenCalledTimes(1);
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController.configureRenderTimeout).toHaveBeenCalledTimes(1);
        expect(stateController.addStateChangedListener).toHaveBeenCalledWith(reportEmitter);
        expect(stateController.configureRenderTimeout).toHaveBeenCalledWith({
            enabled: true,
            onRenderTimeout: errorHandler,
            renderTimeoutMillis: 100,
        });
    });
    it('does not set a render timeout when asked not to', function () {
        var stateController = (0, react_hooks_1.renderHook)(function () {
            return (0, state_machine_1.useStateControllerInitializer)({
                enabled: true,
                errorHandler: errorHandler,
                reportEmitter: reportEmitter,
                useRenderTimeouts: false,
                renderTimeoutMillis: 100,
            });
        }).result.current;
        expect(stateController.configureRenderTimeout).toHaveBeenCalledTimes(1);
        expect(stateController.configureRenderTimeout).toHaveBeenCalledWith({
            enabled: false,
        });
    });
    it('does not create a new instance of the state controller if the hook is re-rendered without prop changes', function () {
        var hookRenderResult = (0, react_hooks_1.renderHook)(function () {
            return (0, state_machine_1.useStateControllerInitializer)({
                enabled: true,
                errorHandler: errorHandler,
                reportEmitter: reportEmitter,
                useRenderTimeouts: true,
                renderTimeoutMillis: 100,
            });
        });
        hookRenderResult.rerender(function () {
            return (0, state_machine_1.useStateControllerInitializer)({
                enabled: true,
                errorHandler: errorHandler,
                reportEmitter: reportEmitter,
                useRenderTimeouts: true,
                renderTimeoutMillis: 100,
            });
        });
        expect(hookRenderResult.result.all[1]).not.toBeUndefined();
        expect(hookRenderResult.result.all[1]).toBe(hookRenderResult.result.all[0]);
    });
    it('hot-swaps the active state controller if the enabled state changes', function () {
        var props = {
            enabled: false,
            errorHandler: errorHandler,
            reportEmitter: reportEmitter,
            useRenderTimeouts: true,
            renderTimeoutMillis: 100,
        };
        var hookRenderResult = (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateControllerInitializer)(props); });
        props = {
            enabled: true,
            errorHandler: errorHandler,
            reportEmitter: reportEmitter,
            useRenderTimeouts: true,
            renderTimeoutMillis: 100,
        };
        hookRenderResult.rerender();
        var _a = tslib_1.__read(hookRenderResult.result.all, 2), stateController1 = _a[0], stateController2 = _a[1];
        expect(stateController1.innerStateController).toBeInstanceOf(state_machine_1.DisabledStateController);
        expect(stateController2.innerStateController).toBeInstanceOf(state_machine_1.EnabledStateController);
        // creates a new instance
        expect(stateController2).not.toBe(stateController1);
        // cleans up the old instance
        expect(stateController1.removeStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController1.configureRenderTimeout).toHaveBeenCalledTimes(2);
        expect(stateController1.removeStateChangedListener).toHaveBeenCalledWith(reportEmitter);
        expect(stateController1.configureRenderTimeout).toHaveBeenLastCalledWith({
            enabled: false,
        });
        // initializes the new instance
        expect(stateController2.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController2.configureRenderTimeout).toHaveBeenCalledTimes(1);
        expect(stateController2.addStateChangedListener).toHaveBeenCalledWith(reportEmitter);
        expect(stateController2.configureRenderTimeout).toHaveBeenLastCalledWith({
            enabled: true,
            onRenderTimeout: errorHandler,
            renderTimeoutMillis: 100,
        });
        // does not notify the new instance of the app started event again
        expect(stateController2.onAppStarted).not.toHaveBeenCalled();
    });
    it('updates the configuration of the active state controller if requested', function () {
        var errorHandler2 = jest.fn();
        var reportEmitter2 = jest.fn();
        var props = {
            enabled: true,
            errorHandler: errorHandler,
            reportEmitter: reportEmitter,
            useRenderTimeouts: true,
            renderTimeoutMillis: 100,
        };
        var hookRenderResult = (0, react_hooks_1.renderHook)(function () { return (0, state_machine_1.useStateControllerInitializer)(props); });
        props = {
            enabled: true,
            errorHandler: errorHandler2,
            reportEmitter: reportEmitter2,
            useRenderTimeouts: true,
            renderTimeoutMillis: 1000,
        };
        hookRenderResult.rerender();
        var _a = tslib_1.__read(hookRenderResult.result.all, 2), stateController1 = _a[0], stateController2 = _a[1];
        // Swaps the ErrorHandlerStateController instance, since the errorHandler changed
        expect(stateController2).not.toBe(stateController1);
        expect(stateController1.errorHandler).toBe(errorHandler);
        expect(stateController2.errorHandler).toBe(errorHandler2);
        expect(stateController1.innerStateController === stateController2.innerStateController).toBe(true);
        // Swaps out the config properties
        expect(stateController1.removeStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController1.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController2.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController1.configureRenderTimeout).toHaveBeenCalledTimes(2);
        expect(stateController2.configureRenderTimeout).toHaveBeenCalledTimes(1);
        expect(stateController1.removeStateChangedListener).toHaveBeenCalledWith(reportEmitter);
        expect(stateController2.addStateChangedListener).toHaveBeenCalledWith(reportEmitter2);
        expect(stateController1.configureRenderTimeout).toHaveBeenNthCalledWith(2, {
            enabled: false,
        });
        expect(stateController2.configureRenderTimeout).toHaveBeenCalledWith({
            enabled: true,
            onRenderTimeout: errorHandler2,
            renderTimeoutMillis: 1000,
        });
    });
    it('cleans up the controller when the hook unmounts', function () {
        var hookRenderResult = (0, react_hooks_1.renderHook)(function () {
            return (0, state_machine_1.useStateControllerInitializer)({
                enabled: true,
                errorHandler: errorHandler,
                reportEmitter: reportEmitter,
                useRenderTimeouts: true,
                renderTimeoutMillis: 100,
            });
        });
        var stateController = hookRenderResult.result.all[0];
        hookRenderResult.unmount();
        expect(stateController.removeStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
        expect(stateController.configureRenderTimeout).toHaveBeenCalledTimes(2);
        expect(stateController.removeStateChangedListener).toHaveBeenCalledWith(reportEmitter);
        expect(stateController.configureRenderTimeout).toHaveBeenNthCalledWith(2, {
            enabled: false,
        });
    });
});
//# sourceMappingURL=useStateControllerInitializer.test.js.map