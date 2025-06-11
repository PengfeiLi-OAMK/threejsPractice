import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from "cannon-es";

/**
 * Debug
 */
const gui = new GUI()
const debugObject = {}
debugObject.createSphere = () => {
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
}
debugObject.createBox = () => {
  createBox(Math.random(), Math.random(), Math.random(), {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
debugObject.reset= () => {
  for (const object of objectToUpdate) {
    object.body.removeEventListener('collide', playHitSound); // Remove collision event listener
    world.removeBody(object.body);
  }
  objectToUpdate.slice(0, objectToUpdate.length); // Clear the array
}
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * sounds
 */
const hitSound = new Audio('/sounds/hit.mp3');
const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();
  if (impactStrength > 1.5) { // Play sound only if impact is strong enough
    hitSound.volume = Math.random();
    hitSound.currentTime = 0; // Reset sound to start
    hitSound.play();
  };
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0) // m/s²
//material
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1, // Friction coefficient
    restitution: 0.7, // Bounciness
  }
);
world.addContactMaterial(defaultContactMaterial);

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0, // kg
    material: defaultMaterial // Use the default material
})
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5) // Rotate the plane to be horizontal
world.addBody(floorBody)

/**
 * Floor
 */
const sharedGroundMaterial = new THREE.MeshStandardMaterial({
  color: "#777777",
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
  side: THREE.DoubleSide, // 👈 关键：让墙体两面都可见
});
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  sharedGroundMaterial
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 *walls
 */
const wallThickness = 0.2;
const wallHeight = 1;
const floorSize = 10;

const wallMaterial = sharedGroundMaterial; // 跟地面材质相同

const createWall = (width, height, depth, pos, rot = 0) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    wallMaterial
  );
  mesh.position.copy(pos);
  mesh.rotation.y = rot;
  mesh.castShadow = true;
  scene.add(mesh);

  const shape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, depth / 2)
  );
  const body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(pos.x, pos.y, pos.z),
    shape: shape,
    material: defaultMaterial,
  });
  world.addBody(body);
};

// Top wall (Z+)
createWall(
  floorSize,
  wallHeight,
  wallThickness,
  new THREE.Vector3(0, wallHeight / 2, floorSize / 2)
);
// Bottom wall (Z-)
createWall(
  floorSize,
  wallHeight,
  wallThickness,
  new THREE.Vector3(0, wallHeight / 2, -floorSize / 2)
);
// Left wall (X-)
createWall(
  wallThickness,
  wallHeight,
  floorSize,
  new THREE.Vector3(-floorSize / 2, wallHeight / 2, 0)
);
// Right wall (X+)
createWall(
  wallThickness,
  wallHeight,
  floorSize,
  new THREE.Vector3(floorSize / 2, wallHeight / 2, 0)
);




/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * utils
 */
const objectToUpdate = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
//sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createSphere = (radius, position) => {
    //three mesh
    const mesh= new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
        
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)
    //cannon body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1, // kg
        position: new CANNON.Vec3(0,3,0),
        shape,
        material: defaultMaterial // Use the default material
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound); // Add collision event listener
    world.addBody(body)
    objectToUpdate.push({mesh, body})
}
createSphere(0.5, {x: 0, y: 3, z: 0})

//box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});
const createBox = (width, height,depth,position) => {
  //three mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);
  //cannon body
  const shape = new CANNON.Box(new CANNON.Vec3(width*0.5, height*0.5, depth*0.5));
  const body = new CANNON.Body({
    mass: 1, // kg
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial, // Use the default material
  });
  body.position.copy(position);
  body.addEventListener('collide', playHitSound); // Add collision event listener
  world.addBody(body);
  objectToUpdate.push({ mesh, body });
};

function shootSphereTowardDirection(direction) {
  const radius = 0.2;

  // const direction = new THREE.Vector3();
  // camera.getWorldDirection(direction);

  const start = new THREE.Vector3();
  start.copy(camera.position).add(direction.clone().multiplyScalar(1));

  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(start);
  scene.add(mesh);

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(start.x, start.y, start.z),
    shape,
    material: defaultMaterial,
  });

  const velocity = direction.clone().multiplyScalar(10);
  body.velocity.set(velocity.x, velocity.y, velocity.z);

  body.addEventListener("collide", playHitSound);
  world.addBody(body);
  objectToUpdate.push({ mesh, body });
}


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    // Update physics
    //sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position) 
    for (const object of objectToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion);
        
    }
    world.step(1 / 60, deltaTime, 3)
    //sphere.position.copy(sphereBody.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
window.addEventListener("mousedown", (event) => {
  if (event.button === 0 && event.shiftKey) {
    // 将屏幕坐标转为 [-1, 1] 范围
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    // 通过 Raycaster 获取方向
    raycaster.setFromCamera(mouse, camera);
    const shootDirection = raycaster.ray.direction.clone().normalize();

    shootSphereTowardDirection(shootDirection);
  }
});