/**
 * `bug` errors are tied to internal issues and are handled by the library itself.
 *
 * `fatal` errors are thrown when we detect incorrect usage of the library and are passed to `errorHandler` in `PerformanceProfiler`.
 */
export declare type PerformanceProfilerErrorType = 'fatal' | 'bug';
export default abstract class PerformanceProfilerError extends Error {
    readonly type: PerformanceProfilerErrorType;
    abstract readonly name: string;
    abstract readonly destinationScreen: string | undefined;
    constructor(message: string, type: PerformanceProfilerErrorType);
}
//# sourceMappingURL=PerformanceProfilerError.d.ts.map