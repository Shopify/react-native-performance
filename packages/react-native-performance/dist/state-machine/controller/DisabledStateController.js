"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DisabledStateController = /** @class */ (function () {
    function DisabledStateController() {
        this.isEnabled = false;
    }
    DisabledStateController.prototype.configureRenderTimeout = function () { };
    DisabledStateController.prototype.onAppStarted = function () { };
    DisabledStateController.prototype.onNavigationStarted = function () { };
    DisabledStateController.prototype.onScreenMounted = function () { };
    DisabledStateController.prototype.onScreenUnmounted = function () { };
    DisabledStateController.prototype.stopFlowIfNeeded = function () { };
    DisabledStateController.prototype.onFlowReset = function () { };
    DisabledStateController.prototype.onRenderPassCompleted = function () { };
    DisabledStateController.prototype.addStateChangedListener = function () { };
    DisabledStateController.prototype.removeStateChangedListener = function () { };
    DisabledStateController.prototype.getCurrentStateFor = function () {
        return undefined;
    };
    return DisabledStateController;
}());
exports.default = DisabledStateController;
//# sourceMappingURL=DisabledStateController.js.map