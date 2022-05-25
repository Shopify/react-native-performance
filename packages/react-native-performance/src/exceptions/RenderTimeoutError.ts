import {DOCUMENTATION_LINKS} from '../constants';
import State from '../state-machine/states/State';

import PerformanceProfilerError from './PerformanceProfilerError';

export default class RenderTimeoutError extends PerformanceProfilerError {
  readonly name = 'RenderTimeoutError';
  readonly destinationScreen: string;

  constructor(destinationScreen: string, renderTimeoutMillis: number, stateAtTimeout: State) {
    super(
      `Screen '${destinationScreen}' failed to render in ${renderTimeoutMillis} milliseconds. One of the following could happen:\n` +
        `1. You notified the profiler of the navigation-start event via the useStartProfiler hook, but forgot to notify of the render-completion event via <PerformanceMeasureView/>\n` +
        `Read the usage here: ${DOCUMENTATION_LINKS.measuringTTITimes}.\n` +
        `2. You use useStartProfiler hook instead of useResetFlow hook when re-render is occurring because the flow is essentially being restarted.\n` +
        `Read the usage here: ${DOCUMENTATION_LINKS.measuringRerenderTimes}.\n` +
        ` The state at timeout was: ${stateAtTimeout}.`,
      'fatal',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, RenderTimeoutError.prototype);
  }
}
