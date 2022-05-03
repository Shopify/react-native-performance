import { PerformanceProfilerError } from "../exceptions";

type OperationStatus = {
  startTimestamp: number;
  abortController?: AbortController;
} & (
  | {
      endTimestamp?: never;
      cancelled?: never;
    }
  | {
      endTimestamp: number;
      cancelled: boolean;
    }
);

interface OperationTimestamps {
  [operationName: string]: Omit<OperationStatus, "abortController">;
}

export class OperationEndError extends PerformanceProfilerError {
  readonly name = "OperationEndError";
  readonly destinationScreen: string;

  constructor(destinationScreen: string, operationName: string) {
    super(
      `Operation '${operationName}' had previously been ended already.`,
      "bug"
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, OperationEndError.prototype);
  }
}

export class OperationStartedError extends PerformanceProfilerError {
  readonly name = "OperationStartedError";
  readonly destinationScreen: string;

  constructor(destinationScreen: string, operationName: string) {
    super(
      `Operation '${operationName}' had previously been started once already.`,
      "bug"
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, OperationStartedError.prototype);
  }
}

export class OperationNotStartedError extends PerformanceProfilerError {
  readonly name = "OperationNotStartedError";
  readonly destinationScreen: string;

  constructor(destinationScreen: string, operationName: string) {
    super(`Operation '${operationName}' was never started.`, "bug");
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, OperationNotStartedError.prototype);
  }
}

class OngoingOperationsRegistry {
  private readonly _operationTimestamps: {
    [operationName: string]: OperationStatus;
  };

  constructor() {
    this._operationTimestamps = {};
  }

  get operationTimestamps(): OperationTimestamps {
    return Object.entries(this._operationTimestamps).reduce(
      (previousValue: any, [operationName, operationStatus]) => {
        previousValue[operationName] = {
          startTimestamp: operationStatus.startTimestamp,
          endTimestamp: operationStatus.endTimestamp,
          cancelled: operationStatus.cancelled,
        };
        return previousValue;
      },
      {}
    );
  }

  onOperationStarted(
    destinationScreen: string,
    operationName: string,
    abortController?: AbortController
  ): OngoingOperationsRegistry {
    const now = Date.now();
    if (operationName in this._operationTimestamps) {
      throw new OperationStartedError(destinationScreen, operationName);
    }
    const newState = this.copy();
    newState._operationTimestamps[operationName] = {
      startTimestamp: now,
      abortController,
    };
    return newState;
  }

  onOperationCompleted(
    destinationScreen: string,
    operationName: string,
    cancelled = false
  ): OngoingOperationsRegistry {
    const now = Date.now();

    if (!(operationName in this._operationTimestamps)) {
      throw new OperationNotStartedError(destinationScreen, operationName);
    }

    const { startTimestamp, abortController, endTimestamp } =
      this._operationTimestamps[operationName];

    if (endTimestamp !== undefined) {
      throw new OperationEndError(destinationScreen, operationName);
    }

    if (now < startTimestamp) {
      throw new OperationEndError(destinationScreen, operationName);
    }

    if (cancelled) {
      abortController?.abort();
    }

    const newState = this.copy();
    newState._operationTimestamps[operationName] = {
      startTimestamp,
      endTimestamp: now,
      cancelled,
    };
    return newState;
  }

  onAllOngoingOperationsCancelled(
    destinationScreen: string
  ): OngoingOperationsRegistry {
    let modified = false;
    const now = Date.now();
    const newState = this.copy();

    Object.entries(this._operationTimestamps).forEach(
      ([operationName, { startTimestamp, abortController, endTimestamp }]) => {
        if (endTimestamp !== undefined) {
          // Already ended
          return;
        }

        if (now < startTimestamp) {
          throw new OperationEndError(destinationScreen, operationName);
        }

        abortController?.abort();

        modified = true;
        newState._operationTimestamps[operationName] = {
          startTimestamp,
          endTimestamp: now,
          cancelled: true,
        };
      }
    );

    return modified ? newState : this;
  }

  private copy(): OngoingOperationsRegistry {
    const newState = new OngoingOperationsRegistry();
    Object.entries(this._operationTimestamps).forEach(
      ([operationName, operationInfo]) => {
        newState._operationTimestamps[operationName] = { ...operationInfo };
      }
    );
    return newState;
  }
}

export default OngoingOperationsRegistry;
