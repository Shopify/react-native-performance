import React from 'react';
import { GestureResponderEvent, PerformanceProfilerError } from '@shopify/react-native-performance';
import { TouchableWithoutFeedbackProps } from 'react-native';
export declare const DEFAULT_SOURCE_NAME = "BottomTabBar";
declare type UIEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent;
declare type TouchableProps = Omit<TouchableWithoutFeedbackProps, 'onPress'> & {
    children: React.ReactNode;
    onPress?: (event: UIEvent) => void;
};
export declare class MissingTabBarTimestampError extends PerformanceProfilerError {
    readonly name = "MissingTabBarTimestampError";
    readonly destinationScreen: string;
    constructor(destinationScreen: string);
}
export default function createProfiledBottomTabNavigator<TParamList extends {
    [key: string]: {
        [key: string]: unknown;
    } | undefined;
}>({ source }?: {
    source?: string;
}): {
    Tab: import("@react-navigation/core").TypedNavigator<TParamList, import("@react-navigation/routers").TabNavigationState<import("@react-navigation/routers").ParamListBase>, import("@react-navigation/bottom-tabs").BottomTabNavigationOptions, import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, ({ id, initialRouteName, backBehavior, children, screenListeners, screenOptions, sceneContainerStyle, ...restWithDeprecated }: import("@react-navigation/routers").DefaultRouterOptions<string> & {
        id?: string | undefined;
        children: React.ReactNode;
        screenListeners?: Partial<{
            tabPress: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "tabPress">;
            tabLongPress: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "tabLongPress">;
            focus: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "focus">;
            blur: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "blur">;
            state: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "state">;
            beforeRemove: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "beforeRemove">;
        }> | ((props: {
            route: import("@react-navigation/core").RouteProp<import("@react-navigation/routers").ParamListBase, string>;
            navigation: any;
        }) => Partial<{
            tabPress: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "tabPress">;
            tabLongPress: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "tabLongPress">;
            focus: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "focus">;
            blur: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "blur">;
            state: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "state">;
            beforeRemove: import("@react-navigation/core").EventListenerCallback<import("@react-navigation/bottom-tabs").BottomTabNavigationEventMap, "beforeRemove">;
        }>) | undefined;
        screenOptions?: import("@react-navigation/bottom-tabs").BottomTabNavigationOptions | ((props: {
            route: import("@react-navigation/core").RouteProp<import("@react-navigation/routers").ParamListBase, string>;
            navigation: any;
        }) => import("@react-navigation/bottom-tabs").BottomTabNavigationOptions) | undefined;
        defaultScreenOptions?: import("@react-navigation/bottom-tabs").BottomTabNavigationOptions | ((props: {
            route: import("@react-navigation/core").RouteProp<import("@react-navigation/routers").ParamListBase, string>;
            navigation: any;
            options: import("@react-navigation/bottom-tabs").BottomTabNavigationOptions;
        }) => import("@react-navigation/bottom-tabs").BottomTabNavigationOptions) | undefined;
    } & {
        backBehavior?: import("@react-navigation/routers/lib/typescript/src/TabRouter").BackBehavior | undefined;
    } & import("@react-navigation/bottom-tabs/lib/typescript/src/types").BottomTabNavigationConfig) => JSX.Element>;
    buildProfiledBottomTabBarButton: <T extends TouchableProps = TouchableProps>({ Touchable, }?: {
        Touchable?: React.ComponentType<T> | undefined;
    }) => ({ onPress, style, children, ...rest }: T) => JSX.Element;
};
export {};
//# sourceMappingURL=createProfiledBottomTabNavigator.d.ts.map