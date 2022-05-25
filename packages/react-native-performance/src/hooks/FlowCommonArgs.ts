import GestureResponderEvent from '../GestureResponderEvent';

export interface FlowCommonArgs {
  source?: string;
  uiEvent?: GestureResponderEvent;
  renderTimeoutMillisOverride?: number;
}
