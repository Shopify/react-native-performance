import React from 'react';
import {ReactNavigationPerformanceView, useProfiledNavigation} from '@shopify/react-native-performance-navigation';
import {Button} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';

import {NavigationKeys, RootStackParamList} from '../constants';

const NestedNavigationScreen = () => {
  const {push} = useProfiledNavigation<StackNavigationProp<RootStackParamList, 'Examples'>>();

  return (
    <ReactNavigationPerformanceView screenName={NavigationKeys.NESTED_NAVIGATION_SCREEN} interactive>
      <Button
        title="Navigate to NestedNavigationScreen"
        onPress={() => push(NavigationKeys.NESTED_NAVIGATION_SCREEN)}
      />
    </ReactNavigationPerformanceView>
  );
};

export default NestedNavigationScreen;
