import {ReactNavigationPerformanceView} from '@shopify/react-native-performance-navigation';
import {FlatListPerformanceView} from '@shopify/react-native-performance-lists-profiler';
import React, {useRef} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

import {NavigationKeys} from '../constants';

const generateArray = (size: number) => {
  return Array.from(Array(size).keys());
};

const FlatListScreen = () => {
  const data = useRef(generateArray(3000)).current;

  return (
    <ReactNavigationPerformanceView screenName={NavigationKeys.FLAT_LIST_SCREEN} interactive>
      <FlatListPerformanceView listName="FlatList">
        <FlatList
          keyExtractor={item => {
            return item.toString();
          }}
          renderItem={({item}) => {
            const backgroundColor = item % 2 === 0 ? '#00a1f1' : '#ffbb00';
            return (
              <View style={[styles.container, {backgroundColor}]}>
                <Text>Cell Id: {item}</Text>
              </View>
            );
          }}
          data={data}
        />
      </FlatListPerformanceView>
    </ReactNavigationPerformanceView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 120,
    backgroundColor: '#00a1f1',
  },
});

export default FlatListScreen;
