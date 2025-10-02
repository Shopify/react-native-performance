import State, { StateProps } from './State';
interface RenderAbortedProps extends StateProps {
}
declare class RenderAborted extends State {
    static readonly STATE_NAME = "RenderAborted";
    constructor(props: RenderAbortedProps);
    getStateName(): string;
    protected cloneAsChild(): RenderAborted;
}
export default RenderAborted;
//# sourceMappingURL=RenderAborted.d.ts.map