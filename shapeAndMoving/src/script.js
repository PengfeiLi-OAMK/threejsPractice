import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('color.jpg')
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: doorColorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)

// Track key states
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
}

// Listen for keydown and keyup
window.addEventListener('keydown', (event) => {
  if (keysPressed.hasOwnProperty(event.key)) {
    keysPressed[event.key] = true
  }
})

window.addEventListener('keyup', (event) => {
  if (keysPressed.hasOwnProperty(event.key)) {
    keysPressed[event.key] = false
  }
})

/**
 * Animate
 */

const tick = () =>
{
  // Handle movement
  const speed = 0.02;
  if (keysPressed.ArrowUp) mesh.position.y -= speed;
  if (keysPressed.ArrowDown) mesh.position.y += speed;
  if (keysPressed.ArrowLeft) mesh.position.x -= speed;
  if (keysPressed.ArrowRight) mesh.position.x += speed;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
}
tick();