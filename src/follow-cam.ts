import { FollowCamera, Mesh, Scene, Vector3 } from "babylonjs";

export class FollowCam {
  private camera: FollowCamera;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.camera = new FollowCamera("Camera", new Vector3(0, 100, 0), scene);
    this.camera.radius = 100;
    this.camera.attachControl(true);
  }

  setTarget(target: Mesh) {
    this.camera.lockedTarget = target;
  }

  setZoom(value: number) {
    this.camera.radius = value;
  }
}