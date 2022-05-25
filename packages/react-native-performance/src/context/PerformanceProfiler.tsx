// @refresh reset
// Fast refresh saves the React state but unmounts and mounts the component again.
// Since for `PerformanceProfiler` the state depends on mount/unmount, it would often result in invalid operations
// such as `PerformaneProfilerNotStartedError`
import React, {useCallback} from 'react';
import {InteractionManager} from 'react-native';

import {ErrorHandler, ErrorHandlerContextProvider, LogLevel} from '../utils';
import {StateControllerContextProvider, useStateControllerInitializer} from '../state-machine';
import logger from '../utils/Logger';
import {PerformanceProfilerError} from '../exceptions';

import ReportObserver from './ReportObserver';
import useNativeRenderCompletionEvents from './useNativeRenderCompletionEvents';
import useReportEmitter from './useReportEmitter';

const DEFAULT_RENDER_TIMEOUT_MILLIS = 5 * 1000;

interface Props {
  children: React.ReactNode;
  onReportPrepared?: ReportObserver;
  renderTimeoutMillis?: number;
  errorHandler?: ErrorHandler;
  enabled?: boolean;
  useRenderTimeouts?: boolean;
  logLevel?: LogLevel;
}

const PerformanceProfiler = ({
  children,
  onReportPrepared = () => {},
  renderTimeoutMillis = DEFAULT_RENDER_TIMEOUT_MILLIS,
  errorHandler = () => {},
  enabled = true,
  useRenderTimeouts = true,
  logLevel = LogLevel.Warn,
}: Props) => {
  const reportEmitter = useReportEmitter({onReportPrepared, errorHandler});

  logger.logLevel = logLevel;

  /**
   * `errorHandler` wrapped in custom logic that should be out of users' control (such as logging of internal errors).
   */
  const performanceProfilerErrorHandler = useCallback(
    (error: Error) => {
      // If profiler throws an error in parallel with navigation, it might visibly delay animation.
      // To prevent that error handler is wrapped in runAfterInteractions.
      // It's not significant when an error gets reported, but it unblocks navigation transition.
      InteractionManager.runAfterInteractions(() => {
        // We want to provide a custom message for `bug` errors.
        // We also don't want to run `errorHandler` for these bugs since then users would have to make that distinction themselves
        // and we want to save them from that complexity.
        if (error instanceof PerformanceProfilerError && error.type === 'bug') {
          logger.error(
            `You have hit an internal error, please report this: https://github.com/Shopify/react-native-performance/issues/new\n` +
              `${error.name}: ${error.message}`,
          );
        } else {
          logger.error(`${error.name}: ${error.message}`);
          errorHandler(error);
        }
      });
    },
    [errorHandler],
  );

  const stateController = useStateControllerInitializer({
    enabled,
    errorHandler: performanceProfilerErrorHandler,
    reportEmitter,
    useRenderTimeouts,
    renderTimeoutMillis,
  });

  useNativeRenderCompletionEvents({stateController});

  return (
    <StateControllerContextProvider value={stateController}>
      <ErrorHandlerContextProvider value={performanceProfilerErrorHandler}>{children}</ErrorHandlerContextProvider>
    </StateControllerContextProvider>
  );
};

export default PerformanceProfiler;
