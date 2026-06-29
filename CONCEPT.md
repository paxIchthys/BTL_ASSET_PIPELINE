🧠 PROJECT: Modular 2D Animation Composition System (Animate → Godot)
Goal

Build a TypeScript-based animation composition engine that:

Uses Adobe Animate (FLA) as the authoring tool for animations and assets
Exports structured animation data (NOT pixel data)
Combines:
Skeletons
Animations (sequences)
Poses (semantic motion states)
Kits (asset mappings)
Renders previews in a web-based TypeScript canvas tool
Exports final resolved data for Godot
🧩 Core Concept

We are NOT building sprite animation.

We are building:

semantic slot-based animation with pose-driven transforms and kit-based visual resolution

🧱 Core Architecture
1. Skeleton Layer (structure definition)

Defines slots available on a creature.

// skeleton.ts
export type SlotId =
  | "HEAD"
  | "BODY"
  | "WINGS"
  | "LEGS"
  | "ARMS"
  | "TAIL";

export interface Skeleton {
  id: string; // e.g. "dragon_fly"
  slots: SlotId[];
}
2. Pose System (motion definition)

A pose defines how a slot behaves visually.

// pose.ts
export interface PoseTransform {
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
}

export interface Pose {
  id: string; // e.g. "flap_up"
  transform: PoseTransform;
}
3. Animation System (timeline of semantic states)

Animations define when slot states change, NOT pixel positions.

// animation.ts
export interface SlotState {
  pose?: string; // reference to Pose.id
}

export interface Frame {
  frame: number;
  slots: Record<string, SlotState>;
}

export interface Animation {
  id: string; // e.g. "dragon_fly_walk"
  skeleton: string;
  frames: Frame[];
}
4. Kit System (visual mapping)

Kits map semantic slots → actual assets.

// kit.ts
export interface Kit {
  id: string;

  slots: Record<
    string,
    {
      assetId: string;
    }
  >;
}

Example:

{
  id: "blue_dragonfly",
  slots: {
    WINGS: { assetId: "blue_wing" },
    HEAD: { assetId: "blue_head" }
  }
}
5. Asset System
// asset.ts
export interface Asset {
  id: string;
  source: string; // path to SVG or vector symbol exported from Animate
}
🔄 Resolver Engine (CORE LOGIC)

This is the heart of the system.

// resolver.ts

export interface RenderInput {
  animation: Animation;
  kit: Kit;
  frame: number;
}

export interface RenderedSlot {
  assetId: string;
  transform: PoseTransform;
}

export interface RenderOutput {
  slots: Record<string, RenderedSlot>;
}

export function resolveFrame(input: RenderInput): RenderOutput {
  const frameData = findFrame(input.animation, input.frame);

  const result: RenderOutput = { slots: {} };

  for (const slotId of Object.keys(frameData.slots)) {
    const state = frameData.slots[slotId];

    const pose = getPose(state.pose);
    const kitAsset = input.kit.slots[slotId];

    result.slots[slotId] = {
      assetId: kitAsset.assetId,
      transform: pose?.transform ?? {}
    };
  }

  return result;
}
🎨 Pose Library
export const PoseLibrary: Record<string, Pose> = {
  flap_up: {
    id: "flap_up",
    transform: {
      rotation: 25,
      offsetY: 3
    }
  },

  flap_down: {
    id: "flap_down",
    transform: {
      rotation: -15,
      offsetY: -1
    }
  }
};

export function getPose(id?: string): Pose | undefined {
  if (!id) return undefined;
  return PoseLibrary[id];
}
🪄 Animation Frame Lookup
export function findFrame(anim: Animation, frame: number): Frame {
  let last = anim.frames[0];

  for (const f of anim.frames) {
    if (f.frame <= frame) last = f;
  }

  return last;
}
🖥️ Preview App (IMPORTANT)

Build a React + Canvas renderer that:

Features:
timeline scrubber
skeleton selector
kit selector
live frame preview
slot debug overlay
Stack:
React
TypeScript
Canvas2D (NOT Godot)
📦 Adobe Animate Integration (JSFL EXPORT)

Create a JSFL script that exports:

{
  "animation": {
    "id": "dragon_fly_walk",
    "skeleton": "dragon_fly",
    "frames": [
      {
        "frame": 10,
        "slots": {
          "WINGS": {
            "pose": "flap_up"
          }
        }
      }
    ]
  }
}

Rules:

Only export semantic data (NO coordinates)
Use frame labels or layer naming conventions:
WINGS:flap_up
HEAD:tilt_left
🎮 Godot Export Format

Output:

{
  "skeleton": "dragon_fly",
  "animation": "walk",
  "resolvedFrames": [
    {
      "frame": 10,
      "slots": {
        "WINGS": {
          "asset": "blue_wing",
          "rotation": 25,
          "offsetY": 3
        }
      }
    }
  ]
}

Godot uses this as a data-driven animation driver, not a bone system.

🚀 MVP BUILD PLAN (DO THIS FIRST)
Phase 1 (core engine)
 Skeleton model
 Pose system
 Kit system
 Resolver function
Phase 2 (preview tool)
 React canvas renderer
 frame scrubber
 kit switcher
 debug overlay
Phase 3 (Animate export)
 JSFL exporter
 frame annotation system
 JSON export
Phase 4 (Godot export)
 convert resolved frames → JSON
 simple importer script
⚠️ IMPORTANT CONSTRAINTS
NEVER bake pixels into animation
NEVER store transforms as final truth in Animate
Kits are ONLY mappings
Pose system is shared globally
Animation only defines:
slot state
pose selection
timing
🧠 ONE-LINE SUMMARY

Animate defines when things change
Pose defines how things move
Kit defines what things look like
Engine resolves everything into final frames