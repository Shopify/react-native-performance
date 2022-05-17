import {PerformanceProfilerError} from '../../exceptions';

import Started from './Started';
import State from './State';

export class UndefinedPreviousStateError extends PerformanceProfilerError {
  readonly name = 'UndefinedPreviousStateError';
  readonly destinationScreen: string;
  constructor(destinationScreen: string, state: State) {
    super(`Only flow start states are allowed to have an undefined previous state. ${state}`, 'bug');
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, UndefinedPreviousStateError.prototype);
  }
}

export function getFlowStartState(state: State): Started {
  if (state instanceof Started) {
    return state;
  }
  if (state.previousState === undefined) {
    throw new UndefinedPreviousStateError(state.destinationScreen, state);
  }
  return getFlowStartState(state.previousState);
}

interface TraversalOptions {
  stopAtStartState?: boolean;
}

function normalize(options: TraversalOptions | undefined) {
  return {
    stopAtStartState: options?.stopAtStartState ?? true,
  };
}

export function reverseTraverse(start: State, operation: (_: State) => boolean | void, options?: TraversalOptions) {
  const {stopAtStartState} = normalize(options);
  let current: State | undefined = start;
  while (current !== undefined) {
    const abort = operation(current);
    if (abort === true) {
      break;
    }
    if (stopAtStartState && current instanceof Started) {
      break;
    }
    current = current.previousState;
  }
}

export function reverseReduce<T>(
  start: State,
  operation: (currentState: State, reducedValue: T) => T,
  initial: T,
  options?: TraversalOptions,
): T {
  let reduced = initial;
  reverseTraverse(
    start,
    state => {
      reduced = operation(state, reduced);
    },
    options,
  );
  return reduced;
}
