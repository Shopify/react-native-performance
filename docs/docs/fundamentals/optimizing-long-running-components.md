---
id: optimizing-long-running-components
title: Optimizing Long Running Components
slug: /fundamentals/optimizing-long-running-components
---

The library can only provide you with tripwires that certain screens are not performing as fast as they should. Fixing these issues will need to be done on a case-by-case basis.

However, there is one common category of performance slowdown that is often seen in simple RN apps. If a React component runs for a long time synchronously before returning the renderable JSX, it may cause the navigation to slow down a little.

The `PerformanceMeasureView` can help you optimise such slow navigation animations by delaying the expensive renders until after the animation completes. It can show a lightweight placeholder view while that animation is occuring:

```tsx
<PerformanceMeasureView
  optimizeForSlowRenderComponents
  slowRenderPlaceholder={<View style={{backgroundColor: 'red', flex: 1}} />}
>
  {/* actual screen contents */}
</PerformanceMeasureView>
```

It is highly encouraged to not use this flag blindly, since it can only optimize a very specific kind of perfomance slowdowns. Using it unnecessarily might actually slow things down even further, since you're adding 1 extra lightweight render pass before rendering the real expensive UI. Please visually verify thoroughly and monitor the render-time scores before opting in.

This feature uses a ReactNative [`InteractionManager.runAfterInteractions`](https://reactnative.dev/docs/interactionmanager) call under-the-hood to schedule the real expensive render after all the animations are completed.
