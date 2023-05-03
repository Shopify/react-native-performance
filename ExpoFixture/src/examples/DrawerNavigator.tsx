import React, {useState, useContext, useRef} from 'react';
import {Text, Button} from 'react-native';
import {useResetFlow} from '@shopify/react-native-performance';
import {ReactNavigationPerformanceView} from '@shopify/react-native-performance-navigation';
import {createProfiledDrawerNavigator} from '@shopify/react-native-performance-navigation-drawer';

import {NavigationKeys} from '../constants';

/**
 * This screen simulates an example where multiple screens can be
 * mounted in parallel at the same time. Changes in one screen can affect
 * some global state (through react context) that can cause a parallely
 * active screen to re-render.
 */

type ValueOf<T> = T[keyof T];

type Props = {
  [key in ValueOf<Pick<typeof NavigationKeys, 'DRAWER_NAVIGATOR_SCREEN_1' | 'DRAWER_NAVIGATOR_SCREEN_2'>>]: undefined;
};

const Drawer = createProfiledDrawerNavigator<Props>();

interface GlobalState {
  counter: number;
  incrementCounter: () => void;
}

const GlobalStateContext = React.createContext<GlobalState | undefined>(undefined);

const DrawerScreen = ({navigationKey}: {navigationKey: keyof typeof NavigationKeys}) => {
  const screenName = NavigationKeys[navigationKey];
  const globalState = useContext(GlobalStateContext);

  const {resetFlow, componentInstanceId} = useResetFlow();

  const isFirstRender = useRef(true);

  if (globalState !== undefined) {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      resetFlow({
        destination: screenName,
      });
    }
  }

  console.log(`JS-rendering ${screenName}.`);

  return (
    <ReactNavigationPerformanceView
      componentInstanceId={componentInstanceId}
      screenName={screenName}
      interactive={globalState !== undefined}
      renderPassName={globalState === undefined ? 'loading' : `interactive_${globalState.counter}`}
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

const DrawerScreen1 = () => {
  return <DrawerScreen navigationKey="DRAWER_NAVIGATOR_SCREEN_1" />;
};

const DrawerScreen2 = () => {
  return <DrawerScreen navigationKey="DRAWER_NAVIGATOR_SCREEN_2" />;
};

const DrawerNavigator = () => {
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
      <Drawer.Navigator>
        <Drawer.Screen name={NavigationKeys.DRAWER_NAVIGATOR_SCREEN_1} component={DrawerScreen1} />
        <Drawer.Screen name={NavigationKeys.DRAWER_NAVIGATOR_SCREEN_2} component={DrawerScreen2} />
      </Drawer.Navigator>
    </GlobalStateContext.Provider>
  );
};

export default DrawerNavigator;
