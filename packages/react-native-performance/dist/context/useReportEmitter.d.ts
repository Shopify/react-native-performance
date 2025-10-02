import { OnStateChangedListener } from '../state-machine';
import { ErrorHandler } from '../utils';
import ReportObserver from './ReportObserver';
export default function useReportEmitter({ onReportPrepared, errorHandler, }: {
    onReportPrepared: ReportObserver;
    errorHandler: ErrorHandler;
}): OnStateChangedListener;
//# sourceMappingURL=useReportEmitter.d.ts.map