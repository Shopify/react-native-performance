import { useCallback, useEffect } from "react";

import { useStateController, OnStateChangedListener } from "../state-machine";
import { State } from "../state-machine/states";
import { matchesPattern } from "../utils";

interface Props {
  destinationScreen?: RegExp | string;
  onStateChanged: (_: State) => void;
}

export default function useProfilerStateChangeListener({
  destinationScreen: destinationScreenToReportPattern = new RegExp("^.*$"),
  onStateChanged,
}: Props) {
  const destinationScreenSource =
    typeof destinationScreenToReportPattern === "string"
      ? destinationScreenToReportPattern
      : destinationScreenToReportPattern.source;

  const stateController = useStateController({
    destinationScreen: destinationScreenSource,
  });

  const onStateChangedListener: OnStateChangedListener = useCallback(
    (affectedScreen, _, newState) => {
      if (matchesPattern(affectedScreen, destinationScreenToReportPattern)) {
        onStateChanged(newState);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [destinationScreenSource, onStateChanged]
  );

  useEffect(() => {
    const currentState = stateController.getCurrentStateFor(
      destinationScreenToReportPattern
    );
    if (currentState !== undefined) {
      onStateChanged(currentState);
    }
    stateController.addStateChangedListener(onStateChangedListener);
    return () => {
      stateController.removeStateChangedListener(onStateChangedListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stateController,
    onStateChangedListener,
    onStateChanged,
    destinationScreenSource,
  ]);
}
