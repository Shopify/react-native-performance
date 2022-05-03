import React from "react";
import { NavigationContext, NavigationProp } from "@react-navigation/core";
import "@quilted/react-testing/matchers";
import { createMount } from "@quilted/react-testing";
import { PerformanceProfiler } from "@shopify/react-native-performance";

type MockNavigation = Record<keyof NavigationProp<any>, jest.Mock<any, any>>;

interface Context {
  navigation: MockNavigation;
}

interface Config {
  navigation?: Partial<MockNavigation>;
}

const mockNavigation: MockNavigation = {
  dispatch: jest.fn(),
  goBack: jest.fn(),
  navigate: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(() => true),
  getParent: jest.fn(),
  getId: jest.fn(),
  getState: jest.fn(),
  canGoBack: jest.fn(() => true),
  setOptions: jest.fn(),
};

/**
 * Creates a mount with a context of navigation and a performance profiler.
 */
export const mountWithReactNavigationPerformanceContext = createMount<
  Config,
  Context
>({
  context: ({ navigation: navigationConfig }: Config): Context => {
    const navigation = {
      ...mockNavigation,
      ...navigationConfig,
    } as MockNavigation;
    return { navigation };
  },
  render: (element, context) => {
    const { navigation } = context;
    const profiler = (
      <PerformanceProfiler onReportPrepared={jest.fn()} enabled={false}>
        <NavigationContext.Provider value={navigation}>
          {element}
        </NavigationContext.Provider>
      </PerformanceProfiler>
    );
    return profiler;
  },
});
