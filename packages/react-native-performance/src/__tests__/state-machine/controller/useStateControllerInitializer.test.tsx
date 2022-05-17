import {renderHook} from '@testing-library/react-hooks';

import {
  useStateControllerInitializer,
  StateController,
  EnabledStateController,
  DisabledStateController,
  ErrorHandlerStateController,
  OnStateChangedListener,
} from '../../../state-machine';
import {ErrorHandler} from '../../../utils';

jest.mock('../../../state-machine/controller/EnabledStateController', () => {
  const MockStateController = jest.requireActual('../../MockStateController').default;
  class MockEnabledStateController extends MockStateController {
    isEnabled = true;
  }
  return MockEnabledStateController;
});

jest.mock('../../../state-machine/controller/DisabledStateController', () => {
  const MockStateController = jest.requireActual('../../MockStateController').default;
  class MockDisabledStateController extends MockStateController {}
  return MockDisabledStateController;
});

jest.mock('../../../state-machine/controller/ErrorHandlerStateController', () => {
  const MockStateController = jest.requireActual('../../MockStateController').default;
  class MockErrorHandlerStateController extends MockStateController {
    readonly innerStateController: StateController;
    readonly errorHandler: ErrorHandler;

    get isEnabled() {
      return this.innerStateController.isEnabled;
    }

    constructor(innerStateController: StateController, errorHandler: ErrorHandler) {
      super();
      this.innerStateController = innerStateController;
      this.errorHandler = errorHandler;
    }
  }

  return MockErrorHandlerStateController;
});

