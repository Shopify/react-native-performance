import { PerformanceProfilerError } from '../../exceptions';
import Started from './Started';
import State from './State';
export declare class UndefinedPreviousStateError extends PerformanceProfilerError {
    readonly name = "UndefinedPreviousStateError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string, state: State);
}
export declare function getFlowStartState(state: State): Started;
interface TraversalOptions {
    stopAtStartState?: boolean;
}
export declare function reverseTraverse(start: State, operation: (_: State) => boolean | void, options?: TraversalOptions): void;
export declare function reverseReduce<T>(start: State, operation: (currentState: State, reducedValue: T) => T, initial: T, options?: TraversalOptions): T;
export {};
//# sourceMappingURL=state-utils.d.ts.map