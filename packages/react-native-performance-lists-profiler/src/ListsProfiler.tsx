import React, { useCallback } from "react";
import { Flipper, addPlugin } from "react-native-flipper";

import { ListsProfilerContextProvider } from "./ListsProfilerContext";
import ListsProfilerProps from "./ListsProfilerProps";

const bootstrapPlugin = (): Promise<Flipper.FlipperConnection> => {
  return new Promise((resolve) => {
    addPlugin({
      getId: () => "@shopify/react-native-performance",
      onConnect: (connection) => {
        return resolve(connection);
      },
      onDisconnect: () => {},
      runInBackground: () => true,
    });
  });
};

/**
 * Wrap your app with this component to get events from all the lists wrapped with their performance view.
 * For example, `FlatList` must be wrapped in the `FlatListPerformanceView`.
 */
const ListsProfiler = ({
  onInteractive = () => {},
  onBlankArea = () => {},
  children,
}: ListsProfilerProps) => {
  let connection: Flipper.FlipperConnection | undefined;
  bootstrapPlugin()
    .then((conn) => {
      connection = conn;
    })
    .catch((error) => {
      throw error;
    });

  const onInteractiveCallback = useCallback(
    (TTI: number, listName: string) => {
      onInteractive(TTI, listName);
      connection?.send("newListTTIData", {
        TTI,
        listName,
      });
    },
    [connection, onInteractive]
  );
  const onBlankAreaCallback = useCallback(
    (offsetStart: number, offsetEnd: number, listName: string) => {
      onBlankArea(offsetStart, offsetEnd, listName);
      const blankArea = Math.max(Math.max(offsetStart, offsetEnd), 0);
      connection?.send("newBlankData", {
        offset: blankArea,
        listName,
      });
    },
    [connection, onBlankArea]
  );
  return (
    <ListsProfilerContextProvider
      value={{
        onInteractive: onInteractiveCallback,
        onBlankArea: onBlankAreaCallback,
      }}
    >
      {children}
    </ListsProfilerContextProvider>
  );
};

export default ListsProfiler;
