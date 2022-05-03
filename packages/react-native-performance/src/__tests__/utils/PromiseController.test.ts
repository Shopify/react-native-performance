import { act } from "@testing-library/react-native";

import PromiseController from "../../utils/PromiseController";

describe("utils/PromiseController", () => {
  const resultFn = jest.fn();
  const errorFn = jest.fn();
  let controller: PromiseController<number>;

  beforeEach(() => {
    jest.resetAllMocks();
    controller = new PromiseController();
    controller.promise.then(resultFn).catch(errorFn);
  });

  it("resolves the promise when asked", async () => {
    expect(resultFn).not.toHaveBeenCalled();
    expect(errorFn).not.toHaveBeenCalled();

    controller.resolve(10);

    await act(async () => {});

    expect(resultFn).toHaveBeenCalledTimes(1);
    expect(resultFn).toHaveBeenCalledWith(10);
    expect(errorFn).not.toHaveBeenCalled();
  });

  it("rejects the promise when asked", async () => {
    expect(resultFn).not.toHaveBeenCalled();
    expect(errorFn).not.toHaveBeenCalled();

    const actualError = new Error("some error");
    controller.reject(actualError);

    await act(async () => {});

    expect(resultFn).not.toHaveBeenCalled();
    expect(errorFn).toHaveBeenCalledTimes(1);
    expect(errorFn).toHaveBeenCalledWith(actualError);
  });

  it("remembers the resolution result", () => {
    expect(controller.rejectionReason).toBeUndefined();
    expect(controller.result).toBeUndefined();

    controller.resolve(10);

    expect(controller.rejectionReason).toBeUndefined();
    expect(controller.result).toBe(10);
  });

  it("remembers the rejection reason", () => {
    expect(controller.rejectionReason).toBeUndefined();
    expect(controller.result).toBeUndefined();

    const actualError = new Error("some error");
    controller.reject(actualError);

    expect(controller.rejectionReason).toBe(actualError);
    expect(controller.result).toBeUndefined();
  });

  it("marks the promise as completed after reject", () => {
    expect(controller.hasCompleted).toBe(false);
    controller.reject(new Error("some error"));
    expect(controller.hasCompleted).toBe(true);
  });

  it("marks the promise as completed after resolve", () => {
    expect(controller.hasCompleted).toBe(false);
    controller.resolve(10);
    expect(controller.hasCompleted).toBe(true);
  });

  it("marks the promise as a completed after resolving with an undefined value", () => {
    const controller = new PromiseController<void>();
    controller.promise.then(resultFn).catch(errorFn);

    expect(controller.hasCompleted).toBe(false);
    controller.resolve();
    expect(controller.hasCompleted).toBe(true);
  });
});
