import React, {useRef, useContext, useCallback} from 'react';

import {ListsProfilerContext} from './ListsProfilerContext';
import {
  FlatListPerformanceViewNativeComponent,
  OnBlankAreaEvent,
  OnInteractiveEvent,
} from './FlatListPerformanceViewNativeComponent';
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
const FlatListPerformanceView = ({
  children,
  listName,
  onInteractive = () => {},
  onBlankArea = () => {},
}: FlatListPerformanceViewProps & ListsProfilerProps) => {
  const time = useRef(Date.now()).current;
  const listsProfilerController = useContext(ListsProfilerContext);
  const onInteractiveCallback = useCallback(
    ({nativeEvent}: OnInteractiveEvent) => {
      const tti = nativeEvent.timestamp - time;
      onInteractive(tti, listName);
      listsProfilerController.onInteractive(tti, listName);
    },
    [listsProfilerController, onInteractive, listName, time],
  );
  const onBlankAreaCallback = useCallback(
    ({nativeEvent}: OnBlankAreaEvent) => {
      onBlankArea(nativeEvent.offsetStart, nativeEvent.offsetEnd, listName);
      listsProfilerController.onBlankArea(nativeEvent.offsetStart, nativeEvent.offsetEnd, listName);
    },
    [onBlankArea, listsProfilerController, listName],
  );
  return (
    <FlatListPerformanceViewNativeComponent
      onInteractive={onInteractiveCallback}
      onBlankAreaEvent={onBlankAreaCallback}
    >
      {children}
    </FlatListPerformanceViewNativeComponent>
  );
};
export default FlatListPerformanceView;
