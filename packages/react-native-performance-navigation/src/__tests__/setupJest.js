import '@shopify/react-native-performance/jest-mock';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  // eslint-disable-next-line no-empty-function
  Reanimated.default.call = () => {};

  return Reanimated;
});

global.AbortController = require('abort-controller');

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