describe('state-machine/controller/useStateControllerInitializer', () => {
  let errorHandler: ErrorHandler;
  let reportEmitter: OnStateChangedListener;

  beforeEach(() => {
    errorHandler = jest.fn();
    reportEmitter = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('initializes the state controller with the correct values when the profiler is enabled', () => {
    const stateController = renderHook(() =>
      useStateControllerInitializer({
        enabled: true,
        errorHandler,
        reportEmitter,
        useRenderTimeouts: true,
        renderTimeoutMillis: 100,
      }),
    ).result.current;

    expect(stateController).toBeInstanceOf(ErrorHandlerStateController);
    expect((stateController as ErrorHandlerStateController).errorHandler).toBe(errorHandler);

    const {innerStateController} = stateController as ErrorHandlerStateController;
    expect(innerStateController).toBeInstanceOf(EnabledStateController);

    expect(stateController.onAppStarted).toHaveBeenCalledTimes(1);
    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController.configureRenderTimeout).toHaveBeenCalledTimes(1);

    expect(stateController.addStateChangedListener).toHaveBeenCalledWith(reportEmitter);
    expect(stateController.configureRenderTimeout).toHaveBeenCalledWith({
      enabled: true,
      onRenderTimeout: errorHandler,
      renderTimeoutMillis: 100,
    });
  });

  it('initializes the state controller with the correct values when the profiler is disabled', () => {
    const stateController = renderHook(() =>
      useStateControllerInitializer({
        enabled: false,
        errorHandler,
        reportEmitter,
        useRenderTimeouts: true,
        renderTimeoutMillis: 100,
      }),
    ).result.current;

    expect(stateController).toBeInstanceOf(ErrorHandlerStateController);
    expect((stateController as ErrorHandlerStateController).errorHandler).toBe(errorHandler);
    const {innerStateController} = stateController as ErrorHandlerStateController;
    expect(innerStateController).toBeInstanceOf(DisabledStateController);

    expect(stateController.onAppStarted).toHaveBeenCalledTimes(1);
    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController.configureRenderTimeout).toHaveBeenCalledTimes(1);

    expect(stateController.addStateChangedListener).toHaveBeenCalledWith(reportEmitter);
    expect(stateController.configureRenderTimeout).toHaveBeenCalledWith({
      enabled: true,
      onRenderTimeout: errorHandler,
      renderTimeoutMillis: 100,
    });
  });

  it('does not set a render timeout when asked not to', () => {
    const stateController = renderHook(() =>
      useStateControllerInitializer({
        enabled: true,
        errorHandler,
        reportEmitter,
        useRenderTimeouts: false,
        renderTimeoutMillis: 100,
      }),
    ).result.current as ErrorHandlerStateController;

    expect(stateController.configureRenderTimeout).toHaveBeenCalledTimes(1);

    expect(stateController.configureRenderTimeout).toHaveBeenCalledWith({
      enabled: false,
    });
  });

  it('does not create a new instance of the state controller if the hook is re-rendered without prop changes', () => {
    const hookRenderResult = renderHook(() =>
      useStateControllerInitializer({
        enabled: true,
        errorHandler,
        reportEmitter,
        useRenderTimeouts: true,
        renderTimeoutMillis: 100,
      }),
    );

    hookRenderResult.rerender(() =>
      useStateControllerInitializer({
        enabled: true,
        errorHandler,
        reportEmitter,
        useRenderTimeouts: true,
        renderTimeoutMillis: 100,
      }),
    );

    expect(hookRenderResult.result.all[1]).not.toBeUndefined();
    expect(hookRenderResult.result.all[1]).toBe(hookRenderResult.result.all[0]);
  });

  it('hot-swaps the active state controller if the enabled state changes', () => {
    let props = {
      enabled: false,
      errorHandler,
      reportEmitter,
      useRenderTimeouts: true,
      renderTimeoutMillis: 100,
    };
    const hookRenderResult = renderHook(() => useStateControllerInitializer(props));

    props = {
      enabled: true,
      errorHandler,
      reportEmitter,
      useRenderTimeouts: true,
      renderTimeoutMillis: 100,
    };

    hookRenderResult.rerender();

    const [stateController1, stateController2] = hookRenderResult.result.all as ErrorHandlerStateController[];

    expect(stateController1.innerStateController).toBeInstanceOf(DisabledStateController);
    expect(stateController2.innerStateController).toBeInstanceOf(EnabledStateController);

    // creates a new instance
    expect(stateController2).not.toBe(stateController1);

    // cleans up the old instance
    expect(stateController1.removeStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController1.configureRenderTimeout).toHaveBeenCalledTimes(2);

    expect(stateController1.removeStateChangedListener).toHaveBeenCalledWith(reportEmitter);
    expect(stateController1.configureRenderTimeout).toHaveBeenLastCalledWith({
      enabled: false,
    });

    // initializes the new instance
    expect(stateController2.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController2.configureRenderTimeout).toHaveBeenCalledTimes(1);

    expect(stateController2.addStateChangedListener).toHaveBeenCalledWith(reportEmitter);
    expect(stateController2.configureRenderTimeout).toHaveBeenLastCalledWith({
      enabled: true,
      onRenderTimeout: errorHandler,
      renderTimeoutMillis: 100,
    });

    // does not notify the new instance of the app started event again
    expect(stateController2.onAppStarted).not.toHaveBeenCalled();
  });

  it('updates the configuration of the active state controller if requested', () => {
    const errorHandler2: ErrorHandler = jest.fn();
    const reportEmitter2: OnStateChangedListener = jest.fn();

    let props = {
      enabled: true,
      errorHandler,
      reportEmitter,
      useRenderTimeouts: true,
      renderTimeoutMillis: 100,
    };
    const hookRenderResult = renderHook(() => useStateControllerInitializer(props));

    props = {
      enabled: true,
      errorHandler: errorHandler2,
      reportEmitter: reportEmitter2,
      useRenderTimeouts: true,
      renderTimeoutMillis: 1000,
    };
    hookRenderResult.rerender();

    const [stateController1, stateController2] = hookRenderResult.result.all as ErrorHandlerStateController[];

    // Swaps the ErrorHandlerStateController instance, since the errorHandler changed
    expect(stateController2).not.toBe(stateController1);
    expect(stateController1.errorHandler).toBe(errorHandler);
    expect(stateController2.errorHandler).toBe(errorHandler2);
    expect(stateController1.innerStateController === stateController2.innerStateController).toBe(true);

    // Swaps out the config properties
    expect(stateController1.removeStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController1.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController2.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController1.configureRenderTimeout).toHaveBeenCalledTimes(2);
    expect(stateController2.configureRenderTimeout).toHaveBeenCalledTimes(1);

    expect(stateController1.removeStateChangedListener).toHaveBeenCalledWith(reportEmitter);
    expect(stateController2.addStateChangedListener).toHaveBeenCalledWith(reportEmitter2);

    expect(stateController1.configureRenderTimeout).toHaveBeenNthCalledWith(2, {
      enabled: false,
    });
    expect(stateController2.configureRenderTimeout).toHaveBeenCalledWith({
      enabled: true,
      onRenderTimeout: errorHandler2,
      renderTimeoutMillis: 1000,
    });
  });

  it('cleans up the controller when the hook unmounts', () => {
    const hookRenderResult = renderHook(() =>
      useStateControllerInitializer({
        enabled: true,
        errorHandler,
        reportEmitter,
        useRenderTimeouts: true,
        renderTimeoutMillis: 100,
      }),
    );

    const stateController = hookRenderResult.result.all[0] as StateController;
    hookRenderResult.unmount();

    expect(stateController.removeStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController.configureRenderTimeout).toHaveBeenCalledTimes(2);

    expect(stateController.removeStateChangedListener).toHaveBeenCalledWith(reportEmitter);
    expect(stateController.configureRenderTimeout).toHaveBeenNthCalledWith(2, {
      enabled: false,
    });
  });
});
