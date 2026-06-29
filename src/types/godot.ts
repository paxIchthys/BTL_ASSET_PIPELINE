export interface GodotSlotTransform {
  asset: string;
  rotation: number;
  offsetX: number;
  offsetY: number;
  scale: number;
}

export interface GodotFrame {
  frame: number;
  slots: Record<string, GodotSlotTransform>;
}

export interface GodotExportData {
  version: string;
  skeleton: string;
  animation: string;
  kit: string;
  frameRate: number;
  resolvedFrames: GodotFrame[];
}
