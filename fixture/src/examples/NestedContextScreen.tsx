import React from 'react';
import {ReactNavigationPerformanceView, useProfiledNavigation} from '@shopify/react-native-performance-navigation';
import {Button, Text, View, StyleSheet} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {PerformanceProfiler, LogLevel} from '@shopify/react-native-performance';

import {NavigationKeys, RootStackParamList} from '../constants';

/**
 * NOTE: This screen shouldn't be used as an example since we don't generally recommend mixing multiple profilers.
 * Nested profilers only make sense when transitioning between JS and native layers in a hybrid use case.
 * For example, in brown-field apps, gradually adopting React Native.
 * Please stick with only profiler per App if there is no serious matter to do otherwise.
 */

const NestedContextScreen = () => {
  const {navigate} = useProfiledNavigation<StackNavigationProp<RootStackParamList, 'Examples'>>();

  return (
    <PerformanceProfiler logLevel={LogLevel.Debug}>
      <ReactNavigationPerformanceView screenName={NavigationKeys.NESTED_CONTEXT_SCREEN} interactive>
        <Button
          title="Present new screen inside nested Profiler Context"
          onPress={() => navigate(NavigationKeys.INNER_NESTED_CONTEXT_SCREEN)}
        />
      </ReactNavigationPerformanceView>
    </PerformanceProfiler>
  );
};

export const InnerNestedContextScreen = () => {
  const text = 'This is a screen rendered in a nested Profiler Context\n\n You should see no errors in the logs';
  return (
    <ReactNavigationPerformanceView screenName={NavigationKeys.INNER_NESTED_CONTEXT_SCREEN} interactive>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </ReactNavigationPerformanceView>
  );
};

export default NestedContextScreen;

const styles = StyleSheet.create({
  text: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
