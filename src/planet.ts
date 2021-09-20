import * as BABYLON from "babylonjs";

const frameRate = 10;
const framesInYear = 100;

/**
 * Sets up the specified planet
 * @param scene (BABYLON.Scene) The scene where the planets are rendered.
 * @param planetName (string) The name of the planet. Is used to figure out mesh and id created objects. Make lower case.
 * @param diameter (number) The diameter in Earth radiai
 * @param distanceFromSunInAU (number) Distance from from the sun in AU. 
 * @param orbitalPeriod (number) Orbital period in Earth years
 */
export const createPlanet = (scene: BABYLON.Scene, planetName: string, diameter: number, distanceFromSunInAU: number, orbitalPeriod: number) => {
    const auMultiplier = 10;
    const localDistance = distanceFromSunInAU * auMultiplier;

    const planetMaterial = new BABYLON.StandardMaterial(`${planetName}Material`, scene);
    planetMaterial.emissiveTexture = new BABYLON.Texture(`textures/${planetName}.jpg`, scene);
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    const planet = BABYLON.Mesh.CreateSphere(planetName, 16, diameter, scene, false, BABYLON.Mesh.FRONTSIDE);
    planet.material = planetMaterial;
    
    const orbitMaterial = new BABYLON.StandardMaterial(`${planetName}OrbitRingMaterial`, scene);
    orbitMaterial.emissiveColor = BABYLON.Color3.Gray();
    const orbitRing = BABYLON.MeshBuilder.CreateTorus(`${planetName}OrbitRing`, {
        diameter: localDistance * 2,
        thickness: 0.05,
        tessellation: 64,
        updatable: true
    }, scene);
    orbitRing.material = orbitMaterial;

    const orbitPivot = new BABYLON.TransformNode(`${planetName}Pivot`);
    planet.parent = orbitPivot;
    planet.position.x = localDistance;

    const orbitAnimation = new BABYLON.Animation(`${planetName}Orbit`, "rotation.y", frameRate,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    const totalFramesInAnimation = framesInYear * orbitalPeriod;

    orbitAnimation.setKeys([
        { frame: 0, value: 0 },
        { frame: (totalFramesInAnimation / 2), value: Math.PI },
        { frame: totalFramesInAnimation, value: 2 * Math.PI },
    ]);

    scene.beginDirectAnimation(orbitPivot, [orbitAnimation], 0, totalFramesInAnimation, true);

    //@ts-ignore
    window.MyScene = scene;
};
