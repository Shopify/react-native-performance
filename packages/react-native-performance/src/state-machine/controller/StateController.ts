import { RenderTimeoutError } from "../../exceptions";
import GestureResponderEvent from "../../GestureResponderEvent";
import { State } from "../states";

export type OnStateChangedListener = (
  destinationScreen: string,
  oldState: State | undefined,
  newState: State
) => void;

export type RenderTimeoutConfig =
  | {
      enabled: true;
      renderTimeoutMillis: number;
      onRenderTimeout: (error: RenderTimeoutError) => void;
    }
  | {
      enabled: false;
      renderTimeoutMillis?: never;
      onRenderTimeout?: never;
    };

interface StateController {
  readonly isEnabled: boolean;
  configureRenderTimeout(config: RenderTimeoutConfig): void;

  onAppStarted(): void;
  onNavigationStarted(props: {
    sourceScreen?: string;
    uiEvent?: GestureResponderEvent;
    renderTimeoutMillisOverride?: number;
  }): void;
  stopFlowIfNeeded(componentInstanceId: string): void;
  onScreenMounted(props: {
    destinationScreen: string;
    componentInstanceId: string;
  }): void;
  onScreenUnmounted(props: {
    destinationScreen: string;
    componentInstanceId: string;
  }): void;
  onFlowReset(props: {
    sourceScreen?: string;
    destinationScreen: string;
    uiEvent?: GestureResponderEvent;
    renderTimeoutMillisOverride?: number;
  }): void;
  onRenderPassCompleted(props: {
    renderPassName: string;
    timestamp: number;
    destinationScreen: string;
    interactive: boolean;
    componentInstanceId: string;
  }): void;
  addStateChangedListener(listener: OnStateChangedListener): void;
  removeStateChangedListener(listener: OnStateChangedListener): void;
  getCurrentStateFor(destinationScreen: string | RegExp): State | undefined;
}

export default StateController;
