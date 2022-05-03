---
id: faq
title: FAQ
slug: /faq
---

### Do we need to wrap every screen with `<PerformanceMeasureView>`? Can we somehow auto-inject it for every screen when configuring the react-navigation navigators?

One maybe tempted to wrap all the screens in their app with the `PerformanceMeasureView` component when setting up a `react-navigation` navigator. Something like this:

```tsx
function withPerformanceMeasureView<TProps>(Screen: (props: TProps) => React.ReactElement, screenName: string) {
  const ProfiledScreen = (props: TProps) => {
    return (
      <PerformanceMeasureView screenName={screenName}>
        <Screen {...props} />
      </PerformanceMeasureView>
    );
  };

  return ProfiledScreen;
}

function NavigationTree() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={NavigationKeys.SCREEN_1}
          component={withPerformanceMeasureView(Screen1, NavigationKeys.SCREEN_1)}
        />
        <Stack.Screen
          name={NavigationKeys.SCREEN_2}
          component={withPerformanceMeasureView(Screen2, NavigationKeys.SCREEN_1)}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

We advise against doing this. Wrapping the screen component like this will mark it as `interactive` the moment that component renders _anything_, including things such as the initial loading indicators. You likely don't want this.

In most scenarios, the subject screen will acquire certain resources, and will render to an "interactive" state after a certain delay. Before the screen is "interactive", it will render an intermediate "non-interactive" state (aka, a loading screen). `PerformanceMeasureView` needs this information via the `interactive: boolean` and `renderPassName: string` props. See the [README](./fundamentals/measuring-render-times#simple-case-at-most-2-render-passes) for more details. Providing this information will allow the library to compute what you probably really care about: the time taken by a screen to _meaningfully_ render and become interactive. A tradeoff with getting this insight is that this process can probably not be automated in most apps. In most apps, one will need to assess the values of the `interactive` and `renderPassName` props on a per-screen basis, based on that screen's resource-acquistion logic.

If, however, you're building a "static" app that renders an interactive version of every screen right away without going through incremental render-passes, then you can probably get away with wrapping all the screens like in the above example. So use your best judgement in that scenario.

### Do we need to invoke the function returned by the useStartProfiler hook manually everytime a screen navigation is scheduled? Can we somehow observe react-navigation events and automate this process?

`react-navigation` emits certain [events](https://reactnavigation.org/docs/navigation-events/) anytime a navigation action is requested. One might wonder if we can somehow observe these events, and automatically notify the profiling library to start performance profiling via the `useStartProfiler` hook. However, we don't want to do this, because doing so will introduce inaccuracies to the output report.

We want to record the "flow start" event as close as possible to when the user actually requested it from the UI. Ideally, this needs to happen when a given native view (e.g., a button) is pressed (option 1). However, it's not possible to do so without providing a custom `ProfiledTouchable` component that needs to be intrusively introduced throughout an app's codebase. Such a custom component would also need to throw away all the benefits (and years of edge-case coverage) put into the stock `Touchable` components, which feels like re-inventing the wheel.

The next best option is to record that event when the JS `Touchable.onPress` callback is invoked (option 2). This is not as accurate as option 1, since it doesn't account for the delay caused by propagating the touch event from the native layer to JS layer over the bridge, and it getting consumed over the JS event queue.

Luckily, `Touchable.onPress` function receives an object of type `GestureResponderEvent` as the 0th argument. This object carries a `nativeEvent.timestamp: number` property. This `timestamp` is the exact time that we needed via option 1. So if you provide this (optional) `GestureResponderEvent` object to the library while using option 2, the library can internally effectively switch over to the option 1 calculations, giving us extremely accurate results. Moreover, we can compute the time between the native touch event and the JS `onPress` invocation to get a sense of how busy the native to JS communication channel is; this is conveyed via the `timeToConsumeTouchEvent` property in the output `RenderPassReports`. This information can provide additional debug info in case you're noticing high `timeToRenderMillis` values.

Observing `react-navigation` events (option 3) means that we're adding a lot more inaccuracies to our calculations. The implementation details of `react-navigation` add a measurable latency between when we call `navigation.navigate` (in the `Touchable.onPress` callbacks in most cases) and when the corresponding react-navigation events are emitted. If you further decouple these two bits of your code bases via another eventing system (e.g., Redux), this latency becomes worse. These latencies are large enough that they make this option a deal breaker for a performance monitoring use-case.

Moreover, these events don't carry the `GestureResponderEvent` objects, so we cannot even reverse engineer when the native view was actually pressed. We investigated how much work it'd take to add a patch to `react-navigation` itself such that the applicable events carry this metadata, however, that was not trivial. For example, the touchable used by the iOS implementation of the drawer navigator (see code [here](https://github.com/react-navigation/react-navigation/blob/7b353a4aeabe204284b358af204caebe1db093c1/packages/drawer/src/views/TouchableItem.ios.tsx)) uses the `BaseButton` component provided by `react-native-gesture-handler`, which does not send a `GestureResponderEvent` object via its `onPress` callback. So implementing this option 3 would require patches into a lot of OSS libraries that we don't necessarily control, and the dependency-graph will be extremely brittle. So considering the maintenance and development effort required for getting option 3 implemented correctly, it didn't make the cut.

That being said, it's understandable that it's error prone (and annoying) to have to make two calls in a `Touchable.onPress` callback: one to schedule the react-navigation action, and the other to notify rn-performance of that event. To help with that, the companion `react-native-performance-navigation` library comes with a [`useProfiledNavigation`](guides/react-native-performance-navigation/profiling-navigation) hook to make this process easier.

### Can we call a function to end the profiler timer in the subject screen, instead of wrapping it in component?

No we cannot. Doing so would end the timer when the JS component renders, which is not the same moment in time as when the screen is actually materialized onto the screen via native views. Wrapping the target screen with a `<PerformanceMeasureView>` allows us to inject an invisible custom view onto the screen (as a sibling of the actual screens' contents), and wait until it gets rendered natively. We use that as an approximation for when the screen was actually rendered. Note that we're still not actually measuring the _real_ views got rendered; but since the injected view is a sibling, this is a fairly good approximation. At least it's significantly better than ending the timer when the JS component renders.
