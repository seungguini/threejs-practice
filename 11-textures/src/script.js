import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { LinearMipmapLinearFilter } from "three"

/**
 * Loading images
 */

// LoadingManager keeps track of all resources being loaded in
const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
  console.log("onStart")
}

const textureLoader = new THREE.TextureLoader(loadingManager)

// const colorTexture = textureLoader.load("/textures/door/color.jpg")
const colorTexture = textureLoader.load("/textures/minecraft.png") // hella trippy image
const alphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const heightTexture = textureLoader.load("/textures/door/height.jpg")
const normalTexture = textureLoader.load("/textures/door/normal.jpg")
const ambientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
)
const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg")

// We can change the type of min filters
colorTexture.generateMipmaps = false // mipmaps generation unnecessary for NearestFilter!
// as minFilter
colorTexture.minFilter = THREE.NearestFilter // this makes texture hella sharp when shrunk
colorTexture.magFilter = THREE.NearestFilter // this makes texture hella sharp when stretched
// NearestFilter results in BETTER performances

// colorTexture.repeat.x = 2 // Vector2 - 2D coordinates
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.offset.x = 0.5
// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5 // Default center is 0,0
// colorTexture.center.y = 0.5

/**
 * Mip Mapping - creating a half a smaller version of texture, smaller, smaller,
 * til we get a 1 x 1 texture. Blurs image
 *  1. if the texture is viewed at a sharp angle
 *  2. when the image is smaller than the texture (i.e. zoomed out)
 */

//2 .
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Textures
 */

/**
 * 1. Color / Albedo
 * 2. Alpha
 *  - Grayscale, white visible, black not visible
 * 3. Height
 *  - grayscale -> moves vertices up and down (i.e. to create hills / valleys)
 *  - needs a lot of subdivisions
 * 4. Normal
 *  - blue purple texture
 *  - adds details
 *  - doesn't need subdivision
 *  - vertices DON'T move
 *  - plays with lighting
 *  - better performances
 * 5. Ambient Occlusion
 *  - Adds fake shadows in CREVICES
 *  - NOT physically accurate
 * 6. Metalness -> makes metalic (creates reflection)
 * 7. Roughness
 *  - light dissipation
 *  - grayscale
 *  - used often with metalness
 *  These textures follow Physically Based Rendering (PBR) principles
 *  - formulas which mimic real-life physics / lighting
 */

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

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
