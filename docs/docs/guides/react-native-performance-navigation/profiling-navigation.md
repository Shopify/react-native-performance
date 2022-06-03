---
id: profiling-navigation
title: Simplified Navigation Profiling
slug: /guides/react-native-performance-navigation/profiling-navigation
---

## useProfiledNavigation

As mentioned in the [react-native-performance docs](../../fundamentals/measuring-render-times), you can start profiling the render times corresponding to a navigation flow via the use of `useStartProfiler` hook. However, this often means that you need to make two calls to start the navigation process:

1. Notify the library of the flow start via the `useStartProfiler` hook
2. Notify the navigation library of your choice that you're requesting a navigation to a given destination screen

If you use [react-navigation](https://reactnavigation.org/), we provide a simple wrapper API that can combine these two calls into a single call. Using this wrapper `useProfiledNavigation` hook over the raw `useNavigation` hook might help you ensure that all the navigation flows in your app have profiler coverage:

```tsx
const ScreenA = ({navigation}) => {
  const profiledNavigation = useProfiledNavigation();

  return (
    <>
      {/* some JSX */}
      <TouchableWithoutFeedback
        onPress={uiEvent => {
          profiledNavigation.navigate({source: 'ScreenA', uiEvent}, 'ScreenB');
        }}
      />
    </>
  );
};
```

In the above example, the first argument to `profiledNavigation.navigate` is funneled to the `startProfiler` function (returned by the `useStartProfiler` hook), while the rest of the varargs are sent to the internal `navigation.navigate` call.
