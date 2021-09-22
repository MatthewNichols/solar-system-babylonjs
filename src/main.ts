import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";

import { createSun, createPlanet } from "./planet";
import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#solar-system');

let engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  disableWebGL2Support: false
});

const createPlanets = (scene: BABYLON.Scene) => {
  createPlanet(scene, "mercury", 0.38, 0.4, 0.24);
  createPlanet(scene, "venus", 1, 0.7, 0.62);
  createPlanet(scene, "earth", 1, 1, 1);
  createPlanet(scene, "mars", 0.53, 1.5, 1.88);
  
  createPlanet(scene, "jupiter", 11, 5.20, 11.86);
  createPlanet(scene, "saturn", 9, 9.5, 29.46);
  createPlanet(scene, "uranus", 4, 19.2, 84.02);
  createPlanet(scene, "neptune", 3.5, 30.1, 164.8);
}

const createCamera = (scene: BABYLON.Scene) => {
  const camera = new BABYLON.UniversalCamera("Camera", new BABYLON.Vector3(0, 100, 0), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.inputs.addMouseWheel();
  
  camera.attachControl(canvas, true);
  
  return camera;
}

const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  const camera = createCamera(scene);
  const cameraControl = new BABYLON.TransformNode("cameraControl");
  camera.parent = cameraControl;
  cameraControl.position = new BABYLON.Vector3(0, 100, 0);

  const uiLayer = GUI.AdvancedDynamicTexture.CreateFullscreenUI("Controls");
  const zoomInButton = GUI.Button.CreateSimpleButton("ZoomIn", "+");
  zoomInButton.height = "60px";
  zoomInButton.width = "60px";
  zoomInButton.fontSizeInPixels = 60;
  zoomInButton.cornerRadius = 1000;
  zoomInButton.background = "white";
  zoomInButton.scaleX = 1;
  zoomInButton.scaleY = 1;
  uiLayer.addControl(zoomInButton);
  zoomInButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  zoomInButton.onPointerUpObservable.add(() => {
    cameraControl.position.y = cameraControl.position.y - 30;
  })

  createSun(scene);
  createPlanets(scene);

  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => scene.render());

window.addEventListener('resize', () => engine.resize());
