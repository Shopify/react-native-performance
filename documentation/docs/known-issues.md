---
id: known-issues
title: Known issues
slug: /known-issues
---

## initialRouteName

If you use a [bottom tab](https://reactnavigation.org/docs/bottom-tab-navigator) or a [drawer](https://reactnavigation.org/docs/drawer-navigator/) navigator with `initialRouteName` referring to a different screen than the first one, `react-native-performance` might report inaccurate measurements. To fix that, make sure that `backBehavior` is set to `history`:

```diff
- <Tab.Navigator initialRouteName="Screen2">
+ <Tab.Navigator initialRouteName="Screen2" backBehavior="history">
  <Tab.Screen
    name="Screen1"
    component={Screen1}
  />
  <Tab.Screen
    name="Screen2"
    component={Screen2}
  />
</Tab.Navigator>
```
