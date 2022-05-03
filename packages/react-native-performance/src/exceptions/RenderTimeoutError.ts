import { DOCUMENTATION_LINKS } from "../constants";
import State from "../state-machine/states/State";

import PerformanceProfilerError from "./PerformanceProfilerError";

export default class RenderTimeoutError extends PerformanceProfilerError {
  readonly name = "RenderTimeoutError";
  readonly destinationScreen: string;

  constructor(
    destinationScreen: string,
    renderTimeoutMillis: number,
    stateAtTimeout: State
  ) {
    super(
      `Screen '${destinationScreen}' failed to render in ${renderTimeoutMillis} milliseconds. ` +
        `You probably notified the profiler of the navigation-start event ` +
        `via the useStartProfiler hook, but forgot to notify of the render-completion ` +
        `event via <PerformanceMeasureView/>. Read the usage here: ` +
        `${DOCUMENTATION_LINKS.measuringTTITimes}. The state at timeout was: ${stateAtTimeout}.`,
      "fatal"
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, RenderTimeoutError.prototype);
  }
}
