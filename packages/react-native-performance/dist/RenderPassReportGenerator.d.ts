import { RenderPassReport } from './RenderPassReport';
import { State } from './state-machine/states';
import { PerformanceProfilerError } from './exceptions';
export declare type RenderPassReportGeneratorType = (newState: State) => Promise<RenderPassReport | null>;
export declare class CompletionTimestampError extends PerformanceProfilerError {
    readonly name = "CompletionTimestampError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string);
}
export declare class MissingJSNativeLatencyError extends PerformanceProfilerError {
    readonly name = "MissingJSNativeLatencyError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string);
}
declare const renderPassReportGenerator: RenderPassReportGeneratorType;
export default renderPassReportGenerator;
//# sourceMappingURL=RenderPassReportGenerator.d.ts.map