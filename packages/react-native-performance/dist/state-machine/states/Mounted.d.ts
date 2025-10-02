import State, { StateProps } from './State';
export interface MountedProps extends StateProps {
}
export default class Mounted extends State {
    static readonly STATE_NAME = "Mounted";
    constructor(props: MountedProps);
    getStateName(): string;
    protected cloneAsChild(): Mounted;
}
//# sourceMappingURL=Mounted.d.ts.map