import * as BABYLON from "babylonjs";

import './style.css'

const canvas = document.querySelector<HTMLCanvasElement>('#solar-system')!

let engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  disableWebGL2Support: false
});

//let scene = null;
//let sceneToRender = null;

const createScene = () => {
  console.log("create scene")
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 4, 15, BABYLON.Vector3.Zero(), scene);
  //camera.setTarget(BABYLON.Vector3.Zero());
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
  
  const mercuryMaterial = new BABYLON.StandardMaterial("mercuryMaterial", scene);
  mercuryMaterial.emissiveTexture = new BABYLON.Texture("textures/mercury.jpg", scene);
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  const mercury = BABYLON.Mesh.CreateSphere('mercury', 16, 0.5, scene, false, BABYLON.Mesh.FRONTSIDE);
  mercury.material = mercuryMaterial;

  mercury.parent = sun;
  mercury.position.x = 5;


  return scene;
}

const scene = createScene();

engine.runRenderLoop(() => scene.render());

window.addEventListener('resize', () => engine.resize());
