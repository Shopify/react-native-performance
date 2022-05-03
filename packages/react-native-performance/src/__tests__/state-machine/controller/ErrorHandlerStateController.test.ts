import ErrorHandlerStateController from "../../../state-machine/controller/ErrorHandlerStateController";
import { ErrorHandler } from "../../../utils";
import MockStateController from "../../MockStateController";

describe("state-machine/controller/ErrorHandlerStateController", () => {
  let innerStateController: MockStateController;
  let errorHandler: jest.MockedFunction<ErrorHandler>;
  let stateController: ErrorHandlerStateController;

  beforeEach(() => {
    innerStateController = new MockStateController();
    errorHandler = jest.fn();
    stateController = new ErrorHandlerStateController(
      innerStateController,
      errorHandler
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("executes the inner state controller's APIs", () => {
    const args = { property: "value" };

    for (const functionName in stateController) {
      if (Object.prototype.hasOwnProperty.call(stateController, functionName)) {
        if (
          typeof (stateController as any)[functionName] === "function" &&
          typeof (innerStateController as any)[functionName] === "function"
        ) {
          const outerFn = (stateController as any)[functionName].bind(
            stateController
          );
          const innerFn = (innerStateController as any)[functionName].bind(
            innerStateController
          );

          expect(innerFn).not.toHaveBeenCalled();

          outerFn(args);

          expect(innerFn).toHaveBeenCalledTimes(1);
          expect(innerFn).toHaveBeenCalledWith(args);
        }
      }
    }
  });

  it("routes the errors through the error handler", () => {
    const args = { property: "value" };

    for (const functionName in stateController) {
      if (Object.prototype.hasOwnProperty.call(stateController, functionName)) {
        if (
          typeof (stateController as any)[functionName] === "function" &&
          typeof (innerStateController as any)[functionName] === "function"
        ) {
          const mockError = new Error("some error message");
          const outerFn = (stateController as any)[functionName].bind(
            stateController
          );
          const innerFn = (innerStateController as any)[functionName].bind(
            innerStateController
          );
          innerFn.mockImplementation(() => {
            throw mockError;
          });

          expect(errorHandler).not.toHaveBeenCalled();

          outerFn(args);

          expect(errorHandler).toHaveBeenCalledTimes(1);
          expect(errorHandler).toHaveBeenCalledWith(mockError);
          errorHandler.mockClear();
        }
      }
    }
  });
});
