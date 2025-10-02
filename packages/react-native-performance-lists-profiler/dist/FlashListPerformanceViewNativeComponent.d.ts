import { StyleProp, ViewStyle } from 'react-native';
interface OnInteractiveEvent {
    nativeEvent: {
        timestamp: number;
    };
}
interface OnBlankAreaEvent {
    nativeEvent: {
        offsetStart: number;
        offsetEnd: number;
    };
}
declare type OnInteractiveHandler = (event: OnInteractiveEvent) => void;
declare type OnBlankAreaEventHandler = (event: OnBlankAreaEvent) => void;
interface FlashListPerformanceViewNativeComponentProps {
    onInteractive: OnInteractiveHandler;
    onBlankAreaEvent: OnBlankAreaEventHandler;
    style: StyleProp<ViewStyle>;
}
declare const FlashListPerformanceViewNativeComponent: import("react-native").HostComponent<FlashListPerformanceViewNativeComponentProps>;
export { FlashListPerformanceViewNativeComponent };
//# sourceMappingURL=FlashListPerformanceViewNativeComponent.d.ts.map