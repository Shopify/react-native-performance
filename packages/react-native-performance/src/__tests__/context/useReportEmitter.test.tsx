/* eslint-disable @typescript-eslint/ban-ts-comment */
import { act } from "@testing-library/react-native";
import { renderHook } from "@testing-library/react-hooks";

import ReportObserver from "../../context/ReportObserver";
import useReportEmitter from "../../context/useReportEmitter";
import renderPassReportGenerator, {
  RenderPassReportGeneratorType,
} from "../../RenderPassReportGenerator";
import { OnStateChangedListener } from "../../state-machine";
import { ErrorHandler } from "../../utils";
import logger, { LogLevel } from "../../utils/Logger";

jest.mock("../../RenderPassReportGenerator", () => {
  const mockGenerator: RenderPassReportGeneratorType = jest.fn();
  return mockGenerator;
});

jest.mock("../../utils/Logger", () => {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    LogLevel: {
      Debug: 0,
      Info: 1,
      Warn: 2,
      Error: 3,
    },
  };
});

describe("context/useReportEmitter", () => {
  let onReportPrepared: ReportObserver;
  let errorHandler: ErrorHandler;
  let reportEmitter: OnStateChangedListener;

  beforeEach(() => {
    logger.logLevel = LogLevel.Info;
    onReportPrepared = jest.fn();
    errorHandler = jest.fn();
    reportEmitter = renderHook(() =>
      useReportEmitter({ onReportPrepared, errorHandler })
    ).result.current;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("reports the RenderPassReport if renderPassReportGenerator generates one", async () => {
    const mockReport = { key: "value" } as any;
    // @ts-ignore
    renderPassReportGenerator.mockReturnValueOnce(Promise.resolve(mockReport));

    reportEmitter("screen", undefined, { key: "some_state" } as any);

    await act(() => Promise.resolve());

    expect(onReportPrepared).toHaveBeenCalledTimes(1);
    expect(onReportPrepared).toHaveBeenCalledWith(mockReport);
    expect(logger.info).toHaveBeenCalledTimes(1);
    expect(logger.info).toHaveBeenCalledWith(
      `Render Pass Report: ${JSON.stringify(mockReport, undefined, 2)}`
    );
  });

  it("does not log RenderPassReport if logger level is not Info", async () => {
    logger.logLevel = LogLevel.Warn;
    const mockReport = { key: "value" } as any;
    // @ts-ignore
    renderPassReportGenerator.mockReturnValueOnce(Promise.resolve(mockReport));

    reportEmitter("screen", undefined, { key: "some_state" } as any);

    await act(() => Promise.resolve());

    expect(onReportPrepared).toHaveBeenCalledTimes(1);
    expect(onReportPrepared).toHaveBeenCalledWith(mockReport);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("does not report anything to onReportPrepared if renderPassReportGenerator does not generate a report", async () => {
    // @ts-ignore
    renderPassReportGenerator.mockReturnValueOnce(Promise.resolve(null));

    reportEmitter("screen", undefined, { key: "some_state" } as any);

    await act(() => Promise.resolve());

    expect(onReportPrepared).not.toHaveBeenCalled();
    expect(logger.info).not.toHaveBeenCalled();
  });
});
