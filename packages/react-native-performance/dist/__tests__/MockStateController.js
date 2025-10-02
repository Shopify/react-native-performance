"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MockStateController = /** @class */ (function () {
    function MockStateController() {
        this.configureRenderTimeout = jest.fn();
        this.addStateChangedListener = jest.fn();
        this.removeStateChangedListener = jest.fn();
        this.onAppStarted = jest.fn();
        this.onNavigationStarted = jest.fn();
        this.onScreenMounted = jest.fn();
        this.onScreenUnmounted = jest.fn();
        this.onFlowReset = jest.fn();
        this.onRenderPassCompleted = jest.fn();
        this.getCurrentStateFor = jest.fn();
        this.stopFlowIfNeeded = jest.fn();
        this.isEnabled = false;
    }
    return MockStateController;
}());
exports.default = MockStateController;
//# sourceMappingURL=MockStateController.js.map