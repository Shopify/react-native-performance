import {StateController} from '../state-machine';

export default class MockStateController implements StateController {
  configureRenderTimeout = jest.fn();
  addStateChangedListener = jest.fn();
  removeStateChangedListener = jest.fn();
  onAppStarted = jest.fn();
  onNavigationStarted = jest.fn();
  onScreenMounted = jest.fn();
  onScreenUnmounted = jest.fn();
  onFlowReset = jest.fn();
  onRenderPassCompleted = jest.fn();
  getCurrentStateFor = jest.fn();
  stopFlowIfNeeded = jest.fn();

  isEnabled = false;
}
