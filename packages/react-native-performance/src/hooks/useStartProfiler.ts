import {useCallback} from 'react';

import {useStateController} from '../state-machine';

import {FlowCommonArgs} from './FlowCommonArgs';

export interface FlowStartArgs extends FlowCommonArgs {
  destination?: never;
  componentInstanceId?: never;
}

const useStartProfiler = () => {
  const stateController = useStateController();

  const startTimer = useCallback(
    (args: FlowStartArgs) => {
      stateController.onNavigationStarted({
        sourceScreen: args.source,
        uiEvent: args.uiEvent,
        renderTimeoutMillisOverride: args.renderTimeoutMillisOverride,
      });
    },
    [stateController],
  );

  return startTimer;
};

export default useStartProfiler;
