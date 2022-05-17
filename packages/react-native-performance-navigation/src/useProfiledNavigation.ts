import {useNavigation, NavigationProp, ParamListBase, StackActionHelpers} from '@react-navigation/native';
import {
  useStartProfiler,
  FlowStartArgs,
  isGestureResponderEvent,
  useErrorHandler,
  DESTINATION_SCREEN_NAME_PLACEHOLDER,
  PerformanceProfilerError,
} from '@shopify/react-native-performance';
import {useCallback, useMemo} from 'react';
import isDeepEqual from 'lodash.isequal';

type StartTimerArgs = Omit<FlowStartArgs, 'reset' | 'destination'>;

const PROFILED_APIS = ['navigate', 'push', 'replace'] as const;
type ProfiledAPISType = typeof PROFILED_APIS[number];

class UnexpectedPropertyType extends PerformanceProfilerError {
  readonly name = 'UnexpectedPropertyType';
  readonly destinationScreen: string;
  constructor(destinationScreen: string, functionName: string, propertyType: string) {
    super(
      `Expected '${functionName}' to be a function defined on the inner navigator, but it was of type '${propertyType}'.`,
      'bug',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, UnexpectedPropertyType.prototype);
  }
}

/**
 * Getting the ParamList of CompositeNavigationProp would not work without inferring State and Options, even though they are not used.
 */
//
type GetParamListType<T extends NavigationProp<ParamListBase>> = T extends NavigationProp<
  infer ParamList,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  infer RouteName,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  infer NavigatorID,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  infer State,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  infer Options
>
  ? ParamList
  : unknown;

interface BaseNavigationSignatures<T extends NavigationProp<ParamListBase>> {
  navigate<TRouteName extends keyof GetParamListType<T>>(
    ...args: undefined extends GetParamListType<T>[TRouteName]
      ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]]
      : [TRouteName, GetParamListType<T>[TRouteName]]
  ): void;

  navigate<TRouteName extends keyof GetParamListType<T>>(
    route:
      | {
          key: string;
          params?: GetParamListType<T>[TRouteName];
        }
      | {
          name: TRouteName;
          key?: string;
          params: GetParamListType<T>[TRouteName];
        },
  ): void;

  navigate<TRouteName extends keyof GetParamListType<T>>(
    startTimerArgs: StartTimerArgs,
    ...args: undefined extends GetParamListType<T>[TRouteName]
      ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]]
      : [TRouteName, GetParamListType<T>[TRouteName]]
  ): void;

  navigate<TRouteName extends keyof GetParamListType<T>>(
    startTimerArgs: StartTimerArgs,
    route:
      | {
          key: string;
          params?: GetParamListType<T>[TRouteName];
        }
      | {
          name: TRouteName;
          key?: string;
          params: GetParamListType<T>[TRouteName];
        },
  ): void;
}

type StackNavigationSignatures<T extends NavigationProp<ParamListBase>> = T extends StackActionHelpers<ParamListBase>
  ? {
      replace<TRouteName extends keyof GetParamListType<T>>(
        ...args: undefined extends GetParamListType<T>[TRouteName]
          ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]]
          : [TRouteName, GetParamListType<T>[TRouteName]]
      ): void;

      replace<TRouteName extends keyof GetParamListType<T>>(
        startTimerArgs: StartTimerArgs,
        ...args: undefined extends GetParamListType<T>[TRouteName]
          ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]]
          : [TRouteName, GetParamListType<T>[TRouteName]]
      ): void;

      push<TRouteName extends keyof GetParamListType<T>>(
        ...args: undefined extends GetParamListType<T>[TRouteName]
          ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]]
          : [TRouteName, GetParamListType<T>[TRouteName]]
      ): void;

      push<TRouteName extends keyof GetParamListType<T>>(
        startTimerArgs: StartTimerArgs,
        ...args: undefined extends GetParamListType<T>[TRouteName]
          ? [TRouteName] | [TRouteName, GetParamListType<T>[TRouteName]]
          : [TRouteName, GetParamListType<T>[TRouteName]]
      ): void;
    }
  : {
      replace?: never;
      push?: never;
    };

export type ProfiledNavigator<T extends NavigationProp<ParamListBase>> = Omit<T, ProfiledAPISType> &
  BaseNavigationSignatures<T> &
  StackNavigationSignatures<T>;

function isStartTimerArgs(arg: any): arg is StartTimerArgs {
  return (
    isGestureResponderEvent(arg?.uiEvent) ||
    typeof arg?.source === 'string' ||
    typeof arg?.renderTimeoutMillisOverride === 'number' ||
    isDeepEqual(arg, {})
  );
}

function extractStartNavigationArgs(args: any[]): [StartTimerArgs, any[]] {
  let startTimerArgs: StartTimerArgs = {};
  let navArgs = args;
  if (args.length > 0 && isStartTimerArgs(args[0])) {
    startTimerArgs = args[0];
    navArgs = args.slice(1);
  }
  return [startTimerArgs, navArgs];
}

const useProfiledNavigation = <T extends NavigationProp<ParamListBase>>(): ProfiledNavigator<T> => {
  const navigation: any = useNavigation();
  const startTimer = useStartProfiler();
  const errorHandler = useErrorHandler();

  const wrapperBuilder = useCallback(
    (functionName: ProfiledAPISType) => {
      if (typeof navigation[functionName] !== 'function') {
        errorHandler(
          new UnexpectedPropertyType(
            DESTINATION_SCREEN_NAME_PLACEHOLDER,
            functionName,
            typeof navigation[functionName],
          ),
        );
        return undefined;
      }

      const profiledVersion = (...args: any[]) => {
        const [startTimerArgs, navArgs] = extractStartNavigationArgs(args);
        try {
          startTimer(startTimerArgs);
        } catch (error) {
          errorHandler(error);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return navigation[functionName](...navArgs);
      };

      return profiledVersion;
    },
    [navigation, startTimer, errorHandler],
  );

  const profiledNavigation: ProfiledNavigator<T> = useMemo(() => {
    const profiledNavigation = PROFILED_APIS.reduce((profiledNavigation, functionName) => {
      if (functionName in navigation) {
        profiledNavigation[functionName] = wrapperBuilder(functionName);
      }
      return profiledNavigation;
    }, {} as {[key in ProfiledAPISType]: ReturnType<typeof wrapperBuilder>});

    return Object.setPrototypeOf(profiledNavigation, navigation);
  }, [wrapperBuilder, navigation]);

  return profiledNavigation;
};

export default useProfiledNavigation;
