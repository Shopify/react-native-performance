import BridgedEventTimestamp from '../../BridgedEventTimestamp';
import OngoingOperationsRegistry from '../OngoingOperationsRegistry';

export interface StateProps {
  destinationScreen: string;
  componentInstanceId: string;
  previousState: State | undefined;
  snapshotId: Promise<string>;
  operationsSnapshot: OngoingOperationsRegistry;
  ongoingOperations?: OngoingOperationsRegistry;
  timestamp: BridgedEventTimestamp;
}

abstract class State {
  readonly destinationScreen: string;
  readonly componentInstanceId: string;
  readonly previousState: State | undefined;
  readonly snapshotId: Promise<string>;
  readonly operationsSnapshot: OngoingOperationsRegistry;
  readonly timestamp: BridgedEventTimestamp;
  private _ongoingOperations: OngoingOperationsRegistry;

  constructor({
    destinationScreen,
    componentInstanceId,
    previousState,
    snapshotId,
    operationsSnapshot,
    ongoingOperations = operationsSnapshot,
    timestamp,
  }: StateProps) {
    this.destinationScreen = destinationScreen;
    this.componentInstanceId = componentInstanceId;
    this.previousState = previousState;
    this.snapshotId = snapshotId;
    this.operationsSnapshot = operationsSnapshot;
    this._ongoingOperations = ongoingOperations;
    this.timestamp = timestamp;
  }

  toString() {
    return JSON.stringify(this.toSimpleJson(), undefined, 2);
  }

  get ongoingOperations(): OngoingOperationsRegistry {
    return this._ongoingOperations;
  }

  onOperationStarted(operationName: string, abortController?: AbortController): State {
    const newOngoingOperations = this.ongoingOperations.onOperationStarted(
      this.destinationScreen,
      operationName,
      abortController,
    );
    return this.updateOngoingOperations(newOngoingOperations);
  }

  onOperationCompleted(operationName: string, cancelled = false): State {
    const newOngoingOperations = this.ongoingOperations.onOperationCompleted(
      this.destinationScreen,
      operationName,
      cancelled,
    );
    return this.updateOngoingOperations(newOngoingOperations);
  }

  onAllOngoingOperationsCancelled(): State {
    const newOngoingOperations = this.ongoingOperations.onAllOngoingOperationsCancelled(this.destinationScreen);
    return this.updateOngoingOperations(newOngoingOperations);
  }

  abstract getStateName(): string;

  protected toSimpleJson(): any {
    return {
      name: this.getStateName(),
      destinationScreen: this.destinationScreen,
      componentInstanceId: this.componentInstanceId,
      previousState: this.previousState?.getStateName(),
      timestamp: this.timestamp,
      operationsSnapshot: {
        operationTimestamps: this.operationsSnapshot.operationTimestamps,
      },
      ongoingOperations: {
        operationTimestamps: this._ongoingOperations.operationTimestamps,
      },
    };
  }

  private updateOngoingOperations(ongoingOperations: OngoingOperationsRegistry): State {
    if (this.ongoingOperations === ongoingOperations) {
      return this;
    }
    const newState = this.cloneAsChild();
    newState._ongoingOperations = ongoingOperations;
    return newState;
  }

  protected abstract cloneAsChild(): State;
}

export default State;
