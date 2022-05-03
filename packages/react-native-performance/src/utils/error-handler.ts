import React, { useContext } from "react";

export type ErrorHandler = (_: Error) => void;

const ErrorHandlerContext = React.createContext<ErrorHandler>(() => {});

export const ErrorHandlerContextProvider = ErrorHandlerContext.Provider;

export const useErrorHandler = (): ErrorHandler => {
  const errorHandler = useContext(ErrorHandlerContext);
  return errorHandler;
};
