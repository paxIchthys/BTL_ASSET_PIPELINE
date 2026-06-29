import { Animation, Kit } from "./index";

export interface RenderInput {
  animation: Animation;
  kit: Kit;
  frame: number;
}

export interface RenderedSlot {
  assetId: string;
  transform: {
    rotation?: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
  };
}

export interface RenderOutput {
  slots: Record<string, RenderedSlot>;
}
