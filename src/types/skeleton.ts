export type SlotId =
  | "HEAD"
  | "BODY"
  | "WINGS"
  | "LEGS"
  | "ARMS"
  | "TAIL";

export interface Skeleton {
  id: string;
  slots: SlotId[];
}
