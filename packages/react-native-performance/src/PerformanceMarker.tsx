import { ViewStyle, requireNativeComponent, HostComponent } from "react-native";

// On iOS, we cannot send back non-object types to JS via a dictionary.
// So we are using strings. Legal values: `TRUE` and `FALSE`.
export type Interactive = "TRUE" | "FALSE";

export interface PerformanceMarkerProps {
  componentInstanceId: string;
  renderPassName: string;
  interactive: Interactive;
  destinationScreen: string;
  style: ViewStyle;
}

/**
 * Lazy-import the native component such that it is only actually imported if the profiling
 * is enabled. Otherwise, we want most operations to be stubbed out.
 * PerformanceMeasureView takes care of calling getPerformanceMarker only when needed.
 */
let PerformanceMarker: HostComponent<PerformanceMarkerProps> | undefined;

export function getPerformanceMarker() {
  if (PerformanceMarker === undefined) {
    PerformanceMarker =
      requireNativeComponent<PerformanceMarkerProps>("PerformanceMarker");
  }
  return PerformanceMarker;
}
