import GestureResponderEvent from "../../GestureResponderEvent";
import { ErrorHandler } from "../../utils";

import StateController, {
  OnStateChangedListener,
  RenderTimeoutConfig,
} from "./StateController";

export default class ErrorHandlerStateController implements StateController {
  readonly innerStateController: StateController;
  readonly errorHandler: ErrorHandler;

  constructor(
    innerStateController: StateController,
    errorHandler: ErrorHandler
  ) {
    this.innerStateController = innerStateController;
    this.errorHandler = errorHandler;
  }

  get isEnabled() {
    try {
      return this.innerStateController.isEnabled;
    } catch (error) {
      this.errorHandler(error);
      return false;
    }
  }

  configureRenderTimeout(config: RenderTimeoutConfig) {
    try {
      this.innerStateController.configureRenderTimeout(config);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  onAppStarted() {
    try {
      this.innerStateController.onAppStarted();
    } catch (error) {
      this.errorHandler(error);
    }
  }

  onNavigationStarted(props: {
    sourceScreen?: string | undefined;
    uiEvent?: GestureResponderEvent | undefined;
    renderTimeoutMillisOverride?: number | undefined;
  }) {
    try {
      this.innerStateController.onNavigationStarted(props);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  onScreenMounted(props: {
    destinationScreen: string;
    componentInstanceId: string;
  }) {
    try {
      this.innerStateController.onScreenMounted(props);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  stopFlowIfNeeded(componentInstanceId: string) {
    try {
      this.innerStateController.stopFlowIfNeeded(componentInstanceId);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  onScreenUnmounted(props: {
    destinationScreen: string;
    componentInstanceId: string;
  }) {
    try {
      this.innerStateController.onScreenUnmounted(props);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  onFlowReset(props: {
    sourceScreen?: string | undefined;
    destinationScreen: string;
    uiEvent?: GestureResponderEvent | undefined;
    renderTimeoutMillisOverride?: number | undefined;
  }) {
    try {
      this.innerStateController.onFlowReset(props);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  onRenderPassCompleted(props: {
    renderPassName: string;
    timestamp: number;
    destinationScreen: string;
    interactive: boolean;
    componentInstanceId: string;
  }) {
    try {
      this.innerStateController.onRenderPassCompleted(props);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  addStateChangedListener(listener: OnStateChangedListener) {
    try {
      this.innerStateController.addStateChangedListener(listener);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  removeStateChangedListener(listener: OnStateChangedListener) {
    try {
      this.innerStateController.removeStateChangedListener(listener);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  getCurrentStateFor(destinationScreen: string | RegExp) {
    try {
      return this.innerStateController.getCurrentStateFor(destinationScreen);
    } catch (error) {
      this.errorHandler(error);
      return undefined;
    }
  }
}
