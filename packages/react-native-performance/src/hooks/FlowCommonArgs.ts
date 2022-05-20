import GestureResponderEvent from '../GestureResponderEvent';

export interface CommonArgs {
  source?: string;
  uiEvent?: GestureResponderEvent;
  renderTimeoutMillisOverride?: number;
}
