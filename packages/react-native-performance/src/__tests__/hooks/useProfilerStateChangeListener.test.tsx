/* eslint-disable @typescript-eslint/ban-ts-comment */
import {act} from '@testing-library/react-native';
import {renderHook, WrapperComponent} from '@testing-library/react-hooks';

import {State} from '../../state-machine/states';
import useProfilerStateChangeListener from '../../hooks/useProfilerStateChangeListener';
import {StateController} from '../../state-machine';
import profilerTestWrapper from '../profilerTestWrapper';

describe('hooks/useProfilerStateChangeListener', () => {
  let stateController: StateController;
  let onStateChanged: (_: State) => void;
  let wrapper: WrapperComponent<any>;

  beforeEach(() => {
    onStateChanged = jest.fn();
    ({wrapper, stateController} = profilerTestWrapper());
  });

  it("initializes the state with the state controller's current state", () => {
    const mockInitialState = {name: 'some state'};
    // @ts-ignore
    stateController.getCurrentStateFor.mockReturnValueOnce(mockInitialState);

    renderHook(
      () =>
        useProfilerStateChangeListener({
          destinationScreen: 'foo',
          onStateChanged,
        }),
      {wrapper},
    );

    expect(onStateChanged).toHaveBeenCalledWith(mockInitialState);
  });

  it('subscribes to state changes from the state controller', () => {
    const mockNewState = {name: 'some state'};

    expect(stateController.addStateChangedListener).not.toHaveBeenCalled();

    renderHook(
      () =>
        useProfilerStateChangeListener({
          destinationScreen: 'foo',
          onStateChanged,
        }),
      {wrapper},
    );

    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);

    expect(onStateChanged).not.toHaveBeenCalled();
    // @ts-ignore
    act(() => stateController.addStateChangedListener.mock.calls[0][0]('foo', undefined, mockNewState));
    expect(onStateChanged).toHaveBeenCalledWith(mockNewState);
  });

  it('ignores state changes from screens that the user does not care about', () => {
    expect(stateController.addStateChangedListener).not.toHaveBeenCalled();

    renderHook(
      () =>
        useProfilerStateChangeListener({
          destinationScreen: 'foo',
          onStateChanged,
        }),
      {wrapper},
    );

    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    // @ts-ignore
    stateController.addStateChangedListener.mock.calls[0][0]('bar', undefined, {
      name: 'some state',
    });
    expect(onStateChanged).not.toHaveBeenCalled();
  });

  it('unsubscribes to the state changes when unmounted', () => {
    const renderHookResult = renderHook(
      () =>
        useProfilerStateChangeListener({
          destinationScreen: 'foo',
          onStateChanged,
        }),
      {
        wrapper,
      },
    );

    expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();
    renderHookResult.unmount();
    expect(stateController.removeStateChangedListener).toHaveBeenCalledTimes(1);
  });

  it('does not unsubscribe and re-subscribe if the hook is re-rendered with a regex destinationScreen', () => {
    expect(stateController.addStateChangedListener).not.toHaveBeenCalled();

    const renderHookResult = renderHook(
      () =>
        useProfilerStateChangeListener({
          destinationScreen: new RegExp('.*'),
          onStateChanged,
        }),
      {wrapper},
    );

    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();

    renderHookResult.rerender();

    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();
  });
});
