import React, {useMemo, useCallback} from 'react';
import {createBottomTabNavigator, BottomTabBar, BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  GestureResponderEvent,
  useStartProfiler,
  useErrorHandler,
  DESTINATION_SCREEN_NAME_PLACEHOLDER,
  PerformanceProfilerError,
} from '@shopify/react-native-performance';
import {View, TouchableWithoutFeedbackProps, TouchableWithoutFeedback} from 'react-native';

import FixedSizeStack from './FixedSizeStack';

export const DEFAULT_SOURCE_NAME = 'BottomTabBar';

type UIEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent;

type InnerTabBarType = (props: BottomTabBarProps) => React.ReactNode;

type TouchableProps = Omit<TouchableWithoutFeedbackProps, 'onPress'> & {
  children: React.ReactNode;
  onPress?: (event: UIEvent) => void;
};

export class MissingTabBarTimestampError extends PerformanceProfilerError {
  readonly name = 'MissingTabBarTimestampError';
  readonly destinationScreen: string;
  constructor(destinationScreen: string) {
    super(
      'Could not capture the native touch timestamp of the tab bar button. ' +
        'As a result, the TTI timer will not start when the navigation button was pressed. ' +
        'Instead, it will start when the JS Touchable.onPress code was executed. This may lead to imprecise TTI ' +
        'values (shorter than what the user actually perceived).',
      'bug',
    );
    this.destinationScreen = destinationScreen;
    Object.setPrototypeOf(this, MissingTabBarTimestampError.prototype);
  }
}

function ProfiledTabBarComponent({
  navigation,
  tabPressEventRecorder,
  InnerTabBar,
  source,
  ...rest
}: BottomTabBarProps & {
  tabPressEventRecorder: FixedSizeStack<UIEvent>;
  InnerTabBar: InnerTabBarType;
  source: string;
}) {
  const startTimer = useStartProfiler();
  const errorHandler = useErrorHandler();

  const wrappedNavigation = useMemo(() => {
    const wrappedNavigation = Object.create(navigation);

    const emit: typeof navigation.emit = event => {
      if (event.type === 'tabPress') {
        const lastRecordedEvent = tabPressEventRecorder.pop();
        if (!lastRecordedEvent || !('timestamp' in lastRecordedEvent.nativeEvent)) {
          errorHandler(new MissingTabBarTimestampError(DESTINATION_SCREEN_NAME_PLACEHOLDER));
        }
        const uiEvent =
          lastRecordedEvent && 'timestamp' in lastRecordedEvent.nativeEvent
            ? {
                nativeEvent: {
                  timestamp: lastRecordedEvent.nativeEvent.timestamp,
                },
              }
            : undefined;

        startTimer({
          source,
          uiEvent,
        });
      }
      return navigation.emit(event);
    };
    wrappedNavigation.emit = emit;
    return wrappedNavigation;
  }, [errorHandler, navigation, source, startTimer, tabPressEventRecorder]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <InnerTabBar {...rest} navigation={wrappedNavigation} />;
}

export default function createProfiledBottomTabNavigator<
  TParamList extends {[key: string]: {[key: string]: unknown} | undefined},
>({source = DEFAULT_SOURCE_NAME}: {source?: string} = {}) {
  const tabPressEventRecorder = new FixedSizeStack<UIEvent>(1);
  const Tab = createBottomTabNavigator<TParamList>();

  function buildProfiledTabBar({
    navigation,
    InnerTabBar = BottomTabBar,
    ...rest
  }: BottomTabBarProps & {
    InnerTabBar?: InnerTabBarType;
  }): React.ReactNode {
    return (
      <ProfiledTabBarComponent
        navigation={navigation}
        tabPressEventRecorder={tabPressEventRecorder}
        InnerTabBar={InnerTabBar}
        source={source}
        {...rest}
      />
    );
  }

  const ProfiledNavigator: typeof Tab['Navigator'] = props => {
    return (
      <Tab.Navigator
        {...props}
        tabBar={tabBarProps => buildProfiledTabBar({...tabBarProps, InnerTabBar: props.tabBar})}
      />
    );
  };

  function buildProfiledBottomTabBarButton<T extends TouchableProps = TouchableProps>({
    Touchable,
  }: {
    Touchable?: React.ComponentType<T>;
  } = {}) {
    const ProfiledTouchable = ({onPress, style, children, ...rest}: T) => {
      const profilerStartingOnPress = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => {
          tabPressEventRecorder.push(event);
          onPress?.(event);
        },
        [onPress],
      );

      const TouchableComponent = Touchable ?? TouchableWithoutFeedback;

      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <TouchableComponent onPress={profilerStartingOnPress} {...rest}>
          <View style={style}>{children}</View>
        </TouchableComponent>
      );
    };

    return ProfiledTouchable;
  }

  const ProfiledTab: typeof Tab = Object.create(Tab);
  ProfiledTab.Navigator = ProfiledNavigator;

  return {Tab: ProfiledTab, buildProfiledBottomTabBarButton};
}
