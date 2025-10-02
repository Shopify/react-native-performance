import State from '../state-machine/states/State';
import PerformanceProfilerError from './PerformanceProfilerError';
export default class RenderTimeoutError extends PerformanceProfilerError {
    readonly name = "RenderTimeoutError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string, renderTimeoutMillis: number, stateAtTimeout: State);
}
//# sourceMappingURL=RenderTimeoutError.d.ts.map