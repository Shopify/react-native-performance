export declare const NavigationKeys: {
    EXAMPLES: "Examples";
    PERFORMANCE: "Performance";
    TAB_NAVIGATOR: "TabNavigator";
    TAB_NAVIGATOR_SCREEN_1: "TabNavigatorScreen1";
    TAB_NAVIGATOR_SCREEN_2: "TabNavigatorScreen2";
    FAST_RENDER_PASSES_SCREEN: "FastRenderPassesScreen";
    CONDITIONAL_RENDERING_SCREEN: "ConditionalRenderingScreen";
    DRAWER_NAVIGATOR: "DrawerNavigator";
    DRAWER_NAVIGATOR_SCREEN_1: "DrawerNavigatorScreen1";
    DRAWER_NAVIGATOR_SCREEN_2: "DrawerNavigatorScreen2";
    FLAT_LIST_SCREEN: "FlatListScreen";
    NESTED_NAVIGATION_SCREEN: "NestedNavigationScreen";
    NESTED_PROFILER_CONTEXT: "NestedProfilerContext";
    NESTED_CONTEXT_SCREEN: "NestedContextScreen";
    INNER_NESTED_CONTEXT_SCREEN: "InnerNestedContextScreen";
};
declare type ValueOf<T> = T[keyof T];
export declare type RootStackParamList = {
    [key in ValueOf<typeof NavigationKeys>]: undefined;
};
export {};
//# sourceMappingURL=constants.d.ts.map