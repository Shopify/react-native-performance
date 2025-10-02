import { NavigationProp, ParamListBase, StackActionHelpers } from '@react-navigation/native';
import { FlowCommonArgs } from '@shopify/react-native-performance';
declare type StartTimerArgs = Omit<FlowCommonArgs, 'reset' | 'destination'>;
declare const PROFILED_APIS: readonly ["navigate", "push", "replace"];
declare type ProfiledAPISType = typeof PROFILED_APIS[number];
/**
 * Getting the ParamList of CompositeNavigationProp would not work without inferring State and Options, even though they are not used.
 */
declare type GetParamListType<T extends NavigationProp<ParamListBase>> = T extends NavigationProp<infer ParamList, infer RouteName, infer NavigatorID, infer State, infer Options> ? ParamList : unknown;
interface BaseNavigationSignatures<T extends NavigationProp<ParamListBase>> {
    navigate<TRouteName extends keyof GetParamListType<T>>(...args: undefined extends GetParamListType<T>[TRouteName] ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]] : [TRouteName, GetParamListType<T>[TRouteName]]): void;
    navigate<TRouteName extends keyof GetParamListType<T>>(route: {
        key: string;
        params?: GetParamListType<T>[TRouteName];
    } | {
        name: TRouteName;
        key?: string;
        params: GetParamListType<T>[TRouteName];
    }): void;
    navigate<TRouteName extends keyof GetParamListType<T>>(startTimerArgs: StartTimerArgs, ...args: undefined extends GetParamListType<T>[TRouteName] ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]] : [TRouteName, GetParamListType<T>[TRouteName]]): void;
    navigate<TRouteName extends keyof GetParamListType<T>>(startTimerArgs: StartTimerArgs, route: {
        key: string;
        params?: GetParamListType<T>[TRouteName];
    } | {
        name: TRouteName;
        key?: string;
        params: GetParamListType<T>[TRouteName];
    }): void;
}
declare type StackNavigationSignatures<T extends NavigationProp<ParamListBase>> = T extends StackActionHelpers<ParamListBase> ? {
    replace<TRouteName extends keyof GetParamListType<T>>(...args: undefined extends GetParamListType<T>[TRouteName] ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]] : [TRouteName, GetParamListType<T>[TRouteName]]): void;
    replace<TRouteName extends keyof GetParamListType<T>>(startTimerArgs: StartTimerArgs, ...args: undefined extends GetParamListType<T>[TRouteName] ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]] : [TRouteName, GetParamListType<T>[TRouteName]]): void;
    push<TRouteName extends keyof GetParamListType<T>>(...args: undefined extends GetParamListType<T>[TRouteName] ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]] : [TRouteName, GetParamListType<T>[TRouteName]]): void;
    push<TRouteName extends keyof GetParamListType<T>>(startTimerArgs: StartTimerArgs, ...args: undefined extends GetParamListType<T>[TRouteName] ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]] : [TRouteName, GetParamListType<T>[TRouteName]]): void;
} : {
    replace?: never;
    push?: never;
};
export declare type ProfiledNavigator<T extends NavigationProp<ParamListBase>> = Omit<T, ProfiledAPISType> & BaseNavigationSignatures<T> & StackNavigationSignatures<T>;
declare const useProfiledNavigation: <T extends NavigationProp<ParamListBase, string, undefined, Readonly<{
    key: string;
    index: number;
    routeNames: string[];
    history?: unknown[] | undefined;
    routes: (Readonly<{
        key: string;
        name: string;
        path?: string | undefined;
    }> & Readonly<{
        params?: Readonly<object | undefined>;
    }> & {
        state?: Readonly<any> | import("@react-navigation/native").PartialState<Readonly<any>> | undefined;
    })[];
    type: string;
    stale: false;
}>, {}, {}>>() => ProfiledNavigator<T>;
export default useProfiledNavigation;
//# sourceMappingURL=useProfiledNavigation.d.ts.map