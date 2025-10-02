import { State } from '../state-machine/states';
interface Props {
    destinationScreen?: RegExp | string;
    onStateChanged: (_: State) => void;
}
export default function useProfilerStateChangeListener({ destinationScreen: destinationScreenToReportPattern, onStateChanged, }: Props): void;
export {};
//# sourceMappingURL=useProfilerStateChangeListener.d.ts.map