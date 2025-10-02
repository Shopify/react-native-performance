import React from 'react';
import { ErrorHandler, LogLevel } from '../utils';
import ReportObserver from './ReportObserver';
interface Props {
    children: React.ReactNode;
    onReportPrepared?: ReportObserver;
    renderTimeoutMillis?: number;
    errorHandler?: ErrorHandler;
    enabled?: boolean;
    useRenderTimeouts?: boolean;
    logLevel?: LogLevel;
}
declare const PerformanceProfiler: ({ children, onReportPrepared, renderTimeoutMillis, errorHandler, enabled, useRenderTimeouts, logLevel, }: Props) => JSX.Element;
export default PerformanceProfiler;
//# sourceMappingURL=PerformanceProfiler.d.ts.map