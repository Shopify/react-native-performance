import { FlowCommonArgs } from './FlowCommonArgs';
export interface FlowResetArgs extends FlowCommonArgs {
    destination: string;
}
declare const useResetFlow: () => {
    resetFlow: (args: FlowResetArgs) => void;
    componentInstanceId: string;
};
export default useResetFlow;
//# sourceMappingURL=useResetFlow.d.ts.map