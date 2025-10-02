/// <reference types="react" />
interface FlashListPerformanceViewProps {
    /**
     * Name of the list. Used for distinguishing between lists in the `ListsProfiler`.
     */
    listName: string;
    children: JSX.Element;
}
/**
 * Wrap your `FlashList` with this component.
 */
declare const FlashListPerformanceView: ({ listName, children }: FlashListPerformanceViewProps) => JSX.Element;
export default FlashListPerformanceView;
//# sourceMappingURL=FlashListPerformanceView.d.ts.map