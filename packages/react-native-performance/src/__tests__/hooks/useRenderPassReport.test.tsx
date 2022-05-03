/* eslint-disable @typescript-eslint/ban-ts-comment */
import { renderHook, WrapperComponent } from "@testing-library/react-hooks";
import { act } from "@testing-library/react-native";

import useRenderPassReport from "../../hooks/useRenderPassReport";
import renderPassReportGenerator from "../../RenderPassReportGenerator";
import { StateController } from "../../state-machine";
import profilerTestWrapper from "../profilerTestWrapper";

jest.mock("../../RenderPassReportGenerator", () => {
  const renderPassReportGenerator = jest.fn();
  return renderPassReportGenerator;
});

describe("useRenderPassReport", () => {
  let stateController: StateController;
  let wrapper: WrapperComponent<any>;

  beforeEach(() => {
    // @ts-ignore
    renderPassReportGenerator.mockReturnValue(Promise.resolve(null));
    ({ wrapper, stateController } = profilerTestWrapper());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("subscribes to changes from the state controller", () => {
    expect(stateController.addStateChangedListener).not.toHaveBeenCalled();

    renderHook(
      () =>
        useRenderPassReport({
          destinationScreen: "foo",
        }),
      { wrapper }
    );

    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
  });

  it("ignores state changes from screens that the user does not care about", () => {
    const report = renderHook(
      () =>
        useRenderPassReport({
          destinationScreen: "foo",
        }),
      { wrapper }
    ).result.current;

    // @ts-ignore
    stateController.addStateChangedListener.mock.calls[0][0](
      "bar",
      { name: "old state" },
      { name: "new state" }
    );
    expect(renderPassReportGenerator).not.toHaveBeenCalled();
    expect(report).toBeUndefined();
  });

  it("passes the state changes to the renderPassReportGenerator", () => {
    const report = renderHook(
      () =>
        useRenderPassReport({
          destinationScreen: new RegExp("^f[o]+$"),
        }),
      { wrapper }
    ).result.current;

    const stateChangeArgs = [
      "fooooo",
      { name: "old state" },
      { name: "new state" },
    ];
    expect(renderPassReportGenerator).not.toHaveBeenCalled();
    // @ts-ignore
    stateController.addStateChangedListener.mock.calls[0][0](
      ...stateChangeArgs
    );
    expect(renderPassReportGenerator).toHaveBeenCalledTimes(1);
    expect(renderPassReportGenerator).toHaveBeenCalledWith(stateChangeArgs[2]);
    expect(report).toBeUndefined();
  });

  it("updates the output result if renderPassReportGenerator prepares a report", async () => {
    const mockReport = { tti: 10 };
    // @ts-ignore
    renderPassReportGenerator.mockReturnValue(Promise.resolve(mockReport));

    const renderHookResult = renderHook(
      () =>
        useRenderPassReport({
          destinationScreen: "foo",
        }),
      { wrapper }
    );

    const stateChangeArgs = [
      "foo",
      { name: "old state" },
      { name: "new state" },
    ];
    await act(async () => {
      // @ts-ignore
      stateController.addStateChangedListener.mock.calls[0][0](
        ...stateChangeArgs
      );
      // Flush the report preparation promise
      await new Promise((resolve) => setImmediate(resolve));
    });

    expect(renderHookResult.result.current).toBe(mockReport);
  });

  it("does not unsubscribe and re-subscribe if the hook is re-rendered with a regex destinationScreen", () => {
    expect(stateController.addStateChangedListener).not.toHaveBeenCalled();

    const renderHookResult = renderHook(
      () =>
        useRenderPassReport({
          destinationScreen: new RegExp(".*"),
        }),
      { wrapper }
    );

    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();

    renderHookResult.rerender();

    expect(stateController.addStateChangedListener).toHaveBeenCalledTimes(1);
    expect(stateController.removeStateChangedListener).not.toHaveBeenCalled();
  });
});
