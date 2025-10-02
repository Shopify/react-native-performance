import StateController from './StateController';
export default class DisabledStateController implements StateController {
    readonly isEnabled = false;
    configureRenderTimeout(): void;
    onAppStarted(): void;
    onNavigationStarted(): void;
    onScreenMounted(): void;
    onScreenUnmounted(): void;
    stopFlowIfNeeded(): void;
    onFlowReset(): void;
    onRenderPassCompleted(): void;
    addStateChangedListener(): void;
    removeStateChangedListener(): void;
    getCurrentStateFor(): undefined;
}
//# sourceMappingURL=DisabledStateController.d.ts.map