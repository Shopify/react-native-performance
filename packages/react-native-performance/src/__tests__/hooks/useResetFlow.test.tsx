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
    const {resetFlow, componentInstanceId} = renderHook(() => useResetFlow(), {wrapper}).result.current;
    expect(mockStateController.onFlowReset).not.toHaveBeenCalled();
    resetFlow({
      destination: 'SomeDestinationScreen',
    });
    expect(mockStateController.onFlowReset).toHaveBeenCalledTimes(1);
    expect(mockStateController.onFlowReset).toHaveBeenCalledWith({
      destinationScreen: 'SomeDestinationScreen',
      componentInstanceId,
    });
  });

  it('provides the renderTimeoutMillisOverride when one is provided on flow reset', () => {
    const {resetFlow, componentInstanceId} = renderHook(() => useResetFlow(), {wrapper}).result.current;
    resetFlow({
      destination: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
    });
    expect(mockStateController.onFlowReset).toHaveBeenCalledTimes(1);
    expect(mockStateController.onFlowReset).toBeCalledWith({
      destinationScreen: 'SomeSourceScreen',
      renderTimeoutMillisOverride: 34,
      componentInstanceId,
    });
  });
});
