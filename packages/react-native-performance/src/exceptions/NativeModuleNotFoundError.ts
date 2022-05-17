import PerformanceProfilerError from './PerformanceProfilerError';

export default class NativeModuleNotFoundError extends PerformanceProfilerError {
  readonly name = 'NativeModuleNotFoundError';
  readonly destinationScreen = undefined;

  constructor() {
    super(
      'Performance module not found in NativeModules. ' +
        "Chances are you're in a test environment, but the mocks have not been setup correctly.",
      'bug',
    );
    Object.setPrototypeOf(this, NativeModuleNotFoundError.prototype);
  }
}
