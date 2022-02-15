import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import { DirectionalLight, MeshBasicMaterial, TextureLoader } from "three"

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
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, -1)
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001)
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001)
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001)
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001)

// Show shadow camera to optimize render for shadow maps
const directionalLightHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
)

// scene.add(directionalLightHelper)

directionalLight.castShadow = true
// Improve shadow quality by changing shadow.mapSize.width & shadow.mapSize.height,
// KEEP IT A POWER OF 2 FOR MIP MAPPING! (default 512, 512)
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048

// REDUCE SHADOW CAMERA for OPTIMIZATION
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2

directionalLight.shadow.radius = 3
scene.add(directionalLight)

const spotLight = new THREE.SpotLight(0xffffff, 0.2, 10, Math.PI * 0.3) // Color, intensity, distance, angle

/* Spotlight Shadow */
spotLight.castShadow = true
spotLight.shadow.camera.fov = 30 // Use .fov instead of .top, .bottom, etc. because Spotlight uses a PerspectiveCamera
spotLight.shadow.radius = 10

// Improve shadow quality by changing shadow.mapSize.width & shadow.mapSize.height,
// KEEP IT A POWER OF 2 FOR MIP MAPPING! (default 512, 512)
spotLight.shadow.mapSize.width = 2048
spotLight.shadow.mapSize.height = 2048

spotLight.position.set(0, 2, 2)

scene.add(spotLight)
scene.add(spotLight.target) // We add target to change where spotLight looks at

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)

spotLightCameraHelper.visible = false

const pointLight = new THREE.PointLight(0xffffff, 0.1, 10)
pointLight.position.set(-1, 1, 0)
pointLight.castShadow = true
scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)

/* Moving baked shadow alternative */
const textureLoader = new TextureLoader()
const simpleShadow = textureLoader.load("./textures/simpleShadow.jpg")

// Create a small plane with the shadow drawn on
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
)
sphereShadow.rotation.x = Math.PI * 1.5
sphereShadow.position.y = -0.3
scene.add(sphereShadow)
/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, "metalness").min(0).max(1).step(0.001)
gui.add(material, "roughness").min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.castShadow = true

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.receiveShadow = true

plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5

scene.add(sphere, plane)

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

// HOWEVER, shadows can be costly. Instead, we can use baked shadows!
// But, this would mean the shadow stays when the sphere moves.
// Alternatively, we use a simple, small shadow and move it with the ball.
// renderer.shadowMap.enabled = true
renderer.shadowMap.enabled = false

renderer.shadowMap.type = THREE.BasicShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  directionalLightHelper.update()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
