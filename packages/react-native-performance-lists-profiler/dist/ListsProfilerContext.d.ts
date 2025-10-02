import React from 'react';
interface ListsProfilerController {
    onInteractive: (TTI: number, listName: string) => void;
    onBlankArea: (offsetStart: number, offsetEnd: number, listName: string) => void;
}
export declare const ListsProfilerContext: React.Context<ListsProfilerController>;
export declare const ListsProfilerContextProvider: React.Provider<ListsProfilerController>;
export {};
//# sourceMappingURL=ListsProfilerContext.d.ts.map