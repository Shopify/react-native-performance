import { useCallback, useEffect, useState } from "react";

import { RenderPassReport } from "../RenderPassReport";
import renderPassReportGenerator from "../RenderPassReportGenerator";
import { useErrorHandler, matchesPattern } from "../utils";
import { OnStateChangedListener, useStateController } from "../state-machine";

interface Props {
  destinationScreen?: RegExp | string;
}

export default function useRenderPassReport({
  destinationScreen: destinationScreenToReportPattern = new RegExp("^.*$"),
}: Props = {}) {
  const errorHandler = useErrorHandler();
  const [latestReport, setLatestReport] = useState<
    RenderPassReport | undefined
  >(undefined);

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
        renderPassReportGenerator(newState)
          .then((report) => {
            if (report !== null) {
              setLatestReport(report);
            }
          })
          .catch(errorHandler);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [destinationScreenSource, errorHandler]
  );

  useEffect(() => {
    stateController.addStateChangedListener(onStateChangedListener);
    return () => {
      stateController.removeStateChangedListener(onStateChangedListener);
    };
  }, [stateController, onStateChangedListener, destinationScreenSource]);

  return latestReport;
}
