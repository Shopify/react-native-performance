import {NativeModules} from 'react-native';

import {NativeModuleNotFoundError} from '../exceptions';

const NATIVE_MODULE_NAME = 'Performance';

class NativePerformanceModule {
  constructor() {
    if (!(NATIVE_MODULE_NAME in NativeModules)) {
      throw new NativeModuleNotFoundError();
    }
  }

  getNativeTime() {
    return NativeModules[NATIVE_MODULE_NAME].getNativeTime() as Promise<{
      timeSinceEpochMillis: string;
      uptimeMillis: string;
    }>;
  }

  getNativeStartupTimestamp() {
    return NativeModules[NATIVE_MODULE_NAME].getNativeStartupTimestamp() as Promise<string>;
  }

  getNativeUuid() {
    return NativeModules[NATIVE_MODULE_NAME].getNativeUuid() as Promise<string>;
  }
}

export async function getNativeTime() {
  const {timeSinceEpochMillis: timeSinceEpochMillisString, uptimeMillis: uptimeMillisString} =
    await new NativePerformanceModule().getNativeTime();

  const nativeTimeSinceEpochMillis = Number.parseFloat(timeSinceEpochMillisString);
  const nativeUptimeMillis = Number.parseFloat(uptimeMillisString);

  return {nativeTimeSinceEpochMillis, nativeUptimeMillis};
}

export async function getNativeStartupTimestamp() {
  return Number.parseFloat(await new NativePerformanceModule().getNativeStartupTimestamp());
}

export async function getNativeUuid() {
  return new NativePerformanceModule().getNativeUuid();
}
