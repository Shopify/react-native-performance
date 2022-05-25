import {renderHook, WrapperComponent} from '@testing-library/react-hooks';

import useStartProfiler from '../../hooks/useStartProfiler';
import {StateController} from '../../state-machine';
import profilerTestWrapper from '../profilerTestWrapper';

describe('hooks/useStartProfiler', () => {
  let mockStateController: StateController;
  let wrapper: WrapperComponent<any>;

  beforeEach(() => {
    ({wrapper, stateController: mockStateController} = profilerTestWrapper());
  });

  it('calls stateController.onNavigationStarted', () => {
    const start = renderHook(() => useStartProfiler(), {wrapper}).result.current;

    expect(mockStateController.onNavigationStarted).not.toHaveBeenCalled();

    start({
      source: 'SomeSourceScreen',
      uiEvent: {
        nativeEvent: {
          timestamp: 1000,
        },
      },
    });

    expect(mockStateController.onNavigationStarted).toHaveBeenCalledTimes(1);
    expect(mockStateController.onNavigationStarted).toHaveBeenCalledWith({
      sourceScreen: 'SomeSourceScreen',
      uiEvent: {
        nativeEvent: {
          timestamp: 1000,
        },
      },
    });
  });

  it('provides the renderTimeoutMillisOverride when one is provided on navigation start', () => {
    const start = renderHook(() => useStartProfiler(), {wrapper}).result.current;
    expect(mockStateController.onNavigationStarted).not.toHaveBeenCalled();
    start({
      source: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
    });
    expect(mockStateController.onNavigationStarted).toHaveBeenCalledTimes(1);
    expect(mockStateController.onNavigationStarted).toHaveBeenCalledWith({
      sourceScreen: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
    });
  });
});
