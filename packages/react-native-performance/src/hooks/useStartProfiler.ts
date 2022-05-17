import {useCallback} from 'react';

import GestureResponderEvent from '../GestureResponderEvent';
import {useStateController} from '../state-machine';

interface CommonArgs {
  source?: string;
  uiEvent?: GestureResponderEvent;
  renderTimeoutMillisOverride?: number;
}

export interface FlowStartArgs extends CommonArgs {
  destination?: never;
  reset?: false;
}

export interface FlowResetArgs extends CommonArgs {
  destination: string;
  reset: true;
}

export type StartTimerArgs = FlowStartArgs | FlowResetArgs;

const useStartProfiler = () => {
  const stateController = useStateController();

  const startTimer = useCallback(
    (args: StartTimerArgs) => {
      if (args.reset) {
        stateController.onFlowReset({
          sourceScreen: args.source,
          destinationScreen: args.destination,
          uiEvent: args.uiEvent,
          renderTimeoutMillisOverride: args.renderTimeoutMillisOverride,
        });
      } else {
        stateController.onNavigationStarted({
          sourceScreen: args.source,
          uiEvent: args.uiEvent,
          renderTimeoutMillisOverride: args.renderTimeoutMillisOverride,
        });
      }
    },
    [stateController],
  );

  return startTimer;
};

export default useStartProfiler;
