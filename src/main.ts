import * as BABYLON from "babylonjs";

import './style.css'

const frameRate = 10;

const canvas = document.querySelector<HTMLCanvasElement>('#solar-system')!

let engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  disableWebGL2Support: false
});

/**
 * Setts up the specified planet
 * @param scene (BABYLON.Scene) The scene where the planets are rendered.
 * @param planetName (string) The name of the planet. Is used to figure out mesh and id created objects. Make lower case.
 * @param diameter (number) The diameter in Earth radiai
 * @param distanceFromSunInAU (number) Distance from from the sun in AU. 
 * @param orbitalPeriod (number) Orbital period in Earth years
 */
const createPlanet = (scene: BABYLON.Scene, planetName: string, diameter: number, distanceFromSunInAU: number, orbitalPeriod: number) => {
  const auMultiplier = 10;

  const planetMaterial = new BABYLON.StandardMaterial(`${planetName}Material`, scene);
  planetMaterial.emissiveTexture = new BABYLON.Texture(`textures/${planetName}.jpg`, scene);
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  const planet = BABYLON.Mesh.CreateSphere(planetName, 16, diameter, scene, false, BABYLON.Mesh.FRONTSIDE);
  planet.material = planetMaterial;

  const orbitPivot = new BABYLON.TransformNode(`${planetName}Pivot`);
  planet.parent = orbitPivot;
  planet.position.x = distanceFromSunInAU * auMultiplier;

  const orbitAnimation = new BABYLON.Animation(`${planetName}Orbit`, "rotation.y", frameRate, 
    BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  orbitAnimation.setKeys([
    { frame: 0, value: 0},
    { frame: 2 * frameRate, value: Math.PI },
    { frame: 4 * frameRate, value: 2 * Math.PI },
  ]);

  scene.beginDirectAnimation(orbitPivot, [ orbitAnimation ], 0, 4 * frameRate, true);
};

const createPlanets = (scene: BABYLON.Scene) => {
  createPlanet(scene, "mercury", 0.38, 0.4, 0.24);
  createPlanet(scene, "venus", 1, 0.7, 0.615);
  createPlanet(scene, "earth", 1, 1, 1);
  createPlanet(scene, "mars", 0.53, 1.5, 1.88);
}

const createScene = () => {
  console.log("create scene")
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 4, 15, BABYLON.Vector3.Zero(), scene);
  camera.setPosition(new BABYLON.Vector3(0, 30, 0));
  camera.attachControl(canvas, true);

  // Create a basic light, aiming 0, 1, 0 - meaning, to the sky
  //const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

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
