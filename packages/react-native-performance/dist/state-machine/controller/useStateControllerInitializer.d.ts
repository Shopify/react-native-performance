import { ErrorHandler } from '../../utils';
import StateController, { OnStateChangedListener } from './StateController';
export default function useStateControllerInitializer({ enabled, errorHandler, reportEmitter, useRenderTimeouts, renderTimeoutMillis, }: {
    enabled: boolean;
    errorHandler: ErrorHandler;
    reportEmitter: OnStateChangedListener;
    useRenderTimeouts: boolean;
    renderTimeoutMillis: number;
}): StateController;
//# sourceMappingURL=useStateControllerInitializer.d.ts.map