import * as BABYLON from "babylonjs";

const frameRate = 10;
const framesInYear = 365;

export const createSun = (scene: BABYLON.Scene) => {
    const sunMaterial = new BABYLON.StandardMaterial("sun", scene);
    sunMaterial.emissiveTexture = new BABYLON.Texture("textures/sun.jpg", scene);
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    const sun = BABYLON.Mesh.CreateSphere('sun', 16, 2, scene, false, BABYLON.Mesh.FRONTSIDE);
    sun.material = sunMaterial;
  
    // Move the sphere upward 1/2 of its height
    sun.position.y = 1;  
};

interface PlanetInstance {
    mesh: BABYLON.Mesh;
}

/**
 * Sets up the specified planet
 * @param scene (BABYLON.Scene) The scene where the planets are rendered.
 * @param planetName (string) The name of the planet. Is used to figure out mesh and id created objects. Make lower case.
 * @param diameter (number) The diameter in Earth radiai
 * @param distanceFromSunInAU (number) Distance from from the sun in AU. 
 * @param orbitalPeriod (number) Orbital period in Earth years
 * @param rotationPeriod (number) Rotation period (length of day) in Earth years
 */
export const createPlanet = (scene: BABYLON.Scene, planetName: string, diameter: number, distanceFromSunInAU: number, orbitalPeriod: number, rotationPeriod: number = 0): PlanetInstance => {
    //Eventually I can add in actual historical positions
    const initialPosition = Math.random() * 2 * Math.PI;
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

    const totalFramesInOrbitAnimation = framesInYear * orbitalPeriod;

    const orbitAnimation = new BABYLON.Animation(`${planetName}Orbit`, "rotation.y", frameRate,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
    orbitAnimation.setKeys([
        { frame: 0, value: (0 + initialPosition) },
        { frame: (totalFramesInOrbitAnimation / 2), value: (Math.PI + initialPosition) },
        { frame: totalFramesInOrbitAnimation, value: (2 * Math.PI + initialPosition) },
    ]);

    scene.beginDirectAnimation(orbitPivot, [orbitAnimation], 0, totalFramesInOrbitAnimation, true);

    if (rotationPeriod !== 0) {
        const totalFramesInRotationAnimation = framesInYear * Math.abs(rotationPeriod);
        const rotationAnimation = new BABYLON.Animation(`${planetName}Rotation`, "rotation.y", frameRate,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        
        const directionMultiplier = rotationPeriod > 0 ? 1 : -1;
        rotationAnimation.setKeys([
            { frame: 0, value: 0 },
            { frame: (totalFramesInRotationAnimation / 2), value: (Math.PI * directionMultiplier) },
            { frame: totalFramesInRotationAnimation, value: (2 * Math.PI *  directionMultiplier) },
        ]);

        scene.beginDirectAnimation(planet, [rotationAnimation], 0, totalFramesInRotationAnimation, true);   
    }

    return { mesh: planet };
};

export const addSatellite = (scene: BABYLON.Scene, parentPlanet: PlanetInstance, satelliteName: string, diameter: number, distanceFromPlanetInAU: number, orbitalPeriod: number, rotationPeriod: number = orbitalPeriod) => {

}
