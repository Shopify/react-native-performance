import State, { StateProps } from './State';
export interface RenderedProps extends StateProps {
    renderPassName: string;
    interactive: boolean;
}
declare class Rendered extends State {
    static readonly STATE_NAME = "Rendered";
    readonly renderPassName: string;
    readonly interactive: boolean;
    constructor({ renderPassName, interactive, ...rest }: RenderedProps);
    getStateName(): string;
    protected toSimpleJson(): any;
    protected cloneAsChild(): Rendered;
}
export default Rendered;
//# sourceMappingURL=Rendered.d.ts.map