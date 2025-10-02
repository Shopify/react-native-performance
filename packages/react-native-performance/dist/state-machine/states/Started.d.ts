import State, { StateProps } from './State';
declare type FlowType = 'app_boot' | 'flow_start' | 'flow_reset';
export interface StartedProps extends StateProps {
    sourceScreen: string | undefined;
    type: FlowType;
}
export default class Started extends State {
    static readonly STATE_NAME = "Started";
    readonly sourceScreen: string | undefined;
    readonly type: FlowType;
    constructor({ sourceScreen, type, ...rest }: StartedProps);
    getStateName(): string;
    updateState(newDestinationScreen: string, newComponentInstanceId: string): Started;
    protected cloneAsChild(): Started;
    protected toSimpleJson(): any;
}
export {};
//# sourceMappingURL=Started.d.ts.map