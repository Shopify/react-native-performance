export interface OnInteractiveEvent {
    nativeEvent: {
        timestamp: number;
    };
}
export interface OnBlankAreaEvent {
    nativeEvent: {
        offsetStart: number;
        offsetEnd: number;
    };
}
declare type OnInteractiveHandler = (event: OnInteractiveEvent) => void;
declare type OnBlankAreaEventHandler = (event: OnBlankAreaEvent) => void;
interface FlatListPerformanceViewNativeComponentProps {
    onInteractive: OnInteractiveHandler;
    onBlankAreaEvent: OnBlankAreaEventHandler;
}
declare const FlatListPerformanceViewNativeComponent: import("react-native").HostComponent<FlatListPerformanceViewNativeComponentProps>;
export { FlatListPerformanceViewNativeComponent };
//# sourceMappingURL=FlatListPerformanceViewNativeComponent.d.ts.map