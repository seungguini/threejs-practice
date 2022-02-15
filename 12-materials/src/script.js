import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"
import { Material, MeshToonMaterial } from "three"

/**
 * Load Textures
 */

const textureLoader = new THREE.TextureLoader()

// Cube Texture Loader for Environment Maps
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
)
const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
const doorGradientTexture = textureLoader.load("textures/gradients/3.jpg")
const doorMatcapTexture = textureLoader.load("/textures/matcaps/1.png")

// 6 images for each direction
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
])

const gui = new GUI()

/**
 * Materials color each visible vertex
 * Coloring algorithm described in SHADERS
 *
 */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Objects
 */

/**
 * Materials
 */

// const material = new THREE.MeshBasicMaterial({ color: "lightblue" })
// material.map = doorColorTexture
// material.wireframe = true
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.side = THREE.DoubleSide

// NORMAL MATERIAL -> normals contain info about the direction of object's outside face
// Normals used for lighting, reflection, refraction
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// Matcap Material -> simulate the lighting inside a texture png file (without putting lights!)
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// Performant but creates weird lines
// const material = new THREE.MeshLambertMaterial()

// Better for showing reflections, less performant. Fixes lines
// const material = new THREE.MeshPhongMaterial()

// const material = new THREE.MeshToonMaterial()
// material.shininess = 100

// const material = new THREE.MeshStandardMaterial()
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.displacementMap = doorHeightTexture
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.sides = THREE.DoubleSide

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture

gui.add(material, "metalness", 0, 1)
gui.add(material, "roughness", 0, 1)
gui.add(material, "aoMapIntensity", 0, 1)
gui.add(material, "displacementScale", 0, 1)

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
)
const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
  material
)
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(), material)

torus.position.x = -3
plane.position.x = 3
scene.add(sphere, torus, plane)

window.addEventListener("resize", () => {
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
 * Lights
 */
const ambLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(pointLight)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
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
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Rotate torus
  torus.rotation.x = elapsedTime * 0.5
  torus.rotation.y = elapsedTime * 0.1

  // Rotate plane
  plane.rotation.x = elapsedTime * 0.05
  plane.rotation.y = elapsedTime * 0.01

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
