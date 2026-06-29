import { Pose } from "../types";
import posesData from "../../data/poses.json";

export class PoseLibrary {
  private poses: Map<string, Pose> = new Map();

  constructor() {
    this.loadFromJSON();
  }

  private loadFromJSON(): void {
    const data = posesData as { poses: Pose[] };
    for (const pose of data.poses) {
      this.poses.set(pose.id, pose);
    }
  }

  getPose(id?: string): Pose | undefined {
    if (!id) return undefined;
    return this.poses.get(id);
  }

  getAllPoses(): Pose[] {
    return Array.from(this.poses.values());
  }

  addPose(pose: Pose): void {
    this.poses.set(pose.id, pose);
  }
}

export const poseLibrary = new PoseLibrary();
