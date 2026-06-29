export interface SlotState {
  pose?: string;
}

export interface Frame {
  frame: number;
  slots: Record<string, SlotState>;
}

export interface Animation {
  id: string;
  skeleton: string;
  frames: Frame[];
}
