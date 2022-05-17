import {NativeModules} from 'react-native';

import {NativeModuleNotFoundError} from '../../exceptions';
import {getNativeTime, getNativeStartupTimestamp, getNativeUuid} from '../../utils/native-performance-module';

jest.mock('react-native', () => {
  return {
    NativeModules: {},
  };
});

describe('native-performance-module', () => {
  describe('getNativeTime', () => {
    beforeEach(() => {
      NativeModules.Performance = {
        getNativeTime: () => {
          return Promise.resolve({
            timeSinceEpochMillis: '1234',
            uptimeMillis: '56',
          });
        },
      };
    });

    afterEach(() => {
      delete NativeModules.Performance;
    });

    it('throws error if native module not found', async () => {
      delete NativeModules.Performance;
      await expect(getNativeTime).rejects.toThrowError(NativeModuleNotFoundError);
    });

    it('fetches the time from the native module', async () => {
      const {nativeTimeSinceEpochMillis, nativeUptimeMillis} = await getNativeTime();
      expect(nativeTimeSinceEpochMillis).toBe(1234);
      expect(nativeUptimeMillis).toBe(56);
    });
  });

  describe('getStartupTimestamp', () => {
    beforeEach(() => {
      NativeModules.Performance = {
        getNativeStartupTimestamp: () => {
          return Promise.resolve('1234');
        },
      };
    });

    afterEach(() => {
      delete NativeModules.Performance;
    });

    it('fetches the time from the native module', async () => {
      const nativeStartupTimestamp = await getNativeStartupTimestamp();
      expect(nativeStartupTimestamp).toBe(1234);
    });

    it('throws error if native module not found', async () => {
      delete NativeModules.Performance;
      await expect(getNativeStartupTimestamp).rejects.toThrowError(NativeModuleNotFoundError);
    });
  });

  describe('getNativeUuid', () => {
    beforeEach(() => {
      NativeModules.Performance = {
        getNativeUuid: () => {
          return Promise.resolve('1234-5678-0987');
        },
      };
    });

    afterEach(() => {
      delete NativeModules.Performance;
    });

    it('fetches the uuid from the native module', async () => {
      const uuid = await getNativeUuid();
      expect(uuid).toBe('1234-5678-0987');
    });

    it('throws error if native module not found', async () => {
      delete NativeModules.Performance;
      await expect(getNativeUuid).rejects.toThrowError(NativeModuleNotFoundError);
    });
  });
});
