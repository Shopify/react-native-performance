/// <reference types="react" />
import ListsProfilerProps from './ListsProfilerProps';
interface FlatListPerformanceViewProps {
    /**
     * Name of the list. Used for distinguishing between lists in the `ListsProfiler`.
     */
    listName: string;
    children: JSX.Element;
}
/**
 * Wrap your `FlatList` with this component.
 */
declare const FlatListPerformanceView: ({ children, listName, onInteractive, onBlankArea, }: FlatListPerformanceViewProps & ListsProfilerProps) => JSX.Element;
export default FlatListPerformanceView;
//# sourceMappingURL=FlatListPerformanceView.d.ts.map