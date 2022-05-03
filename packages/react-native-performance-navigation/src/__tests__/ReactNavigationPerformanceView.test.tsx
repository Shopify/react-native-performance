import React from "react";
import { View } from "react-native";
import {
  PerformanceMeasureView,
  useStateController,
} from "@shopify/react-native-performance";

import { ReactNavigationPerformanceView } from "../ReactNavigationPerformanceView";
import type { Props } from "../ReactNavigationPerformanceView";

import { mountWithReactNavigationPerformanceContext } from "./mountWithReactNavigationPerformanceContext";

const LOADING = "loading";
const INTERACTIVE_NETWORK = "interactive-network";
const INTERACTIVE_DATABASE = "interactive-database";
const TRANSITION_END = "transition-end";

const isFocusMock = jest.fn() as jest.Mock<boolean>;

/**
 * Mount `ReactNavigationPerformanceView`.
 * @param navigationType: react-navigation's type of navigation.
 */
const mountReactNavigationPerformanceView = (
  props: Partial<Pick<Props, "screenName" | "interactive" | "renderPassName">>,
  navigationType: "stack" | "tab" | "drawer" = "stack"
) => {
  const { triggerTransitionEnd, addListener } = createAddListenerMock();
  const wrapper = mountWithReactNavigationPerformanceContext(
    <ReactNavigationPerformanceView
      screenName="SomeScreen"
      interactive
      {...props}
    >
      <View />
    </ReactNavigationPerformanceView>,
    {
      navigation: {
        addListener,
        getState: jest.fn(() => ({
          type: navigationType,
        })),
        isFocused: isFocusMock,
      },
    }
  );

  return { wrapper, triggerTransitionEnd };
};

const useStateControllerMock = useStateController as jest.Mock;
jest.mock("@shopify/react-native-performance", () => {
  return {
    ...jest.requireActual("@shopify/react-native-performance"),
    useStateController: jest.fn(),
  };
});

/**
 * Creates a listener mock that is injected when a subject wants to start a listening for a given event.
 */
const createAddListenerMock = () => {
  const transitionEndListeners: (() => void)[] = [];
  const triggerTransitionEnd = () => {
    transitionEndListeners.forEach((transitionEndListener) =>
      transitionEndListener()
    );
  };

  const addListener = jest
    .fn()
    .mockImplementation((listener: string, callback: () => void) => {
      if (listener === "transitionEnd") {
        transitionEndListeners.push(callback);
      }
      return () => {
        transitionEndListeners.filter((cb) => cb !== callback);
      };
    });

  return { triggerTransitionEnd, addListener };
};

describe("ReactNavigationPerformanceView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when screen is interactive on mount", () => {
    it("stops current flow in the state controller if focused", () => {
      const stopFlowIfNeededMock = jest.fn();
      useStateControllerMock.mockReturnValue({
        stopFlowIfNeeded: stopFlowIfNeededMock,
      });

      isFocusMock.mockReturnValueOnce(true);
      mountReactNavigationPerformanceView({
        renderPassName: LOADING,
        interactive: true,
      });

      expect(stopFlowIfNeededMock).toHaveBeenCalledTimes(1);
    });

    it("does not stop the current flow in the state controller if not focused", () => {
      const stopFlowIfNeededMock = jest.fn();
      useStateControllerMock.mockReturnValue({
        stopFlowIfNeeded: stopFlowIfNeededMock,
      });

      isFocusMock.mockReturnValueOnce(false);
      mountReactNavigationPerformanceView({
        renderPassName: LOADING,
        interactive: true,
      });

      expect(stopFlowIfNeededMock).not.toHaveBeenCalled();
    });

    it("triggers two render passes: one for initial interactive, the next after transitionEnd event", () => {
      const { wrapper, triggerTransitionEnd } =
        mountReactNavigationPerformanceView({
          renderPassName: LOADING,
          interactive: true,
        });

      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        // Interactive is set to false until `transitionEnd` event occurs
        interactive: false,
        renderPassName: LOADING,
      });

      wrapper.act(() => {
        triggerTransitionEnd();
      });

      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        interactive: true,
        renderPassName: TRANSITION_END,
      });
    });
  });

  describe("when transitionEnd event fires before user sets screen interactive", () => {
    it("shows final renderPass after transitionEnd", () => {
      const { wrapper, triggerTransitionEnd } =
        mountReactNavigationPerformanceView({
          renderPassName: LOADING,
          interactive: false,
        });

      // Screen queries data, so is loading on mount
      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: LOADING,
        interactive: false,
      });

      wrapper.act(() => {
        triggerTransitionEnd();
      });

      // Screen finishes navigation transition
      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: TRANSITION_END,
        interactive: false,
      });

      // Screen updates with network response
      wrapper.setProps({
        renderPassName: INTERACTIVE_NETWORK,
        interactive: true,
      });
      // The final event is recorded
      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: INTERACTIVE_NETWORK,
        interactive: true,
      });
    });
  });

  describe("when there is a render with the same name after transition-end", () => {
    it("it does not change the renderPassName", () => {
      const { wrapper, triggerTransitionEnd } =
        mountReactNavigationPerformanceView({
          renderPassName: LOADING,
          interactive: false,
        });

      // Screen queries data, so is loading on mount
      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: LOADING,
        interactive: false,
      });

      wrapper.act(() => {
        triggerTransitionEnd();
      });

      // Screen finishes navigation transition
      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: TRANSITION_END,
        interactive: false,
      });

      // Screen re-renders with the same renderPassName as before transition ended
      // This signals the renderPassName is simply reused and we should not change it.
      wrapper.setProps({ renderPassName: LOADING, interactive: false });
      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: TRANSITION_END,
        interactive: false,
      });
    });
  });

  describe("when navigation type is tab", () => {
    it("sets interactive to true without transitionEnd event", () => {
      const { wrapper } = mountReactNavigationPerformanceView(
        {
          renderPassName: LOADING,
          interactive: false,
        },
        "tab"
      );

      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: LOADING,
        interactive: false,
      });

      // Screen updates with local data
      wrapper.setProps({
        renderPassName: INTERACTIVE_DATABASE,
        interactive: true,
      });

      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: INTERACTIVE_DATABASE,
        interactive: true,
      });
    });
  });

  describe("when navigation type is drawer", () => {
    it("sets interactive to true without transitionEnd event", () => {
      const { wrapper } = mountReactNavigationPerformanceView(
        {
          renderPassName: LOADING,
          interactive: false,
        },
        "drawer"
      );

      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: LOADING,
        interactive: false,
      });

      // Screen updates with local data
      wrapper.setProps({
        renderPassName: INTERACTIVE_DATABASE,
        interactive: true,
      });

      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: INTERACTIVE_DATABASE,
        interactive: true,
      });
    });
  });

  describe("when screen is interactive from the start", () => {
    it("sets transition-end as the last `renderPassName`", () => {
      const { wrapper, triggerTransitionEnd } =
        mountReactNavigationPerformanceView({
          interactive: true,
        });

      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        // The default `renderPassName` is passed only to `PerformanceMarker` which we cannot access from here
        renderPassName: undefined,
        interactive: false,
      });

      wrapper.act(() => {
        triggerTransitionEnd();
      });

      expect(wrapper).toContainReactComponent(PerformanceMeasureView, {
        renderPassName: TRANSITION_END,
        interactive: true,
      });
    });
  });
});
