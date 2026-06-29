export interface KitSlot {
  assetId: string;
}

export interface Kit {
  id: string;
  slots: Record<string, KitSlot>;
}
