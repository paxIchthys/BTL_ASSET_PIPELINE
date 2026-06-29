import { Animation, Frame, PoseTransform } from "../types";
import { RenderInput, RenderOutput, RenderedSlot } from "../types/resolver";
import { poseLibrary } from "./poseLibrary";

export function findFrame(anim: Animation, frame: number): Frame {
  if (anim.frames.length === 0) {
    throw new Error("Animation has no frames");
  }

  let last = anim.frames[0];

  for (const f of anim.frames) {
    if (f.frame <= frame) {
      last = f;
    }
  }

  return last;
}

export function resolveFrame(input: RenderInput): RenderOutput {
  const frameData = findFrame(input.animation, input.frame);

  const result: RenderOutput = { slots: {} };

  for (const slotId of Object.keys(frameData.slots)) {
    const state = frameData.slots[slotId];
    const kitAsset = input.kit.slots[slotId];

    if (!kitAsset) {
      console.warn(`No asset found for slot: ${slotId}`);
      continue;
    }

    const pose = poseLibrary.getPose(state.pose);
    const transform: PoseTransform = pose?.transform ?? {};

    result.slots[slotId] = {
      assetId: kitAsset.assetId,
      transform: {
        rotation: transform.rotation ?? 0,
        offsetX: transform.offsetX ?? 0,
        offsetY: transform.offsetY ?? 0,
        scale: transform.scale ?? 1
      }
    };
  }

  return result;
}

export function resolveAnimation(input: RenderInput, totalFrames: number): RenderOutput[] {
  const results: RenderOutput[] = [];

  for (let frame = 0; frame <= totalFrames; frame++) {
    results.push(resolveFrame({ ...input, frame }));
  }

  return results;
}
