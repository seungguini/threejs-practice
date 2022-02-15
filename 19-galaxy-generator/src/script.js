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
 * Galaxy
 */

// Params for user to tweak using a GUI
const params = {}
params.count = 10000
params.size = 0.01
params.sizeAttenuation = true
params.radius = 5
params.numBranches = 3
params.spin = 0.7
params.randomness = 0.6
params.randomnessPower = 3
params.insideColor = "#ff6030"
params.outsideColor = "#1b3984"

let particleGeometry = null
let particleMaterial = null
let particles = null

// Generates params.count number of particles
const generateGalaxy = () => {
  // If geometry has been generated before, clear memory and remove mesh!
  if (particles != null) {
    // Clears memory - IMPORTANT FOR PERFORMANCE
    particleGeometry.dispose()
    particleMaterial.dispose()
    scene.remove(particles)
  }

  // Generate base colors
  const insideColor = new THREE.Color(params.insideColor)
  const outsideColor = new THREE.Color(params.outsideColor)

  particleGeometry = new THREE.BufferGeometry()

  // Each particle gets 3 points (x, y, z)
  const particleVertices = new Float32Array(params.count * 3)

  // Each particle gets 3 points for color (R, G, B values)
  const colorVertices = new Float32Array(params.count * 3)

  // Randomly generate x, y, z coordinates
  for (let i = 0; i < params.count; i++) {
    let idx = i * 3

    // The radius of individual particles, constrained by params.radius
    let radius = Math.random() * params.radius // point is placed between 0 and params.radius

    // Spin angle grows with particle's radius (distance from center!) far particles have larger curve
    let spin_angle = radius * params.spin

    // Set each point in equally-distanced branches circulating the center
    let branch_angle =
      ((i % params.numBranches) / params.numBranches) * Math.PI * 2

    // Randomize particles around the main shape
    let randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      params.randomness *
      (Math.random() < 0.5 ? 1 : -1)
    let randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      params.randomness *
      (Math.random() < 0.5 ? 1 : -1)
    let randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      params.randomness *
      (Math.random() < 0.5 ? 1 : -1)

    particleVertices[idx] =
      Math.cos(branch_angle + spin_angle) * radius + randomX
    particleVertices[idx + 1] = randomY
    particleVertices[idx + 2] =
      Math.sin(branch_angle + spin_angle) * radius + randomZ

    // Colors

    // Create mixed colors between the two base colors - based on radius of particle
    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, radius / params.radius)

    colorVertices[idx] = mixedColor.r
    colorVertices[idx + 1] = mixedColor.g
    colorVertices[idx + 2] = mixedColor.b
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particleVertices, 3)
  )

  particleGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(colorVertices, 3)
  )

  particleMaterial = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: params.sizeAttenuation,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  particles = new THREE.Points(particleGeometry, particleMaterial)

  scene.add(particles)
}

generateGalaxy()

/**
 * Add Tweaks
 */

// To avoid re-generating the galaxy over & over, move particles, particleGeometry, and particleMaterial OUTSIDE of generateGalaxy()

gui.add(params, "size", 0, 2).onFinishChange(generateGalaxy) // USE callback function to re-generate galaxy
gui.add(params, "sizeAttenuation").onFinishChange(generateGalaxy)
gui.add(params, "count", 0, 100000).onFinishChange(generateGalaxy)
gui.add(params, "radius", 0.01, 20, 0.01).onFinishChange(generateGalaxy)
gui.add(params, "numBranches", 2, 50, 1).onFinishChange(generateGalaxy)
gui.add(params, "spin", -5, 5, 0.01).onFinishChange(generateGalaxy)
gui.add(params, "randomness", 0, 10, 0.01).onFinishChange(generateGalaxy)
gui.add(params, "randomnessPower", 0, 5, 0.01).onFinishChange(generateGalaxy)
gui.addColor(params, "insideColor").onFinishChange(generateGalaxy)
gui.addColor(params, "outsideColor").onFinishChange(generateGalaxy)

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
camera.position.x = 3
camera.position.y = 3
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

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
