/* eslint-disable @typescript-eslint/ban-ts-comment */
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

  it('calls stateController.onNavigationStarted when reset is undefined', () => {
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

  it('calls stateController.onNavigationStarted when reset is explicitly set to false', () => {
    const start = renderHook(() => useStartProfiler(), {wrapper}).result.current;

    // @ts-ignore
    expect(mockStateController.onNavigationStarted).not.toHaveBeenCalled();

    start({
      source: 'SomeSourceScreen',
      uiEvent: {
        nativeEvent: {
          timestamp: 1000,
        },
      },
      reset: false,
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

  it('calls stateController.onFlowReset when the flow is reset', () => {
    const start = renderHook(() => useStartProfiler(), {wrapper}).result.current;
    expect(mockStateController.onFlowReset).not.toHaveBeenCalled();
    start({
      source: 'SomeSourceScreen',
      destination: 'SomeDestinationScreen',
      reset: true,
    });
    expect(mockStateController.onFlowReset).toHaveBeenCalledTimes(1);
    expect(mockStateController.onFlowReset).toHaveBeenCalledWith({
      sourceScreen: 'SomeSourceScreen',
      destinationScreen: 'SomeDestinationScreen',
    });
  });

  it('provides the renderTimeoutMillisOverride when one is provided on navigation start', () => {
    const start = renderHook(() => useStartProfiler(), {wrapper}).result.current;
    expect(mockStateController.onNavigationStarted).not.toHaveBeenCalled();
    start({
      source: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
      reset: false,
    });
    expect(mockStateController.onNavigationStarted).toHaveBeenCalledTimes(1);
    expect(mockStateController.onNavigationStarted).toHaveBeenCalledWith({
      sourceScreen: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
    });
  });

  it('provides the renderTimeoutMillisOverride when one is provided on flow reset', () => {
    const start = renderHook(() => useStartProfiler(), {wrapper}).result.current;
    expect(mockStateController.onFlowReset).not.toHaveBeenCalled();
    start({
      source: 'SomeSourceScreen',
      destination: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
      reset: true,
    });
    expect(mockStateController.onFlowReset).toHaveBeenCalledTimes(1);
    expect(mockStateController.onFlowReset).toHaveBeenCalledWith({
      sourceScreen: 'SomeSourceScreen',
      destinationScreen: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
    });
  });
});
