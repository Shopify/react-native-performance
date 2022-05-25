import React, {useState, useContext, useRef} from 'react';
import {Text, Button} from 'react-native';
import {useResetFlow} from '@shopify/react-native-performance';
import {ReactNavigationPerformanceView} from '@shopify/react-native-performance-navigation';
import {createProfiledBottomTabNavigator} from '@shopify/react-native-performance-navigation-bottom-tabs';

import {NavigationKeys} from '../constants';

/**
 * This screen simulates an example where multiple screens can be
 * mounted in parallel at the same time. Changes in one screen can affect
 * some global state (through react context) that can cause a parallely
 * active screen to re-render.
 */

type ValueOf<T> = T[keyof T];

type Props = {
  [key in ValueOf<Pick<typeof NavigationKeys, 'TAB_NAVIGATOR_SCREEN_1' | 'TAB_NAVIGATOR_SCREEN_2'>>]: undefined;
};

const {Tab, buildProfiledBottomTabBarButton} = createProfiledBottomTabNavigator<Props>();

interface GlobalState {
  counter: number;
  incrementCounter: () => void;
}

const GlobalStateContext = React.createContext<GlobalState | undefined>(undefined);

const TabScreen = ({navigationKey}: {navigationKey: keyof typeof NavigationKeys}) => {
  const screenName = NavigationKeys[navigationKey];
  const globalState = useContext(GlobalStateContext);
  const {resetFlow, componentInstanceId} = useResetFlow();

  const isFirstRender = useRef(true);

  if (globalState !== undefined) {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      console.log(`Resetting flow for screen: ${screenName}`);
      resetFlow({
        destination: screenName,
      });
    }
  }

  console.log(`JS-rendering ${screenName}.`);

  return (
    <ReactNavigationPerformanceView
      screenName={screenName}
      interactive={globalState !== undefined}
      renderPassName={globalState === undefined ? 'loading' : `interactive_${globalState.counter}`}
      componentInstanceId={componentInstanceId}
    >
      {globalState && (
        <>
          <Text>
            Hello {screenName}. Counter: {globalState.counter}
          </Text>
          <Button onPress={globalState.incrementCounter} title="Increment counter" />
        </>
      )}
    </ReactNavigationPerformanceView>
  );
};

const TabScreen1 = () => {
  return <TabScreen navigationKey="TAB_NAVIGATOR_SCREEN_1" />;
};

const TabScreen2 = () => {
  return <TabScreen navigationKey="TAB_NAVIGATOR_SCREEN_2" />;
};

const TabNavigator = () => {
  const [contextValue, setContextValue] = useState<GlobalState>({
    counter: 0,
    incrementCounter: () => {
      setContextValue(currentContext => {
        return {
          ...currentContext,
          counter: currentContext.counter + 1,
        };
      });
    },
  });

  return (
    <GlobalStateContext.Provider value={contextValue}>
      <Tab.Navigator>
        <Tab.Screen
          name={NavigationKeys.TAB_NAVIGATOR_SCREEN_1}
          component={TabScreen1}
          options={{
            tabBarButton: buildProfiledBottomTabBarButton(),
          }}
        />
        <Tab.Screen
          name={NavigationKeys.TAB_NAVIGATOR_SCREEN_2}
          component={TabScreen2}
          options={{
            tabBarButton: buildProfiledBottomTabBarButton(),
          }}
        />
      </Tab.Navigator>
    </GlobalStateContext.Provider>
  );
};

export default TabNavigator;
