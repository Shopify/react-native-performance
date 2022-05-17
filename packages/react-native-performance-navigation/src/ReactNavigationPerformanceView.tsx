import React, {useEffect, useState, useRef, useCallback} from 'react';
import type {ComponentProps} from 'react';
import {PerformanceMeasureView, inMemoryCounter, useStateController} from '@shopify/react-native-performance';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/core';
import type {ParamListBase} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';

const TRANSITION_END = 'transition-end';

export type Props = ComponentProps<typeof PerformanceMeasureView>;

/**
 * Performance view similar to `PerformanceMeasureView` but meant to be used with `react-navigation`.
 * If the screen is not mounted in a react-navigation context, it might misbehave and is therefore not recommended.
 */
export const ReactNavigationPerformanceView = (props: Props) => {
  const {addListener, getState} = useNavigation<StackNavigationProp<ParamListBase>>();
  // Stack is the only navigation type that has a `transitionEnd` event.
  const isStack = getState().type === 'stack';

  const [transitionEnded, setTransitionEnded] = useState(!isStack);
  // We only want to report `TRANSITION_END` render pass once.
  const transitionEndReported = useRef(false);

  const componentInstanceId = useRef(inMemoryCounter()).current;
  const stateController = useStateController();

  useFocusEffect(
    useCallback(() => {
      stateController.stopFlowIfNeeded(componentInstanceId);
    }, [stateController, componentInstanceId]),
  );

  useEffect(() => {
    if (!isStack) {
      return;
    }
    return addListener('transitionEnd', () => {
      setTransitionEnded(true);
    });
  }, [addListener, isStack]);

  let shouldReportTransitionEnd = false;
  if (isStack && transitionEnded && transitionEndReported.current === false) {
    shouldReportTransitionEnd = true;
    transitionEndReported.current = true;
  }

  // View can be interactive only when the present animation has completed (marked by `transitionEnd` event).
  // However, we wait for `transitionEnd` event only in case when we are in a context of a stack navigator as otherwise `transitionEnd` never occurs.
  const interactive = props.interactive === true && transitionEnded;

  /**
   * Represents previous renderPassName passed via `props`.
   * Does not include `TRANSITION_END` event.
   */
  const lastRenderPassName = useRef<string | undefined>(undefined);
  const renderProps = useRef({
    renderPassName: props.renderPassName,
    interactive,
  });

  // If a user has not changed the `renderPassName`, we keep `TRANSITION_END` as the current one.
  // This is to avoid emitting reports of render passes where user has not explicitly changed it.
  // `PerformanceMeasureView` will log a reused `renderPassName`
  // and subsequent render passes with a different `renderPassName` will still be reported.
  // Check out this link for more details: https://github.com/Shopify/react-native-performance/pull/363
  if (shouldReportTransitionEnd) {
    renderProps.current = {renderPassName: TRANSITION_END, interactive};
  } else if (lastRenderPassName.current !== props.renderPassName) {
    renderProps.current = {renderPassName: props.renderPassName, interactive};
  }
  lastRenderPassName.current = props.renderPassName;

  return (
    <PerformanceMeasureView
      {...props}
      componentInstanceId={componentInstanceId}
      renderPassName={renderProps.current.renderPassName}
      interactive={renderProps.current.interactive}
    />
  );
};
