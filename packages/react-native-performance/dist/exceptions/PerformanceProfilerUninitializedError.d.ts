import PerformanceProfilerError from './PerformanceProfilerError';
export default class PerformanceProfilerUninitializedError extends PerformanceProfilerError {
    readonly name = "PerformanceProfilerUninitializedError";
    readonly destinationScreen: string | undefined;
    constructor(destinationScreen: string | undefined);
}
//# sourceMappingURL=PerformanceProfilerUninitializedError.d.ts.map