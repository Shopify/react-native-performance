import React from "react";

interface ListsProfilerController {
  onInteractive: (TTI: number, listName: string) => void;
  onBlankArea: (
    offsetStart: number,
    offsetEnd: number,
    listName: string
  ) => void;
}

export const ListsProfilerContext =
  React.createContext<ListsProfilerController>({
    onInteractive: () => {},
    onBlankArea: () => {},
  });

export const ListsProfilerContextProvider = ListsProfilerContext.Provider;
