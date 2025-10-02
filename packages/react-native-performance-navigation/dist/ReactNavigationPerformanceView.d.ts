import type { ComponentProps } from 'react';
import { PerformanceMeasureView } from '@shopify/react-native-performance';
export declare type Props = ComponentProps<typeof PerformanceMeasureView>;
/**
 * Performance view similar to `PerformanceMeasureView` but meant to be used with `react-navigation`.
 * If the screen is not mounted in a react-navigation context, it might misbehave and is therefore not recommended.
 */
export declare const ReactNavigationPerformanceView: (props: Props) => JSX.Element;
//# sourceMappingURL=ReactNavigationPerformanceView.d.ts.map