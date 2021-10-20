import * as BABYLON from "babylonjs";

const frameRate = 10;
const framesInYear = 365;
const auMultiplier = 10;

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
    orbitFrame: BABYLON.Node;
}

/**
 * Sets up the specified planet
 * @param scene (BABYLON.Scene) The scene where the planets are rendered.
 * @param planetName (string) The name of the planet. Is used to figure out mesh and id created objects. Make lower case.
 * @param diameter (number) The diameter in Earth diameters
 * @param distanceFromSunInAU (number) Distance from from the sun in AU. 
 * @param orbitalPeriod (number) Orbital period in Earth years
 * @param rotationPeriod (number) Rotation period (length of day) in Earth years
 */
export const createPlanet = (scene: BABYLON.Scene, planetName: string, diameter: number, distanceFromSunInAU: number, 
                                orbitalPeriod: number, rotationPeriod: number = 0): PlanetInstance => {
    //Eventually I can add in actual historical positions
    const initialPosition = Math.random() * 2 * Math.PI;
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

    const planetFrame = new BABYLON.TransformNode(`${planetName}ReferenceFrame`);

    // Create a pivot point in the scene origin for the planet to parent to so we can just rotate the planet through its orbit.
    const orbitPivot = new BABYLON.TransformNode(`${planetName}Pivot`);
    planetFrame.parent = orbitPivot;
    planet.parent = planetFrame;
    planetFrame.position.x = localDistance;

    createOrbitAnimation(scene, orbitPivot, planetName, initialPosition, orbitalPeriod);

    createRotationAnimation(scene, planet, rotationPeriod, planetName);

    return { mesh: planet, orbitFrame: planetFrame };
};

/**
 * 
 * @param scene 
 * @param parentPlanet 
 * @param satelliteName 
 * @param diameter (number) The diameter in Earth diameters  
 * @param distanceFromPlanetInAU 
 * @param orbitalPeriod (number) Orbital period in Earth years
 * @param rotationPeriod (number) Rotation period (length of day) in Earth years
*/
export const createSatellite = (scene: BABYLON.Scene, parentPlanet: PlanetInstance, satelliteName: string, 
                                diameter: number, distanceFromPlanetInAU: number, orbitalPeriod: number) => {
    //Eventually I can add in actual historical positions
    const initialPosition = Math.random() * 2 * Math.PI;
    const localDistance = distanceFromPlanetInAU * auMultiplier;

    const satelliteMaterial = new BABYLON.StandardMaterial(`${satelliteName}Material`, scene);
    satelliteMaterial.emissiveTexture = new BABYLON.Texture(`textures/mercury.jpg`, scene);
    // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
    const satellite = BABYLON.Mesh.CreateSphere(satelliteName, 16, diameter, scene, false, BABYLON.Mesh.FRONTSIDE);
    satellite.material = satelliteMaterial;

    // Create a pivot point in the scene origin for the planet to parent to so we can just rotate the planet through its orbit.
    const orbitPivot = new BABYLON.TransformNode(`${satelliteName}Pivot`);
    orbitPivot.parent = parentPlanet.orbitFrame;
    satellite.parent = orbitPivot;
    satellite.position.x = localDistance;

    createOrbitAnimation(scene, orbitPivot, satelliteName, initialPosition, orbitalPeriod);
}

function createRotationAnimation(scene: BABYLON.Scene, planet: BABYLON.Mesh, rotationPeriod: number, planetName: string) {
    if (rotationPeriod !== 0) {
        const totalFramesInRotationAnimation = framesInYear * Math.abs(rotationPeriod);
        const rotationAnimation = new BABYLON.Animation(`${planetName}Rotation`, "rotation.y", frameRate,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        const directionMultiplier = rotationPeriod > 0 ? 1 : -1;
        rotationAnimation.setKeys([
            { frame: 0, value: 0 },
            { frame: (totalFramesInRotationAnimation / 2), value: (Math.PI * directionMultiplier) },
            { frame: totalFramesInRotationAnimation, value: (2 * Math.PI * directionMultiplier) },
        ]);

        scene.beginDirectAnimation(planet, [rotationAnimation], 0, totalFramesInRotationAnimation, true);
    }
}

function createOrbitAnimation(scene: BABYLON.Scene, orbitPivot: BABYLON.Node, bodyName: string, initialPosition: number, orbitalPeriod: number) {
    const totalFramesInOrbitAnimation = framesInYear * orbitalPeriod;
    const orbitAnimation = new BABYLON.Animation(`${bodyName}Orbit`, "rotation.y", frameRate,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    orbitAnimation.setKeys([
        { frame: 0, value: (0 + initialPosition) },
        { frame: (totalFramesInOrbitAnimation / 2), value: (Math.PI + initialPosition) },
        { frame: totalFramesInOrbitAnimation, value: (2 * Math.PI + initialPosition) },
    ]);

    scene.beginDirectAnimation(orbitPivot, [orbitAnimation], 0, totalFramesInOrbitAnimation, true);
}