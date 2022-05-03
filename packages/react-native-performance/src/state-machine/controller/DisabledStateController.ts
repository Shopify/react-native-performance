import StateController from "./StateController";

export default class DisabledStateController implements StateController {
  readonly isEnabled = false;
  configureRenderTimeout() {}

  onAppStarted() {}
  onNavigationStarted() {}
  onScreenMounted() {}
  onScreenUnmounted() {}
  stopFlowIfNeeded() {}
  onFlowReset() {}
  onRenderPassCompleted() {}
  addStateChangedListener() {}
  removeStateChangedListener() {}
  getCurrentStateFor() {
    return undefined;
  }
}
