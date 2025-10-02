import { ViewStyle, HostComponent } from 'react-native';
export declare type Interactive = 'TRUE' | 'FALSE';
export interface RenderCompletionEvent {
    nativeEvent: {
        timestamp: string;
        renderPassName: string;
        interactive: Interactive;
        destinationScreen: string;
        componentInstanceId: string;
    };
}
declare type OnRenderCompletionEventHandler = (event: RenderCompletionEvent) => void;
export interface PerformanceMarkerProps {
    componentInstanceId: string;
    renderPassName: string;
    interactive: Interactive;
    destinationScreen: string;
    style: ViewStyle;
    onRenderComplete: OnRenderCompletionEventHandler;
}
export declare function getPerformanceMarker(): HostComponent<PerformanceMarkerProps>;
export {};
//# sourceMappingURL=PerformanceMarker.d.ts.map