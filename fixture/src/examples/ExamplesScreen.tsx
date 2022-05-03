import React from "react";
import {
  StatusBar,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  ReactNavigationPerformanceView,
  useProfiledNavigation,
} from "@shopify/react-native-performance-navigation";
import { StackNavigationProp } from "@react-navigation/stack";

import { NavigationKeys, RootStackParamList } from "../constants";

export const ExamplesScreen = () => {
  const { navigate } =
    useProfiledNavigation<
      StackNavigationProp<RootStackParamList, "Examples">
    >();

  return (
    <ReactNavigationPerformanceView
      screenName={NavigationKeys.EXAMPLES}
      interactive
    >
      <StatusBar barStyle="dark-content" />
      <FlatList
        keyExtractor={(item) => item.destination}
        data={[
          { title: "Performance", destination: NavigationKeys.PERFORMANCE },
          { title: "Tab Navigator", destination: NavigationKeys.TAB_NAVIGATOR },
          {
            title: "Drawer Navigator",
            destination: NavigationKeys.DRAWER_NAVIGATOR,
          },
          {
            title: "Fast Render Passes Screen",
            destination: NavigationKeys.FAST_RENDER_PASSES_SCREEN,
          },
          {
            title: "Nested Navigation Screen",
            destination: NavigationKeys.NESTED_NAVIGATION_SCREEN,
          },
          {
            title: "Conditional Rendering Screen",
            destination: NavigationKeys.CONDITIONAL_RENDERING_SCREEN,
          },
          {
            title: "FlatList Screen",
            destination: NavigationKeys.FLAT_LIST_SCREEN,
          },
        ]}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={(uiEvent) => {
              navigate(
                {
                  source: NavigationKeys.EXAMPLES,
                  uiEvent,
                },
                item.destination
              );
            }}
          >
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Image
              style={styles.arrow}
              source={require("../assets/ic-arrow.png")}
            />
          </TouchableOpacity>
        )}
      />
    </ReactNavigationPerformanceView>
  );
};

const styles = StyleSheet.create({
  row: {
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowTitle: {
    fontSize: 18,
  },
  arrow: {
    resizeMode: "center",
  },
});
