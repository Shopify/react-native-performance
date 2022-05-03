import State, { StateProps } from "./State";

export interface UnmountedProps extends StateProps {}

export default class Unmounted extends State {
  static readonly STATE_NAME = "Unmounted";

  constructor(props: UnmountedProps) {
    super(props);
  }

  getStateName() {
    return Unmounted.STATE_NAME;
  }

  protected cloneAsChild(): Unmounted {
    return new Unmounted({
      destinationScreen: this.destinationScreen,
      componentInstanceId: this.componentInstanceId,
      snapshotId: this.snapshotId,
      operationsSnapshot: this.operationsSnapshot,
      ongoingOperations: this.ongoingOperations,
      timestamp: this.timestamp,
      previousState: this,
    });
  }
}
