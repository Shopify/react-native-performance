import State, {StateProps} from './State';

interface RenderAbortedProps extends StateProps {}

class RenderAborted extends State {
  static readonly STATE_NAME = 'RenderAborted';

  constructor(props: RenderAbortedProps) {
    super(props);
  }

  getStateName() {
    return RenderAborted.STATE_NAME;
  }

  protected cloneAsChild(): RenderAborted {
    return new RenderAborted({
      destinationScreen: this.destinationScreen,
      componentInstanceId: this.componentInstanceId,
      snapshotId: this.snapshotId,
      timestamp: this.timestamp,
      previousState: this,
    });
  }
}

export default RenderAborted;
