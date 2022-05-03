import React from "react";
import { renderHook } from "@testing-library/react-hooks";

import { PerformanceProfilerUninitializedError } from "../../../exceptions";
import {
  DisabledStateController,
  StateControllerContextProvider,
  useStateController,
} from "../../../state-machine";
import { ErrorHandler, ErrorHandlerContextProvider } from "../../../utils";

describe("state-machine/controller/state-controller-context", () => {
  describe("useStateController", () => {
    it("provides the state controller instance available throught the context", () => {
      const mockStateController = {
        onSomeEvent: jest.fn(),
      } as any;

      const actualStateController = renderHook(() => useStateController(), {
        wrapper: function wrapper({ children }) {
          return (
            <StateControllerContextProvider value={mockStateController}>
              {children}
            </StateControllerContextProvider>
          );
        },
      }).result.current;

      expect(actualStateController).toBe(mockStateController);
    });

    it("provides the fallback disabled state controller if none is available via the context", () => {
      const actualStateController = renderHook(() => useStateController(), {
        wrapper: function wrapper({ children }) {
          return (
            <ErrorHandlerContextProvider value={jest.fn()}>
              {children}
            </ErrorHandlerContextProvider>
          );
        },
      }).result.current;
      expect(actualStateController).toBeInstanceOf(DisabledStateController);
    });

    it("reports a missing controller in the context to the error handler", () => {
      const errorHandler: ErrorHandler = jest.fn();
      renderHook(() => useStateController(), {
        wrapper: function wrapper({ children }) {
          return (
            <ErrorHandlerContextProvider value={errorHandler}>
              {children}
            </ErrorHandlerContextProvider>
          );
        },
      });
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler).toHaveBeenCalledWith(
        expect.any(PerformanceProfilerUninitializedError)
      );
    });
  });
});
