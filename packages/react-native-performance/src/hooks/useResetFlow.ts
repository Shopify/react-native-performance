import {useCallback} from 'react';

import {useStateController} from '../state-machine';

import {CommonArgs} from './FlowCommonArgs';

export interface FlowResetArgs extends CommonArgs {
  destination: string;
  componentInstanceId: string;
}

const useResetFlow = () => {
  const stateController = useStateController();

  const startTimer = useCallback(
    (args: FlowResetArgs) => {
      stateController.onFlowReset({
        sourceScreen: args.source,
        destinationScreen: args.destination,
        uiEvent: args.uiEvent,
        renderTimeoutMillisOverride: args.renderTimeoutMillisOverride,
      });
    },
    [stateController],
  );

  return startTimer;
};

export default useResetFlow;
