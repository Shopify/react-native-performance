"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorHandlerStateController = /** @class */ (function () {
    function ErrorHandlerStateController(innerStateController, errorHandler) {
        this.innerStateController = innerStateController;
        this.errorHandler = errorHandler;
    }
    Object.defineProperty(ErrorHandlerStateController.prototype, "isEnabled", {
        get: function () {
            try {
                return this.innerStateController.isEnabled;
            }
            catch (error) {
                this.errorHandler(error);
                return false;
            }
        },
        enumerable: false,
        configurable: true
    });
    ErrorHandlerStateController.prototype.configureRenderTimeout = function (config) {
        try {
            this.innerStateController.configureRenderTimeout(config);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.onAppStarted = function () {
        try {
            this.innerStateController.onAppStarted();
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.onNavigationStarted = function (props) {
        try {
            this.innerStateController.onNavigationStarted(props);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.onScreenMounted = function (props) {
        try {
            this.innerStateController.onScreenMounted(props);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.stopFlowIfNeeded = function (componentInstanceId) {
        try {
            this.innerStateController.stopFlowIfNeeded(componentInstanceId);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.onScreenUnmounted = function (props) {
        try {
            this.innerStateController.onScreenUnmounted(props);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.onFlowReset = function (props) {
        try {
            this.innerStateController.onFlowReset(props);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.onRenderPassCompleted = function (props) {
        try {
            this.innerStateController.onRenderPassCompleted(props);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.addStateChangedListener = function (listener) {
        try {
            this.innerStateController.addStateChangedListener(listener);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.removeStateChangedListener = function (listener) {
        try {
            this.innerStateController.removeStateChangedListener(listener);
        }
        catch (error) {
            this.errorHandler(error);
        }
    };
    ErrorHandlerStateController.prototype.getCurrentStateFor = function (destinationScreen) {
        try {
            return this.innerStateController.getCurrentStateFor(destinationScreen);
        }
        catch (error) {
            this.errorHandler(error);
            return undefined;
        }
    };
    return ErrorHandlerStateController;
}());
exports.default = ErrorHandlerStateController;
//# sourceMappingURL=ErrorHandlerStateController.js.map