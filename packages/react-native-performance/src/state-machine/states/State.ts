import BridgedEventTimestamp from '../../BridgedEventTimestamp';

export interface StateProps {
  destinationScreen: string;
  componentInstanceId: string;
  previousState: State | undefined;
  snapshotId: Promise<string>;
  timestamp: BridgedEventTimestamp;
}

abstract class State {
  readonly destinationScreen: string;
  readonly componentInstanceId: string;
  readonly previousState: State | undefined;
  readonly snapshotId: Promise<string>;
  readonly timestamp: BridgedEventTimestamp;

  constructor({destinationScreen, componentInstanceId, previousState, snapshotId, timestamp}: StateProps) {
    this.destinationScreen = destinationScreen;
    this.componentInstanceId = componentInstanceId;
    this.previousState = previousState;
    this.snapshotId = snapshotId;
    this.timestamp = timestamp;
  }

  toString() {
    return JSON.stringify(this.toSimpleJson(), undefined, 2);
  }

  abstract getStateName(): string;

  protected toSimpleJson(): any {
    return {
      name: this.getStateName(),
      destinationScreen: this.destinationScreen,
      componentInstanceId: this.componentInstanceId,
      previousState: this.previousState?.getStateName(),
      timestamp: this.timestamp,
    };
  }

  protected abstract cloneAsChild(): State;
}

export default State;
