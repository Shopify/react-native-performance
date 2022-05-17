import React from 'react';

import {StateController, StateControllerContextProvider} from '../state-machine';
import {ErrorHandler, ErrorHandlerContextProvider} from '../utils';

import MockStateController from './MockStateController';

export default function profilerTestWrapper(
  stateController: StateController = new MockStateController(),
  errorHandler: ErrorHandler = jest.fn(),
) {
  const wrapper = ({children}: {children: React.ReactElement}) => {
    return (
      <StateControllerContextProvider value={stateController}>
        <ErrorHandlerContextProvider value={errorHandler}>{children}</ErrorHandlerContextProvider>
      </StateControllerContextProvider>
    );
  };

  return {wrapper, stateController, errorHandler};
}
