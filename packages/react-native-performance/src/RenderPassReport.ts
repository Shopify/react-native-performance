export type RenderPassEndInfo =
  | {
      renderPassName: string;
      timeToRenderMillis: number;
      timeToAbortMillis?: never;
      interactive: boolean;
    }
  | {
      renderPassName?: never;
      timeToRenderMillis?: never;
      timeToAbortMillis: number;
      interactive: false;
    };

export type RenderPassStartInfo = {
  flowStartTimeSinceEpochMillis: number;
} & (
  | {
      timeToConsumeTouchEventMillis: number | undefined;
      timeToBootJsMillis?: never;
    }
  | {
      timeToConsumeTouchEventMillis?: never;
      timeToBootJsMillis: number;
    }
);

export interface FlowInfo {
  flowInstanceId: string;
  sourceScreen: string | undefined;
  destinationScreen: string;
}

export interface SnapshotInfo {
  reportId: string;
}

export type RenderPassReport = SnapshotInfo & FlowInfo & RenderPassStartInfo & RenderPassEndInfo;
