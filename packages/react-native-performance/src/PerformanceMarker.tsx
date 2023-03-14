import {ViewStyle, requireNativeComponent, HostComponent} from 'react-native';

export interface RenderCompletionEvent {
  nativeEvent: {
    timestamp: string;
    renderPassName: string;
    interactive: boolean;
    destinationScreen: string;
    componentInstanceId: string;
  };
}

type OnRenderCompletionEventHandler = (event: RenderCompletionEvent) => void;

export interface PerformanceMarkerProps {
  componentInstanceId: string;
  renderPassName: string;
  interactive: boolean;
  destinationScreen: string;
  style: ViewStyle;
  onRenderComplete: OnRenderCompletionEventHandler;
}

/**
 * Lazy-import the native component such that it is only actually imported if the profiling
 * is enabled. Otherwise, we want most operations to be stubbed out.
 * PerformanceMeasureView takes care of calling getPerformanceMarker only when needed.
 */
let PerformanceMarker: HostComponent<PerformanceMarkerProps> | undefined;

export function getPerformanceMarker() {
  if (PerformanceMarker === undefined) {
    PerformanceMarker = requireNativeComponent<PerformanceMarkerProps>('PerformanceMarker');
  }
  return PerformanceMarker;
}
