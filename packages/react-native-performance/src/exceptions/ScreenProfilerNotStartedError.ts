import { DOCUMENTATION_LINKS } from "../constants";

import PerformanceProfilerError from "./PerformanceProfilerError";

export default class ScreenProfilerNotStartedError extends PerformanceProfilerError {
  readonly name = "ScreenProfilerNotStartedError";
  readonly destinationScreen: string;

  constructor(destinationScreen: string, componentInstanceId: string) {
    super(
      `No previous state was found for screen '${destinationScreen}' with componentInstanceId ${componentInstanceId}. This probably means that the navigation-start event was never recorded, ` +
        `while a subsequent render flow event was (render pass start, data operation profiling, etc.). You seem to have used some profiling API ` +
        "but likely forgot to use the 'useStartProfiler' hook to start the flow. Read the usage here: " +
        `${DOCUMENTATION_LINKS.measuringTTITimes}.`,
      "fatal"
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, ScreenProfilerNotStartedError.prototype);
  }
}
