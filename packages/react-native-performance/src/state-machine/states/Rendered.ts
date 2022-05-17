import State, {StateProps} from './State';

export interface RenderedProps extends StateProps {
  renderPassName: string;
  interactive: boolean;
}

class Rendered extends State {
  static readonly STATE_NAME = 'Rendered';
  readonly renderPassName: string;
  readonly interactive: boolean;

  constructor({renderPassName, interactive, ...rest}: RenderedProps) {
    super(rest);
    this.renderPassName = renderPassName;
    this.interactive = interactive;
  }

  getStateName() {
    return Rendered.STATE_NAME;
  }

  protected toSimpleJson() {
    return {
      ...super.toSimpleJson(),
      interactive: this.interactive,
      renderPassName: this.renderPassName,
    };
  }

  protected cloneAsChild(): Rendered {
    return new Rendered({
      destinationScreen: this.destinationScreen,
      componentInstanceId: this.componentInstanceId,
      snapshotId: this.snapshotId,
      operationsSnapshot: this.operationsSnapshot,
      ongoingOperations: this.ongoingOperations,
      timestamp: this.timestamp,
      renderPassName: this.renderPassName,
      interactive: this.interactive,
      previousState: this,
    });
  }
}

export default Rendered;
