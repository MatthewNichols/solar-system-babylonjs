import { Scene, TransformNode, UniversalCamera, Vector3 } from "babylonjs";

const zoomMultiplier = 0.5;

export class UniCam {
  private camera: UniversalCamera;
  private cameraControl = new TransformNode("cameraControl");

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    this.camera = new UniversalCamera("Camera", new Vector3(0, 100, 0), scene);
    this.camera.setTarget(Vector3.Zero());
    this.camera.inputs.addMouseWheel();
  
    this.camera.attachControl(canvas, true);

    this.camera.parent = this.cameraControl;
    this.cameraControl.position = new Vector3(0, 100, 0);

  }

  setZoom(value: number) {
    this.cameraControl.position.y = value * zoomMultiplier;
  }
}