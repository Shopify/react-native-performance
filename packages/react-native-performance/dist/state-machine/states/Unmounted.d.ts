import State, { StateProps } from './State';
export interface UnmountedProps extends StateProps {
}
export default class Unmounted extends State {
    static readonly STATE_NAME = "Unmounted";
    constructor(props: UnmountedProps);
    getStateName(): string;
    protected cloneAsChild(): Unmounted;
}
//# sourceMappingURL=Unmounted.d.ts.map