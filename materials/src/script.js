import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

// Debug
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
/**
 * objects
 */
//MeshBasicMaterial
//const material = new THREE.MeshNormalMaterial()
//const material = new THREE.MeshMatcapMaterial()
//const material= new THREE.MeshDepthMaterial()
//const material = new THREE.MeshPhongMaterial()
//material.shininess = 1000
const material = new THREE.MeshPhysicalMaterial()
material.roughness = 0
material.metalness = 0
/*material.map = doorColorTexture
material.aoMap = doorAmbientOcclusionTexture
material.metalnessMap = doorMetalnessTexture
material.normalMap = doorNormalTexture
material.roughnessMap = doorRoughnessTexture*/

//transmission
material.transmission = 1
material.ior= 1.5
material.thickness = 0.5
gui.add(material, 'transmission').min(0).max(1).step(0.0001)
gui.add(material, 'ior').min(1).max(10).step(0.0001)
gui.add(material, 'thickness').min(0).max(1).step(0.0001)
  

gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001)

const Sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)
Sphere.position.x = -1.5
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)
torus.position.x = 1.5;

scene.add(Sphere, plane, torus);
/**
 * lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
// const pointLight = new THREE.PointLight(0xffffff, 50)
// pointLight.position.x = 2 
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

const rgbelLoader = new RGBELoader()
rgbelLoader.load('/textures/environmentMap/2k.hdr', (environtmentMap) =>
{
    environtmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environtmentMap
    scene.environment = environtmentMap
})

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update objects
    Sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime
    Sphere.rotation.x = -0.15 * elapsedTime
    plane.rotation.x = -0.15 * elapsedTime
    torus.rotation.x = -0.15 * elapsedTime

    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()