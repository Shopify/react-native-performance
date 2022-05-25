import {useCallback} from 'react';

import {useStateController} from '../state-machine';

import {FlowCommonArgs} from './FlowCommonArgs';

const useStartProfiler = () => {
  const stateController = useStateController();

  const startTimer = useCallback(
    (args: FlowCommonArgs) => {
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
