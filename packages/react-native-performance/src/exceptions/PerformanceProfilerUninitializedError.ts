import PerformanceProfilerError from './PerformanceProfilerError';

export default class PerformanceProfilerUninitializedError extends PerformanceProfilerError {
  readonly name = 'PerformanceProfilerUninitializedError';
  readonly destinationScreen: string | undefined;

  constructor(destinationScreen: string | undefined) {
    super(
      'Performance profiler was not initialized correctly. Did you forget to mount the <PerformanceProfiler /> component in the App tree?',
      'fatal',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, PerformanceProfilerUninitializedError.prototype);
  }
}
