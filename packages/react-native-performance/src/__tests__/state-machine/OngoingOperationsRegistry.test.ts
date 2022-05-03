import OngoingOperationsRegistry, {
  OperationNotStartedError,
} from "../../state-machine/OngoingOperationsRegistry";

describe("state-machine/OngoingOperationsRegistry", () => {
  let state: OngoingOperationsRegistry;

  beforeEach(() => {
    state = new OngoingOperationsRegistry();
    jest.spyOn(Date, "now").mockReturnValueOnce(1000);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("registers a new operation when onOperationStarted is called", () => {
    expect(state.operationTimestamps).toEqual({});
    state = state.onOperationStarted("some_screen", "Query1");
    expect(state.operationTimestamps).toEqual({
      Query1: { startTimestamp: 1000 },
    });
  });

  it("allows multiple parallel ongoing operations while onOperationStarted", () => {
    expect(state.operationTimestamps).toEqual({});
    state = state.onOperationStarted("some_screen", "Query1");

    jest.spyOn(Date, "now").mockReturnValueOnce(2000);
    state = state.onOperationStarted("some_screen", "Query2");
    expect(state.operationTimestamps).toEqual({
      Query1: { startTimestamp: 1000 },
      Query2: { startTimestamp: 2000 },
    });
  });

  it("completes an existing operation onOperationCompleted is called", () => {
    state = state.onOperationStarted("some_screen", "Query1");
    Date.now = jest.fn().mockReturnValueOnce(2000);
    state = state.onOperationCompleted("some_screen", "Query1");
    expect(state.operationTimestamps).toEqual({
      Query1: { startTimestamp: 1000, endTimestamp: 2000, cancelled: false },
    });
  });

  it("allows out-of-order completion of operations", () => {
    state = state.onOperationStarted("some_screen", "Query1");

    Date.now = jest.fn().mockReturnValueOnce(2000);
    state = state.onOperationStarted("some_screen", "Query2");

    Date.now = jest.fn().mockReturnValueOnce(3000);
    state = state.onOperationCompleted("some_screen", "Query2");

    Date.now = jest.fn().mockReturnValueOnce(4000);
    state = state.onOperationCompleted("some_screen", "Query1");

    expect(state.operationTimestamps).toEqual({
      Query1: { startTimestamp: 1000, endTimestamp: 4000, cancelled: false },
      Query2: { startTimestamp: 2000, endTimestamp: 3000, cancelled: false },
    });
  });

  it("throws an error if an unknown operation is completed", () => {
    expect(() =>
      state.onOperationCompleted("some_screen", "Query1")
    ).toThrowError(OperationNotStartedError);
  });

  it("marks an operation as cancelled if onOperationCompleted is called with the correct props", () => {
    state = state.onOperationStarted("some_screen", "Query1");
    Date.now = jest.fn().mockReturnValueOnce(2000);
    state = state.onOperationCompleted("some_screen", "Query1", true);
    expect(state.operationTimestamps).toEqual({
      Query1: { startTimestamp: 1000, endTimestamp: 2000, cancelled: true },
    });
  });

  it("cancelling an operation send an abort signal to the abort controller", () => {
    const abortController = new AbortController();
    state = state.onOperationStarted("some_screen", "Query1", abortController);
    expect(abortController.signal.aborted).toBe(false);

    Date.now = jest.fn().mockReturnValueOnce(2000);
    state = state.onOperationCompleted("some_screen", "Query1", true);

    expect(state.operationTimestamps).toEqual({
      Query1: { startTimestamp: 1000, endTimestamp: 2000, cancelled: true },
    });
    expect(abortController.signal.aborted).toBe(true);
  });

  it("aborts all ongoing operations when onAllOngoingOperationsCancelled is called", () => {
    const abortController1 = new AbortController();
    const abortController2 = new AbortController();
    const abortController3 = new AbortController();

    state = state.onOperationStarted("some_screen", "Query1", abortController1);
    Date.now = jest.fn().mockReturnValueOnce(1200);
    state = state.onOperationStarted("some_screen", "Query2", abortController2);
    Date.now = jest.fn().mockReturnValueOnce(1400);
    state = state.onOperationStarted("some_screen", "Query3", abortController3);

    expect(abortController1.signal.aborted).toBe(false);
    expect(abortController2.signal.aborted).toBe(false);
    expect(abortController3.signal.aborted).toBe(false);

    Date.now = jest.fn().mockReturnValueOnce(2000);
    state = state.onOperationCompleted("some_screen", "Query1", false);

    expect(state.operationTimestamps).toEqual({
      Query1: { startTimestamp: 1000, endTimestamp: 2000, cancelled: false },
      Query2: { startTimestamp: 1200 },
      Query3: { startTimestamp: 1400 },
    });

    expect(abortController1.signal.aborted).toBe(false);
    expect(abortController2.signal.aborted).toBe(false);
    expect(abortController3.signal.aborted).toBe(false);

    Date.now = jest.fn().mockReturnValueOnce(2400);
    state = state.onAllOngoingOperationsCancelled("some_screen");

    expect(state.operationTimestamps).toEqual({
      Query1: { startTimestamp: 1000, endTimestamp: 2000, cancelled: false },
      Query2: { startTimestamp: 1200, endTimestamp: 2400, cancelled: true },
      Query3: { startTimestamp: 1400, endTimestamp: 2400, cancelled: true },
    });

    expect(abortController1.signal.aborted).toBe(false);
    expect(abortController2.signal.aborted).toBe(true);
    expect(abortController3.signal.aborted).toBe(true);
  });
});
