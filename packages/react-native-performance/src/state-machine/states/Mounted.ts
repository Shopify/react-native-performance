import State, { StateProps } from "./State";

export interface MountedProps extends StateProps {}

export default class Mounted extends State {
  static readonly STATE_NAME = "Mounted";

  constructor(props: MountedProps) {
    super(props);
  }

  getStateName() {
    return Mounted.STATE_NAME;
  }

  protected cloneAsChild(): Mounted {
    return new Mounted({
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
