import React, { useContext, useRef } from "react";

import { useErrorHandler } from "../../utils";
import { PerformanceProfilerUninitializedError } from "../../exceptions";

import StateController from "./StateController";
import DisabledStateController from "./DisabledStateController";

const StateControllerContext = React.createContext<StateController | undefined>(
  undefined
);

export const StateControllerContextProvider = StateControllerContext.Provider;

export const useStateController = ({
  destinationScreen,
}: { destinationScreen?: string } = {}): StateController => {
  const stateController = useContext(StateControllerContext);
  const errorHandler = useErrorHandler();
  const fallbackStateController = useRef(new DisabledStateController());

  if (stateController === undefined) {
    errorHandler(new PerformanceProfilerUninitializedError(destinationScreen));
    return fallbackStateController.current;
  }

  return stateController;
};
