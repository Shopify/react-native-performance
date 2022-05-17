/* eslint-disable @typescript-eslint/ban-ts-comment */
import {renderHook} from '@testing-library/react-hooks';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

import MockStateController from '../MockStateController';
import useNativeRenderCompletionEvents, {
  RENDER_COMPLETION_EVENT_NAME,
  RenderCompletionEvent,
} from '../../context/useNativeRenderCompletionEvents';

jest.mock('react-native', () => {
  return {
    NativeEventEmitter: jest.fn(),
    NativeModules: {},
    Platform: {
      OS: 'ios',
    },
  };
});

describe('context/useNativeRenderCompletionEvents', () => {
  let stateController: MockStateController;
  let addListener: NativeEventEmitter['addListener'];
  let eventEmitterNativeModuleGetter: () => any;

  beforeEach(() => {
    eventEmitterNativeModuleGetter = jest.fn().mockReturnValue('some-mock-module-value');
    Object.defineProperty(NativeModules, 'RenderCompletionEventEmitter', {
      get: eventEmitterNativeModuleGetter,
      configurable: true,
    });

    stateController = new MockStateController();
    stateController.isEnabled = true;

    addListener = jest.fn();
    // @ts-ignore
    NativeEventEmitter.mockImplementation(() => {
      return {
        addListener,
      };
    });
    Platform.OS = 'ios';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('adds an event listener on render', () => {
    renderHook(() => useNativeRenderCompletionEvents({stateController}));

    expect(addListener).toHaveBeenCalledTimes(1);
    expect(addListener).toHaveBeenCalledWith(RENDER_COMPLETION_EVENT_NAME, expect.any(Function));
  });

  it('cleans up the event listener on unmount', () => {
    const mockRemove = jest.fn();
    // @ts-ignore
    addListener.mockReturnValue({
      remove: mockRemove,
    });
    const renderAPI = renderHook(() => useNativeRenderCompletionEvents({stateController}));

    expect(mockRemove).not.toHaveBeenCalled();
    renderAPI.unmount();
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });

  it('notifies the stateController of the render pass completion events correctly', () => {
    renderHook(() => useNativeRenderCompletionEvents({stateController}));

    // @ts-ignore
    const onRenderComplete = addListener.mock.calls[0][1] as (_: RenderCompletionEvent) => void;
    expect(stateController.onRenderPassCompleted).not.toHaveBeenCalled();

    onRenderComplete({
      timestamp: '123',
      destinationScreen: 'some_screen',
      componentInstanceId: 'id',
      renderPassName: 'some_pass',
      interactive: 'FALSE',
    });

    expect(stateController.onRenderPassCompleted).toHaveBeenCalledTimes(1);

    expect(stateController.onRenderPassCompleted).toHaveBeenCalledWith({
      timestamp: 123,
      destinationScreen: 'some_screen',
      componentInstanceId: 'id',
      renderPassName: 'some_pass',
      interactive: false,
    });
  });

  it('passes the correct native module as the subscriber on ios', () => {
    renderHook(() => useNativeRenderCompletionEvents({stateController}));
    expect(NativeEventEmitter).toHaveBeenCalledTimes(1);
    expect(eventEmitterNativeModuleGetter).toHaveBeenCalledTimes(1);
    expect(NativeEventEmitter).toHaveBeenCalledWith(NativeModules.RenderCompletionEventEmitter);
  });

  it('passes the correct native module as the subscriber on android', () => {
    Platform.OS = 'android';
    renderHook(() => useNativeRenderCompletionEvents({stateController}));
    expect(NativeEventEmitter).toHaveBeenCalledTimes(1);
    expect(NativeEventEmitter).toHaveBeenCalledWith(undefined);
    expect(eventEmitterNativeModuleGetter).not.toHaveBeenCalled();
  });

  it('does not need native RenderCompletionEventEmitter module if state controller is disabled', () => {
    stateController.isEnabled = false;
    renderHook(() => useNativeRenderCompletionEvents({stateController}));
    expect(NativeEventEmitter).not.toHaveBeenCalled();
    expect(eventEmitterNativeModuleGetter).not.toHaveBeenCalled();
  });
});
