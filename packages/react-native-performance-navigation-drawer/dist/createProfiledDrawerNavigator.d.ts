import React from 'react';
export declare const DEFAULT_SOURCE_NAME = "Drawer";
declare const createProfiledDrawerNavigator: <TParamList extends {
    [key: string]: {
        [key: string]: unknown;
    } | undefined;
}>({ source, }?: {
    source?: string | undefined;
}) => import("@react-navigation/core").TypedNavigator<TParamList, import("@react-navigation/routers").DrawerNavigationState<import("@react-navigation/routers").ParamListBase>, import("@react-navigation/drawer").DrawerNavigationOptions, import("@react-navigation/drawer").DrawerNavigationEventMap, ({ id, initialRouteName, defaultStatus: customDefaultStatus, backBehavior, children, screenListeners, screenOptions, ...restWithDeprecated }: import("@react-navigation/routers").DefaultRouterOptions<string> & {
    id?: string | undefined;
    children: React.ReactNode;
    screenListeners?: Partial<{
        drawerItemPress: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "drawerItemPress">;
        focus: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "focus">;
        blur: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "blur">;
        state: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "state">;
        beforeRemove: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "beforeRemove">;
    }> | ((props: {
        route: import("@react-navigation/core").RouteProp<import("@react-navigation/routers").ParamListBase, string>;
        navigation: any;
    }) => Partial<{
        drawerItemPress: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "drawerItemPress">;
        focus: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "focus">;
        blur: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "blur">;
        state: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "state">;
        beforeRemove: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/drawer").DrawerNavigationEventMap, "beforeRemove">;
    }>) | undefined;
    screenOptions?: import("@react-navigation/drawer").DrawerNavigationOptions | ((props: {
        route: import("@react-navigation/core").RouteProp<import("@react-navigation/routers").ParamListBase, string>;
        navigation: any;
    }) => import("@react-navigation/drawer").DrawerNavigationOptions) | undefined;
    defaultScreenOptions?: import("@react-navigation/drawer").DrawerNavigationOptions | ((props: {
        route: import("@react-navigation/core").RouteProp<import("@react-navigation/routers").ParamListBase, string>;
        navigation: any;
        options: import("@react-navigation/drawer").DrawerNavigationOptions;
    }) => import("@react-navigation/drawer").DrawerNavigationOptions) | undefined;
} & {
    backBehavior?: import("@react-navigation/routers/lib/typescript/src/TabRouter").BackBehavior | undefined;
} & {
    defaultStatus?: import("@react-navigation/routers").DrawerStatus | undefined;
} & import("@react-navigation/drawer/lib/typescript/src/types").DrawerNavigationConfig) => JSX.Element>;
export default createProfiledDrawerNavigator;
//# sourceMappingURL=createProfiledDrawerNavigator.d.ts.map