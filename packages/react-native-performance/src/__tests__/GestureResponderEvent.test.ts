import { isGestureResponderEvent } from "../GestureResponderEvent";

describe("GestureResponderEvent", () => {
  describe("isGestureResponderEvent", () => {
    it("returns true if the object contains a number native event timestamp", () => {
      expect(
        isGestureResponderEvent({ nativeEvent: { timestamp: 1234 } })
      ).toBe(true);
    });

    it("returns false if the object does not contain a number native event timestamp", () => {
      expect(isGestureResponderEvent({ nativeEvent: {} })).toBe(false);
      expect(
        isGestureResponderEvent({ nativeEvent: { timestamp: "1234" } })
      ).toBe(false);
      expect(isGestureResponderEvent({ foo: 1234 })).toBe(false);
    });
  });
});
