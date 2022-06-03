---
id: state-machine
title: State Machine
slug: /fundamentals/state-machine
---

## State Machine

The library models a screen's render pipeline as per the following state machine. This state machine dictates the library's perception of the "world view", and hence influences the API decisions.

![State machine](/img/state-machine.png)

Edit [here](https://docs.google.com/drawings/d/16CE3nvrKAFfg6kVvCRAPzn9gBrs3-g_YaD4ej1MIKho/edit?usp=sharing).

Going by the above state machine, you can see that:

- The state machine starts in the `Started` state.
- The library introduces the idea of a "render pass". A screen may get rendered multiple times. e.g., it may show a loading indicator, followed by rendering only the first half of the screen, followed by rendering the full screen. The library models these incremental steps as different "render passes".
- These render passes may be `interactive` or not. An `interactive` render pass implies that the user is able to interact with the screen after this (e.g., render from cached or network data); a non-interactive render pass means that the user cannot (e.g., loading screen, or only partially rendered screen).
- The library supports multiple incremental render passes, and can cycle through an indefinite number of them.
- The library produces a `RenderPassReport` for every such render pass completion.
  <a name="Aborted-Render-Pass"></a>
- Additionally, the library will also produce a `RenderPassReport` if the screen was unmounted before any render pass was completed with `interactive` set to `true`.
  - This acts as a signal that the user stopped waiting for the screen to become interactive, and decided to back out. This can be used as a signal for user frustration.
  - This report corresponding to the abort scenario will carry a `timeToAbortMillis` property instead of the regular `timeToRenderMillis`.

Although you should not need to use this hook in production, you can monitor the library's internal state transitions (for debugging purposes) via the `useProfilerState` hook. You will notice state transitions similar to the one described in the state diagram.
