import {requireNativeComponent, StyleProp, ViewStyle} from 'react-native';

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

type OnInteractiveHandler = (event: OnInteractiveEvent) => void;
type OnBlankAreaEventHandler = (event: OnBlankAreaEvent) => void;

interface FlashListPerformanceViewNativeComponentProps {
  onInteractive: OnInteractiveHandler;
  onBlankAreaEvent: OnBlankAreaEventHandler;
  style: StyleProp<ViewStyle>;
}

const FlashListPerformanceViewNativeComponent =
  requireNativeComponent<FlashListPerformanceViewNativeComponentProps>('FlashListPerformanceView');
export {FlashListPerformanceViewNativeComponent};
