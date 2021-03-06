import { Engine, Scene } from "babylonjs";

import { createSun, createPlanet, createSatellite } from "./planet";
import { setupUI } from "./ui";
// import { UniCam } from "./uni-cam";
import { FollowCam } from "./follow-cam";

import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#solar-system');

let engine = new Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  disableWebGL2Support: false
});

const createPlanets = (scene: Scene) => {
  createPlanet(scene, "mercury", 0.38, 0.4, 0.24, (176 / 365));
  createPlanet(scene, "venus", 1, 0.7, 0.62, (-117 / 365));
  
  const earth = createPlanet(scene, "earth", 1, 1, 1, (1 / 365));
  createSatellite(scene, earth, "luna", 0.27, 0.1, (1/13));
  
  createPlanet(scene, "mars", 0.53, 1.5, 1.88, (1 / 365));
  
  const jupiter = createPlanet(scene, "jupiter", 11, 5.20, 11.86, (0.4 / 365));
  createSatellite(scene, jupiter, "io", 0.29, 0.75, (1.8/365))
  createSatellite(scene, jupiter, "europa", 0.26, 1.2, (3.6/365))
  createSatellite(scene, jupiter, "ganymede", 0.45, 1.6, (7.2/365))
  createSatellite(scene, jupiter, "callisto", 0.41, 2, (16.6/365))

  createPlanet(scene, "saturn", 9, 9.5, 29.46, (0.4 / 365));
  createPlanet(scene, "uranus", 4, 19.2, 84.02, (-0.7 / 365));
  createPlanet(scene, "neptune", 3.5, 30.1, 164.8, (0.7 / 365));
}

const createScene = () => {
  const scene = new Scene(engine);

  // const uniCam =  new UniCam(scene, canvas!) 
  const cam =  new FollowCam(scene, canvas!) 
  setupUI(cam);
  
  const sun = createSun(scene);
  createPlanets(scene);

  cam.setTarget(sun);

  // Just for Debug.
  //@ts-ignore
  window.MyScene = scene;
  
  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => scene.render());

window.addEventListener('resize', () => engine.resize());
