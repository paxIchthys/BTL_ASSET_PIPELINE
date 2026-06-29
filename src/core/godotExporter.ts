import { Animation, Kit } from "../types";
import { resolveAnimation } from "./resolver";
import { GodotExportData } from "../types/godot";

export interface GodotExportInput {
  animation: Animation;
  kit: Kit;
  frameRate?: number;
}

export function exportToGodot(input: GodotExportInput): GodotExportData {
  const { animation, kit, frameRate = 30 } = input;

  const maxFrame = animation.frames.length > 0
    ? animation.frames[animation.frames.length - 1].frame
    : 0;

  const resolvedFrames = resolveAnimation(
    { animation, kit, frame: 0 },
    maxFrame
  );

  const godotFrames = resolvedFrames.map((rendered, index) => ({
    frame: index,
    slots: Object.fromEntries(
      Object.entries(rendered.slots).map(([slotId, slot]) => [
        slotId,
        {
          asset: slot.assetId,
          rotation: slot.transform.rotation ?? 0,
          offsetX: slot.transform.offsetX ?? 0,
          offsetY: slot.transform.offsetY ?? 0,
          scale: slot.transform.scale ?? 1
        }
      ])
    )
  }));

  return {
    version: "1.0",
    skeleton: animation.skeleton,
    animation: animation.id,
    kit: kit.id,
    frameRate,
    resolvedFrames: godotFrames
  };
}

export function exportToGodotJSON(input: GodotExportInput): string {
  const data = exportToGodot(input);
  return JSON.stringify(data, null, 2);
}
