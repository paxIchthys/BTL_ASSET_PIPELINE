export interface PoseTransform {
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
}

export interface Pose {
  id: string;
  transform: PoseTransform;
}
