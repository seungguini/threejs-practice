import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */

// OMNI-DIRECTIONAL LIGHTING
// Good for simulating light bouncing!
const ambLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambLight)

// Sun-like effect, rays are parallel
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(3, 2, 0)

gui.add(directionalLight.position, "x", -3, 3)
gui.add(directionalLight.position, "y", -3, 3)

scene.add(directionalLight)

// Different color coming from sky v. ground
const hemisphereLight = new THREE.HemisphereLight("blue", "green", 0.2)
scene.add(hemisphereLight)

// Like a lightbulb, but point is INFINITELY small
const pointLight = new THREE.PointLight(0xff900, 0.6)
scene.add(pointLight)

gui.add(pointLight.position, "y", -3, 3)
// Distance & Decay control light intensity per distance
gui.add(pointLight, "distance", 0, 100)

// Rectangular lights seen in photoshoots
// RectAreaLight only works with MeshStandardMaterial & MeshPhysicalMaterial
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1)
rectAreaLight.position.set(-1.5, 0, 2)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

// Spotlights are like flashlights
// Angle determines the angle of the light emetting from spotlight (pi being 180 degrees)
// Penumbra determines how light fades at the edges
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)

// To ROTATE a spotlight, we need to add the spotLight.target object to the scene and move it
scene.add(spotLight.target)
gui.add(spotLight.target.position, "x", -3, 3)

/**
 * Helpers for Lights
 */

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.3
)
scene.add(directionalLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper) // we also update spotLightHelper whenever target is moved

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.x = -1.5

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

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

  // Update spotLightHelper
  spotLightHelper.update()

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime
  cube.rotation.y = 0.1 * elapsedTime
  torus.rotation.y = 0.1 * elapsedTime

  sphere.rotation.x = 0.15 * elapsedTime
  cube.rotation.x = 0.15 * elapsedTime
  torus.rotation.x = 0.15 * elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
