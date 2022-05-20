import {useCallback} from 'react';

import {useStateController} from '../state-machine';

import {CommonArgs} from './FlowCommonArgs';

export interface FlowStartArgs extends CommonArgs {
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
