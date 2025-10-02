/// <reference types="jest" />
import { NavigationProp } from '@react-navigation/core';
import '@quilted/react-testing/matchers';
declare type MockNavigation = Record<keyof NavigationProp<any>, jest.Mock<any, any>>;
interface Context {
    navigation: MockNavigation;
}
interface Config {
    navigation?: Partial<MockNavigation>;
}
/**
 * Creates a mount with a context of navigation and a performance profiler.
 */
export declare const mountWithReactNavigationPerformanceContext: import("@quilted/react-testing").CustomMount<Config, Context, import("@quilted/react-testing/build/typescript/types").EmptyObject, import("@quilted/react-testing/build/typescript/types").EmptyObject, false>;
export {};
//# sourceMappingURL=mountWithReactNavigationPerformanceContext.d.ts.map