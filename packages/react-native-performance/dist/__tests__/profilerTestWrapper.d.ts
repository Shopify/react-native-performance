import React from 'react';
import { StateController } from '../state-machine';
import { ErrorHandler } from '../utils';
export default function profilerTestWrapper(stateController?: StateController, errorHandler?: ErrorHandler): {
    wrapper: ({ children }: {
        children: React.ReactElement;
    }) => JSX.Element;
    stateController: StateController;
    errorHandler: ErrorHandler;
};
//# sourceMappingURL=profilerTestWrapper.d.ts.map