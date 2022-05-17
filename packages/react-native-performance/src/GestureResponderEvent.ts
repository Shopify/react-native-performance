interface GestureResponderEvent {
  nativeEvent: {
    timestamp: number;
  };
}

export function isGestureResponderEvent(obj: any): obj is GestureResponderEvent {
  return typeof obj?.nativeEvent?.timestamp === 'number';
}

export default GestureResponderEvent;
