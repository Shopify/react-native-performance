export const NavigationKeys = {
  EXAMPLES: 'Examples' as const,
  PERFORMANCE: 'Performance' as const,
  TAB_NAVIGATOR: 'TabNavigator' as const,
  TAB_NAVIGATOR_SCREEN_1: 'TabNavigatorScreen1' as const,
  TAB_NAVIGATOR_SCREEN_2: 'TabNavigatorScreen2' as const,
  FAST_RENDER_PASSES_SCREEN: 'FastRenderPassesScreen' as const,
  CONDITIONAL_RENDERING_SCREEN: 'ConditionalRenderingScreen' as const,
  DRAWER_NAVIGATOR: 'DrawerNavigator' as const,
  DRAWER_NAVIGATOR_SCREEN_1: 'DrawerNavigatorScreen1' as const,
  DRAWER_NAVIGATOR_SCREEN_2: 'DrawerNavigatorScreen2' as const,
  FLAT_LIST_SCREEN: 'FlatListScreen' as const,
  NESTED_NAVIGATION_SCREEN: 'NestedNavigationScreen' as const,
  NESTED_PERFORMANCE_PROFILER_SCREEN: 'NestedPerformanceProfilerScreen' as const,
};

type ValueOf<T> = T[keyof T];

export type RootStackParamList = {
  [key in ValueOf<typeof NavigationKeys>]: undefined;
};
