import BridgedEventTimestamp from '../../BridgedEventTimestamp';
export interface StateProps {
    destinationScreen: string;
    componentInstanceId: string;
    previousState: State | undefined;
    snapshotId: Promise<string>;
    timestamp: BridgedEventTimestamp;
}
declare abstract class State {
    readonly destinationScreen: string;
    readonly componentInstanceId: string;
    readonly previousState: State | undefined;
    readonly snapshotId: Promise<string>;
    readonly timestamp: BridgedEventTimestamp;
    constructor({ destinationScreen, componentInstanceId, previousState, snapshotId, timestamp }: StateProps);
    toString(): string;
    abstract getStateName(): string;
    protected toSimpleJson(): any;
    protected abstract cloneAsChild(): State;
}
export default State;
//# sourceMappingURL=State.d.ts.map