# Godot Export Format Specification

## Overview
This document defines the JSON format for exporting resolved animation data from the BTL Asset Pipeline to Godot.

## Format Structure

```json
{
  "version": "1.0",
  "skeleton": "string",
  "animation": "string",
  "kit": "string",
  "frameRate": number,
  "resolvedFrames": [
    {
      "frame": number,
      "slots": {
        "SLOT_ID": {
          "asset": "string",
          "rotation": number,
          "offsetX": number,
          "offsetY": number,
          "scale": number
        }
      }
    }
  ]
}
```

## Field Descriptions

### Root Level
- `version`: Format version string (currently "1.0")
- `skeleton`: ID of the skeleton used for this animation
- `animation`: ID of the animation
- `kit`: ID of the kit used for asset resolution
- `frameRate`: Target frame rate for playback (e.g., 24, 30, 60)
- `resolvedFrames`: Array of resolved frame data

### Frame Level
- `frame`: Frame number (0-based)
- `slots`: Object mapping slot IDs to resolved slot data

### Slot Level
- `asset`: Asset ID (references sprite sheet region)
- `rotation`: Rotation in degrees (positive = clockwise)
- `offsetX`: X offset in pixels
- `offsetY`: Y offset in pixels
- `scale`: Scale multiplier (1.0 = original size)

## Example

```json
{
  "version": "1.0",
  "skeleton": "dragon_fly",
  "animation": "dragon_fly_walk",
  "kit": "blue_dragonfly",
  "frameRate": 30,
  "resolvedFrames": [
    {
      "frame": 0,
      "slots": {
        "WINGS": {
          "asset": "blue_wing",
          "rotation": -15,
          "offsetX": 0,
          "offsetY": -1,
          "scale": 1.0
        },
        "HEAD": {
          "asset": "blue_head",
          "rotation": 0,
          "offsetX": 0,
          "offsetY": 0,
          "scale": 1.0
        }
      }
    },
    {
      "frame": 5,
      "slots": {
        "WINGS": {
          "asset": "blue_wing",
          "rotation": 25,
          "offsetX": 0,
          "offsetY": 3,
          "scale": 1.0
        },
        "HEAD": {
          "asset": "blue_head",
          "rotation": -10,
          "offsetX": -2,
          "offsetY": 0,
          "scale": 1.0
        }
      }
    }
  ]
}
```

## Godot Integration

### Asset Loading
Assets are loaded from sprite sheets using the asset ID to identify regions. The asset source path in the asset system should include sprite sheet coordinates or region names.

### Animation Playback
Godot should use this data as a data-driven animation system:
1. Load the JSON file
2. Parse the resolvedFrames array
3. For each frame, apply the specified transforms to the corresponding sprite nodes
4. Use frameRate to control playback timing

### Node Structure
Recommended Godot node structure:
```
CharacterRoot (Node2D)
├── WINGS (Sprite2D)
├── HEAD (Sprite2D)
├── BODY (Sprite2D)
├── LEGS (Sprite2D)
└── TAIL (Sprite2D)
```

Each Sprite2D node corresponds to a slot ID and should be named accordingly.

## Notes
- All transforms are relative to the slot's origin point
- Rotation is applied before translation
- Scale is applied after rotation and translation
- Missing slots in a frame should maintain their previous state
