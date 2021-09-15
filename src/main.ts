import * as BABYLON from "babylonjs";
import { createPlanet } from "./planet";
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
}

const createScene = () => {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 4, 15, BABYLON.Vector3.Zero(), scene);
  camera.setPosition(new BABYLON.Vector3(0, 30, 0));
  camera.attachControl(canvas, true);

  const sunMaterial = new BABYLON.StandardMaterial("sun", scene);
  sunMaterial.emissiveTexture = new BABYLON.Texture("textures/sun.jpg", scene);
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  const sun = BABYLON.Mesh.CreateSphere('sun', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
  sun.material = sunMaterial;

  // Move the sphere upward 1/2 of its height
  sun.position.y = 1;
  
  createPlanets(scene);

  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => scene.render());

window.addEventListener('resize', () => engine.resize());
