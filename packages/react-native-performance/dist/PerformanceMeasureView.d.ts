import { ReactNode } from 'react';
export declare const DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME = "loading";
export declare const DEFAULT_INTERACTIVE_RENDER_PASS_NAME = "interactive";
interface BaseProps {
    screenName: string;
    children: ReactNode;
    componentInstanceId?: string | undefined;
}
export interface RenderStateProps {
    interactive?: boolean;
    renderPassName?: string;
}
declare type SlowRenderOptimizeProps = {
    optimizeForSlowRenderComponents: true;
    slowRenderPlaceholder?: ReactNode;
} | {
    optimizeForSlowRenderComponents?: false;
    slowRenderPlaceholder?: never;
};
declare type PerformanceMeasureViewProps = BaseProps & RenderStateProps & SlowRenderOptimizeProps;
declare const PerformanceMeasureView: ({ screenName, children, optimizeForSlowRenderComponents, slowRenderPlaceholder, ...renderStateProps }: PerformanceMeasureViewProps) => JSX.Element | null;
export default PerformanceMeasureView;
//# sourceMappingURL=PerformanceMeasureView.d.ts.map