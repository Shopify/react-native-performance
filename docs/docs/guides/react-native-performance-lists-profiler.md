---
id: react-native-performance-lists-profiler
title: Lists profiler
sidebar_position: 3
slug: /guides/react-native-performance-lists-profiler
---

# react-native-performance-lists-profiler

This library contains components for profiling [`FlatList`](https://reactnative.dev/docs/flatlist) and [`FlashList`](https://github.com/Shopify/flash-list).

## Installation

You can install the package by running the following command:

```bash
$ yarn add @shopify/react-native-performance-lists-profiler react-native-flipper
```

## ListsProfiler

To profile a given list, you will first need to mount a `<ListsProfiler />` component high in your App tree.
If you want to process the profiling results yourself, two callbacks are available as part of the `ListsProfiler` props - `onInteractive` and `onBlankArea`.

Example usage:

```tsx
import {ListsProfiler} from '@shopify/react-native-performance-lists-profiler';

const App = () => {
  const onInteractiveCallback = useCallback((TTI: number, listName: string) => {
    console.log(`${listName}'s TTI: ${TTI}`);
  }, []);

  const onBlankAreaCallback = useCallback((offsetStart: number, offsetEnd: number, listName: string) => {
    console.log(`Blank area for ${listName}: ${Math.max(offsetStart, offsetEnd)}`);
  }, []);

  return (
    <>
      <ListsProfiler onInteractive={onInteractiveCallback} onBlankArea={onBlankAreaCallback}>
        <NavigationTree />
      </ListsProfiler>
    </>
  );
};
```

### onInteractive

`onInteractive` is triggered when the profiled list becomes interactive.

The callback has the following parameters:

- `TTI`: represents time-to-interactive. It is computed as the difference between timestamp of when the component gets first mounted and the first frame where the first page of list is completely rendered.
- `listName`: name of the list defined in the `FlatListPerformanceView`

**Note**: The list will not report `onInteractive` if the cells do not fill the whole frame of the list. This is a known issue and something we will try to fix.

### onBlankArea

`onBlankArea` is called on each frame the list is scrolled - even if there is currently no blank space.

It has the following parameters:

- `offsetStart`: visible blank space on top of the screen (while going up). If value is greater than 0, it's visible to user.
- `offsetEnd`: visible blank space at the end of the screen (while going down). If value is greater than 0, it's visible to user.
- `blankArea`: value is greater or equal to zero and the maximum of `offsetStart` and `offsetEnd`. This will usually depend on the direction user is scrolling in.

## FlatListPerformanceView

`FlatListPerformanceView` is a component used to profile a specific instance of a `FlatList`:

```tsx
<FlatListPerformanceView listName="FlatList">
  <FlatList
    keyExtractor={...}
    renderItem={...}
    data={data}
  />
</FlatListPerformanceView>
```

`listName` prop will be used in the callbacks `onInteractive` and `onBlankArea`. You can also use both of these callbacks directly on the `FlatListPerformanceView` if you don't want to use the `ListsProfiler` component.

## FlashListPerformanceView

`FlashListPerformanceView` is a component used to profile a specific instance of a `FlashList` and its API is the same as `FlatListPerformanceView`:

```tsx
<FlashListPerformanceView listName="FlashList">
  <FlashList
    keyExtractor={...}
    renderItem={...}
    data={data}
  />
</FlashListPerformanceView>
```
