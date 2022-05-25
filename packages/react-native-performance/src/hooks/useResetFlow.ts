import {useCallback} from 'react';

import {useStateController} from '../state-machine';

import {FlowCommonArgs} from './FlowCommonArgs';
import useComponentInstanceId from './useComponentInstanceId';

export interface FlowResetArgs extends FlowCommonArgs {
  destination: string;
}

const useResetFlow = () => {
  const stateController = useStateController();
  const componentInstanceId = useComponentInstanceId();

  const resetFlow = useCallback(
    (args: FlowResetArgs) => {
      stateController.onFlowReset({
        sourceScreen: args.source,
        destinationScreen: args.destination,
        uiEvent: args.uiEvent,
        renderTimeoutMillisOverride: args.renderTimeoutMillisOverride,
        componentInstanceId,
      });
    },
    [stateController, componentInstanceId],
  );

  return {resetFlow, componentInstanceId};
};

export default useResetFlow;
