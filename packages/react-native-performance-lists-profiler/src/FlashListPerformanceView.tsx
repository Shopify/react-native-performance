import React, {useContext, useRef} from 'react';

import {ListsProfilerContext} from './ListsProfilerContext';
import {FlashListPerformanceViewNativeComponent} from './FlashListPerformanceViewNativeComponent';

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
const FlashListPerformanceView = ({listName, children}: FlashListPerformanceViewProps) => {
  const time = useRef(Date.now()).current;
  const listsProfilerController = useContext(ListsProfilerContext);
  return (
    <FlashListPerformanceViewNativeComponent
      style={{flex: 1}}
      onInteractive={({nativeEvent}) => {
        listsProfilerController.onInteractive(nativeEvent.timestamp - time, listName);
      }}
      onBlankAreaEvent={({nativeEvent}) => {
        listsProfilerController.onBlankArea(nativeEvent.offsetStart, nativeEvent.offsetEnd, listName);
      }}
    >
      {children}
    </FlashListPerformanceViewNativeComponent>
  );
};
export default FlashListPerformanceView;
