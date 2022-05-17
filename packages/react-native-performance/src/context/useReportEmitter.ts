import {useCallback} from 'react';

import renderPassReportGenerator from '../RenderPassReportGenerator';
import {OnStateChangedListener} from '../state-machine';
import {ErrorHandler} from '../utils';
import logger, {LogLevel} from '../utils/Logger';

import ReportObserver from './ReportObserver';

export default function useReportEmitter({
  onReportPrepared,
  errorHandler,
}: {
  onReportPrepared: ReportObserver;
  errorHandler: ErrorHandler;
}) {
  const reportEmitter: OnStateChangedListener = useCallback(
    (_, __, newState) => {
      renderPassReportGenerator(newState)
        .then(report => {
          if (report !== null) {
            if (logger.logLevel <= LogLevel.Info) {
              logger.info(`Render Pass Report: ${JSON.stringify(report, undefined, 2)}`);
            }
            onReportPrepared(report);
          }
        })
        .catch(errorHandler);
    },
    [onReportPrepared, errorHandler],
  );

  return reportEmitter;
}
