import {renderHook, WrapperComponent} from '@testing-library/react-hooks';

import useResetFlow from '../../hooks/useResetFlow';
import {StateController} from '../../state-machine';
import profilerTestWrapper from '../profilerTestWrapper';

describe('hooks/useResetFlow', () => {
  let mockStateController: StateController;
  let wrapper: WrapperComponent<any>;

  beforeEach(() => {
    ({wrapper, stateController: mockStateController} = profilerTestWrapper());
  });

  it('calls stateController.onFlowReset when the flow is reset', () => {
    const reset = renderHook(() => useResetFlow(), {wrapper}).result.current;
    expect(mockStateController.onFlowReset).not.toHaveBeenCalled();
    reset({
      source: 'SomeSourceScreen',
      destination: 'SomeDestinationScreen',
      componentInstanceId: 'id',
    });
    expect(mockStateController.onFlowReset).toHaveBeenCalledTimes(1);
    expect(mockStateController.onFlowReset).toHaveBeenCalledWith({
      sourceScreen: 'SomeSourceScreen',
      destinationScreen: 'SomeDestinationScreen',
      componentInstanceId: 'id',
    });
  });

  it('provides the renderTimeoutMillisOverride when one is provided on navigation start', () => {
    const reset = renderHook(() => useResetFlow(), {wrapper}).result.current;
    expect(mockStateController.onNavigationStarted).not.toHaveBeenCalled();
    reset({
      source: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
      componentInstanceId: 'id',
      destination: 'SomeSourceScreen',
    });
    expect(mockStateController.onNavigationStarted).toHaveBeenCalledTimes(1);
    expect(mockStateController.onNavigationStarted).toHaveBeenCalledWith({
      sourceScreen: 'SomeSourceScreen',
      destinationScreen: 'SomeDestinationScreen',
      renderTimeoutMillisOverride: 34,
    });
  });

  it('provides the renderTimeoutMillisOverride when one is provided on flow reset', () => {
    const reset = renderHook(() => useResetFlow(), {wrapper}).result.current;
    expect(mockStateController.onFlowReset).not.toHaveBeenCalled();
    reset({
      source: 'SomeSourceScreen',
      destination: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
      componentInstanceId: 'id',
    });
    expect(mockStateController.onFlowReset).toHaveBeenCalledTimes(1);
    expect(mockStateController.onFlowReset).toHaveBeenCalledWith({
      sourceScreen: 'SomeSourceScreen',
      destinationScreen: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
      componentInstanceId: 'id',
    });
  });
});
