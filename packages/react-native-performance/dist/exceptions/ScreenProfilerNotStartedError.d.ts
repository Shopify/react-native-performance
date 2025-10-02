import PerformanceProfilerError from './PerformanceProfilerError';
export default class ScreenProfilerNotStartedError extends PerformanceProfilerError {
    readonly name = "ScreenProfilerNotStartedError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string, componentInstanceId: string);
}
//# sourceMappingURL=ScreenProfilerNotStartedError.d.ts.map