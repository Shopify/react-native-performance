import GestureResponderEvent from '../../GestureResponderEvent';
import { ErrorHandler } from '../../utils';
import StateController, { OnStateChangedListener, RenderTimeoutConfig } from './StateController';
export default class ErrorHandlerStateController implements StateController {
    readonly innerStateController: StateController;
    readonly errorHandler: ErrorHandler;
    constructor(innerStateController: StateController, errorHandler: ErrorHandler);
    get isEnabled(): boolean;
    configureRenderTimeout(config: RenderTimeoutConfig): void;
    onAppStarted(): void;
    onNavigationStarted(props: {
        sourceScreen?: string | undefined;
        uiEvent?: GestureResponderEvent | undefined;
        renderTimeoutMillisOverride?: number | undefined;
    }): void;
    onScreenMounted(props: {
        destinationScreen: string;
        componentInstanceId: string;
    }): void;
    stopFlowIfNeeded(componentInstanceId: string): void;
    onScreenUnmounted(props: {
        destinationScreen: string;
        componentInstanceId: string;
    }): void;
    onFlowReset(props: {
        sourceScreen?: string | undefined;
        destinationScreen: string;
        uiEvent?: GestureResponderEvent | undefined;
        renderTimeoutMillisOverride?: number | undefined;
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
    getCurrentStateFor(destinationScreen: string | RegExp): import("../states/State").default | undefined;
}
//# sourceMappingURL=ErrorHandlerStateController.d.ts.map