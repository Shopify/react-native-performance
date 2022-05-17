import {useCallback, useEffect} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';

import {Interactive} from '../PerformanceMarker';
import {StateController} from '../state-machine';

export interface RenderCompletionEvent {
  timestamp: string;
  renderPassName: string;
  interactive: Interactive;
  destinationScreen: string;
  componentInstanceId: string;
}

export const RENDER_COMPLETION_EVENT_NAME = '@shopify/react-native-performance/onRenderComplete';

const useNativeRenderCompletionEvents = ({stateController}: {stateController: StateController}) => {
  const onRenderComplete = useCallback(
    ({timestamp, renderPassName, interactive, destinationScreen, componentInstanceId}: RenderCompletionEvent) => {
      stateController.onRenderPassCompleted({
        timestamp: Number.parseFloat(timestamp),
        destinationScreen,
        renderPassName,
        interactive: interactive === 'TRUE',
        componentInstanceId,
      });
    },
    [stateController],
  );

  useEffect(() => {
    if (stateController.isEnabled) {
      const eventEmitter = new NativeEventEmitter(
        Platform.OS === 'ios' ? NativeModules.RenderCompletionEventEmitter : undefined,
      );
      const subscription = eventEmitter.addListener(RENDER_COMPLETION_EVENT_NAME, onRenderComplete);
      return () => subscription.remove();
    }
  }, [stateController.isEnabled, onRenderComplete]);
};

export default useNativeRenderCompletionEvents;
