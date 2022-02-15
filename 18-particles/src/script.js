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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Particles
 */

// 1. Create a geometery
// const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32) // This will create a sphere made of points

// 1. Create a buffer geometry
const particleGeometry = new THREE.BufferGeometry()

// # of particles
const count = 5000

// Create positions array, which maps the x, y, z coordinates for each particle
const positions = new Float32Array(count * 3) // [x, y, z, x, y, z, ... , x, y, z] -> this is PERFORMANT
const colors = new Float32Array(count * 3)

// Fill array with random values -> randomly place particles
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
  colors[i] = Math.random() // Because colors are also 3 values (RGB)
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
)

particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

/**
 * Textures
 */
const particleTexture = textureLoader.load("/textures/particles/2.png")

const particleMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // If true, near particles look big, far particles look small (depth perception)
  // map: particleTexture, // HOWEVER, the black parts of png hides the particles behind. INSTEAD:
  alphaMap: particleTexture,
  transparent: true,
  // EVEN SO, some black edges remain. imperfect but better SOLUTION:
  depthWrite: false,

  // Different style : blending (drawing on top of one another!)
  blending: THREE.AdditiveBlending,

  // Notify material that we're using vertex colors (AKA color Buffer Attribute!!)
  vertexColors: true,
})

const points = new THREE.Points(particleGeometry, particleMaterial)
scene.add(points)

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
camera.position.z = 3
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

  points.rotation.y = elapsedTime * 0.02

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
