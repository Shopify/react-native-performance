import { PerformanceProfilerError } from '../../exceptions';
import GestureResponderEvent from '../../GestureResponderEvent';
import { State } from '../states';
import StateController, { RenderTimeoutConfig, OnStateChangedListener } from './StateController';
export declare const DESTINATION_SCREEN_NAME_PLACEHOLDER = "__unknown_destination_screen__";
export declare class InvalidMountStateError extends PerformanceProfilerError {
    readonly name = "InvalidMountStateError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string, componentInstanceId: string);
}
export declare class ReuseComponentInstanceIDError extends PerformanceProfilerError {
    readonly name = "ReuseSnapshotIDError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string, componentInstanceId: string);
}
/**
 * This can happen if you have a non-standard navigation flow, such as here: https://github.com/Shopify/react-native-performance/issues/97
 */
export declare class MultipleFlowsError extends PerformanceProfilerError {
    readonly name = "MultipleFlowsError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string);
}
export default class EnabledStateController implements StateController {
    readonly isEnabled = true;
    private renderTimeoutConfig;
    private readonly stateRegistry;
    private readonly watchdogTimers;
    private readonly onStateChangedListeners;
    onAppStarted(): void;
    configureRenderTimeout(config: RenderTimeoutConfig): void;
    addStateChangedListener(listener: OnStateChangedListener): void;
    removeStateChangedListener(listener: OnStateChangedListener): void;
    getCurrentStateFor(destinationScreenToReportPattern: string | RegExp): State | undefined;
    onNavigationStarted({ sourceScreen, uiEvent, renderTimeoutMillisOverride, }: {
        sourceScreen?: string;
        uiEvent?: GestureResponderEvent;
        renderTimeoutMillisOverride?: number;
    }): void;
    onScreenMounted({ destinationScreen, componentInstanceId }: {
        destinationScreen: string;
        componentInstanceId: string;
    }): void;
    onScreenUnmounted({ destinationScreen, componentInstanceId, }: {
        destinationScreen: string;
        componentInstanceId: string;
    }): void;
    onFlowReset({ sourceScreen, destinationScreen, uiEvent, renderTimeoutMillisOverride, componentInstanceId, }: {
        sourceScreen?: string;
        destinationScreen: string;
        uiEvent?: GestureResponderEvent;
        renderTimeoutMillisOverride?: number;
        componentInstanceId: string;
    }): void;
    onRenderPassCompleted(props: {
        renderPassName: string;
        timestamp: number;
        destinationScreen: string;
        interactive: boolean;
        componentInstanceId: string;
    }): void;
    private onFlowStart;
    /**
     * Stops current flow if the screen was already mounted.
     * This can occur when navigating repeatedly to the same instance of a screen.
     * @param componentInstanceId Instance ID of the mounted screen.
     */
    stopFlowIfNeeded(componentInstanceId: string): void;
    private safeGetCurrentState;
    private onDestinationScreenNameAcquired;
    private changeStateTo;
    private stopWatchdogTimerForComponent;
    private findWatchdogTimerIdForComponent;
    private addRenderWatchdogTimerIfEnabled;
    private clearAllWatchdogTimers;
    private addWatchdogTimersForUnwatchedComponents;
    private hasMatchingMountUnmountPairs;
}
//# sourceMappingURL=EnabledStateController.d.ts.map