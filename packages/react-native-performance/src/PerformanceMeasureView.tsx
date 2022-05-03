import React, { ReactNode, useEffect, useState, useRef } from "react";
import { InteractionManager, StyleSheet } from "react-native";

import { inMemoryCounter } from "./utils";
import { getPerformanceMarker } from "./PerformanceMarker";
import { StateController, useStateController } from "./state-machine";

export const DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME = "loading";
export const DEFAULT_INTERACTIVE_RENDER_PASS_NAME = "interactive";

const DEFAULT_INTERACTIVE = false;

interface BaseProps {
  screenName: string;
  children: ReactNode;
  componentInstanceId?: string | undefined;
}

export interface RenderStateProps {
  interactive?: boolean;
  renderPassName?: string;
}

type SlowRenderOptimizeProps =
  | {
      optimizeForSlowRenderComponents: true;
      slowRenderPlaceholder?: ReactNode;
    }
  | {
      optimizeForSlowRenderComponents?: false;
      slowRenderPlaceholder?: never;
    };

type PerformanceMeasureViewProps = BaseProps &
  RenderStateProps &
  SlowRenderOptimizeProps;

const normalizeRenderState = (
  props: RenderStateProps
): { interactive: boolean; renderPassName: string } => {
  const interactive = props.interactive ?? DEFAULT_INTERACTIVE;
  const renderPassName =
    props.renderPassName ??
    (interactive
      ? DEFAULT_INTERACTIVE_RENDER_PASS_NAME
      : DEFAULT_NON_INTERACTIVE_RENDER_PASS_NAME);

  return {
    interactive,
    renderPassName,
  };
};

const PerformanceMeasureView = ({
  screenName,
  children,
  optimizeForSlowRenderComponents = false,
  slowRenderPlaceholder,
  ...renderStateProps
}: PerformanceMeasureViewProps) => {
  const stateController = useStateController();

  const [show, setShow] = useState(!optimizeForSlowRenderComponents);

  const { interactive, renderPassName } =
    normalizeRenderState(renderStateProps);

  useEffect(() => {
    if (optimizeForSlowRenderComponents) {
      InteractionManager.runAfterInteractions(() => {
        setShow(true);
      });
    }
  }, [optimizeForSlowRenderComponents]);

  const componentInstanceId = useRef(
    renderStateProps.componentInstanceId ?? inMemoryCounter()
  ).current;
  useTrackComponentMounts({ stateController, screenName, componentInstanceId });

  if (stateController.isEnabled) {
    if (show) {
      const PerformanceMarker = getPerformanceMarker();
      return (
        <>
          <PerformanceMarker
            componentInstanceId={componentInstanceId}
            key={renderPassName}
            destinationScreen={screenName}
            interactive={interactive ? "TRUE" : "FALSE"}
            renderPassName={renderPassName}
            style={styles.invisible}
          />
          {children}
        </>
      );
    } else if (slowRenderPlaceholder) {
      return <>{slowRenderPlaceholder}</>;
    } else {
      return null;
    }
  } else {
    return <>{children}</>;
  }
};

const useTrackComponentMounts = ({
  stateController,
  screenName,
  componentInstanceId,
}: {
  stateController: StateController;
  screenName: string;
  componentInstanceId: string;
}) => {
  useEffect(() => {
    stateController.onScreenMounted({
      destinationScreen: screenName,
      componentInstanceId,
    });
    return () => {
      stateController.onScreenUnmounted({
        destinationScreen: screenName,
        componentInstanceId,
      });
    };
  }, [screenName, stateController, componentInstanceId]);
};

const styles = StyleSheet.create({
  invisible: {
    width: 0,
    height: 0,
  },
});

export default PerformanceMeasureView;
