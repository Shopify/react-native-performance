import {useCallback} from 'react';

import {useStateController} from '../state-machine';

import {CommonArgs} from './FlowCommonArgs';

export interface FlowResetArgs extends CommonArgs {
  destination: string;
  componentInstanceId: string;
}

const useResetFlow = () => {
  const stateController = useStateController();

  const resetTimer = useCallback(
    (args: FlowResetArgs) => {
      stateController.onFlowReset({
        sourceScreen: args.source,
        destinationScreen: args.destination,
        uiEvent: args.uiEvent,
        renderTimeoutMillisOverride: args.renderTimeoutMillisOverride,
        componentInstanceId: args.componentInstanceId,
      });
    },
    [stateController],
  );

  return resetTimer;
};

export default useResetFlow;
