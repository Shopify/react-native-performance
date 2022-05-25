---
id: measuring-render-times
title: Measuring Render Time
slug: /fundamentals/measuring-render-times
---

There are three kinds of render times that you can measure using the library:

<ol>
  <li>App startup render time
    <ul>
      <li>The timer starts when the native portion of the app is started</li>
      <li>The timer is stopped when the first screen in the app is mounted and fully rendered</li>
    </ul>
  </li>
  <li>Navigation render time
    <ul>
      <li>Timer starts when some `Touchable` is pressed on screen A</li>
      <li>The app navigates to screen B</li>
      <li>The timer is stopped when the screen B is mounted and is fully rendered</li>
    </ul>
  </li>
  <li>Screen re-render time
    <ul>
      <li>Timer starts when a certain UI event occurs on a screen (say pull-to-refresh)</li>
      <li>Stuff happens on the screen (e.g., network calls)</li>
      <li>The timer is stopped when the screen is fully rendered again</li>
    </ul>
  </li>
</ol>

## 1. Measuring app startup render time <a name="measuring-app-startup-render-time"></a>

The timer for this measurement was already started when you did the [Android and iOS](./getting-started) initializations.

For ending the timer, you first need to identify the screens in your app that the the user can arrive at on startup. These screens must be _interactable_ by the user (i.e., probably don't want splash screens here). If your app has a "home" screen, that is probably it. If your app has a "welcome" or "login" screen when no user is logged in, that qualifies too. If you can deep link into various screens in the app via widgets or notifications, they all count as well.

Then, wrap the returned JSX of _all_ of those screens' components with an `PerformanceMeasureView`. e.g.:

```tsx
const HomeScreen = () => {
    const {data} = useQuery(...)
    const homeItems = data?.homeItems

    return (
        <PerformanceMeasureView interactive={homeItems !== undefined} screenName="HomeScreen">
            {
              homeItems === undefined
                ? <LoadingIndicator /> : <HomeListView items={homeItems}/>
            }
        </PerformanceMeasureView>
    )
}
```

The library will automatically recognize the very first `PerformanceMeasureView` that gets rendered in the app, and interpret it as the main landing screen on startup. It then waits for the native UI view of this screen to get rendered, and generates a `RenderPassReport` as the output.

### Simple case: at most 2 render passes<a name="simple-case-at-most-2-render-passes"></a>

Most screens go through 2 render passes:

1. a loading indicator (incremental render pass)
2. the final rendered screen (final render pass)

As described in the [state machine](#State-Machine) section before, you need to tell the library about these render passes. In the above example, you're doing so via the `interactive` prop. When `homeItems === undefined`, you're setting `interactive = false`, telling the state machine that the render pass showing a `LoadingIndicator` to the user is not an interactive one. The final render pass is only made when the `homeItems` are fetched, and the `interactive` property is set to `true`. The library will include this `interactive` property for the reports that it generates for these two render passes.

If your screen is a static screen that does not go through a loading render pass, you can directly set `interactive: true` (defaults to `false`).

### Advanced case: More than 2 render passes

The above example assumes that you want to stop profiling the moment the screen is meaningfully rendered once the `homeItems` are available. If your `fetchPolicy` for the `useQuery` call was `cache-and-network`, this could imply that the profiler will stop the moment the screen gets meaningfully rendered from cached data. Any subsequent re-renders of the screen (e.g., when the network response arrives) will not produce any reports, since the `interactive` property did not change. That might be okay for certain use cases, since it rewards you for benefitting from cache to give the users a faster experience. However, you still might want to record _both_ the cached render times, and the full network render times. This tri-render-pass scenario cannot be captured via a single boolean `interactive` prop. In this case, you can model your screen to have 3 render passes:

1. a loading indicator (non-interactive render pass)
2. cached render (interactive render pass)
3. network render (another interactive render pass)

You can disambiguate between the two interactive render passes by providing explicit names to them via the (optional) `renderPassName` prop.

In fact, setting `interactive={true}` is equivalent to setting `interactive={true} renderPassName="interactive"`, while setting `interactive ={false}` is equivalent to setting `interactive={false} renderPassName="loading"`. The library uses sane render pass name defaults when just the `interactive` prop is provided.

## 2. Measuring Navigation Render Times <a name="Measuring-Navigation-Render-Times"></a>

The timer for this use case starts when a `Touchable` on some `ScreenA` is pressed, and a `navigate` call to `ScreenB` is invoked. You can do so via the `useStartProfiler` hook.

```tsx
const ScreenA = ({navigation}) => {
  const startNavigationTTITimer = useStartProfiler();

  return (
    <>
      {/* some JSX */}
      <TouchableWithoutFeedback
        onPress={uiEvent => {
          startNavigationTTITimer({
            source: 'ScreenA',
            uiEvent,
          });
          navigation.navigate('ScreenB');
        }}
      />
    </>
  );
};
```

Just like before, you wrap the target `ScreenB` with an `PerformanceMeasureView` to end the timer. All the concepts relating to the multiple render passes from the previous sections are also applicable to this use case.

_Note that the companion libraries to this package--[performance-react-navigation-base](../guides/react-native-performance-navigation/getting-started.md), [performance-react-navigation-drawer](../guides/react-native-performance-navigation/react-native-performance-navigation-drawer.md), [performance-react-navigation-bottom-tabs](../guides/react-native-performance-navigation/react-native-performance-navigation-bottom-tabs.md)--come with some handy utilities like `createProfiledBottomTabNavigator` and `useProfiledNavigation`. These utilities make the process of starting the navigation render timer slightly less verbose. You might want to check them out in case they work for your use case._

## 3. Measuring Screen Re-render times

The screen re-render starts when a certain UI event within the current screen causes the screen to be re-painted. Think of scenarios such as pull-to-refresh in a list screen or a change in the query term in a search screen.

This time instead of `useStartProfiler` hook you need to use `useResetFlow` hook. This hook requires passing a `destination` prop to identify which screen is being re-painted. By default, the `sourceScreen` is the same as the `destinationScreen`, implying that the user triggered the re-paint from the same screen as the one being re-painted. You can optionally use a different `sourceScreen` if that's not the case; for example, if the re-paint is being triggered by a button in a modal or a different tab.

Using `useResetFlow` also requires you to pass `componentInstanceId` to `PerformanceMeasureView`/`ReactNavigationPerformanceView`. This allows the library to match the restarted flow with the corresponding `MeasureView`:

```tsx
const HomeScreen = () => {
  const {resetFlow, componentInstanceId} = useResetFlow();

  const {data, refetch, networkStatus} = useQuery(...)
  const homeItems = data?.homeItems

  const renderStateProps: RenderStateProps = {
    interactive: data !== undefined,
    renderPassName: data === undefined ? 'loading' : (isNetworkRequestInFlight(networkStatus) ? 'cached_render' : 'network_render')
  }

  return (
    <PerformanceMeasureView componentInstanceId={componentInstanceId} screenName="HomeScreen" {...renderStateProps}>
      <FlatList
        { /* configure your FlatList */ }
        onRefresh={() => {
          resetFlow({
            destination: 'ScreenA'
          })
          refetch()
        }}
      />
    </PerformanceMeasureView>
  )
}
```

This use-case is similar to the previous navigation one, except that you start and end the render timer on the same screen. There is no navigation involved. Hence, the same screen contains both the start call via the `useResetFlow` hook, and the end call via the `PerformanceMeasureView` component usage.

The above example also showcases how you can use the `renderPassName` prop for representing these complex render-pass scenarios.

## Calculating TTI from render times

A profiled screen may re-render multiple times. As a result, the library may generate multiple `RenderPassReports`. However, a screen can be considered to reach interactivity when the library emits the first `RenderPassReport` with the `interactive` property set to `true`. You can interpret the `timeToRender` for that render pass to also be the time-to-interactive (TTI).
