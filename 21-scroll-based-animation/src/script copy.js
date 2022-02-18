import "./style.css"
import * as THREE from "three"
import * as dat from "lil-gui"
import { Group } from "three"
import gsap from "gsap"

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
  materialColor: "#ffeded",
}

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor)
  particlesMaterial.color.set(parameters.materialColor)
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ color: "#ff0000" })
// )
// scene.add(cube)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// Load gradient texture to diversify shade colors on the MeshToonMaterial
// ADD it to material's gradientMap
const gradientTexture = textureLoader.load("textures/gradients/3.jpg")
// Three.js & WebGL chooses nearest gradient color by default - chnage this w magFilter
gradientTexture.magFilter = THREE.NearestFilter
/**
 * Objects
 */
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
})

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Positions
const objectDistance = 5 // Increase this value to properly hide the objects
// NOTE - because the view angle of THREE js is vertical, objects keep their relative poisitions
// even if the window size changes
mesh1.position.y = -objectDistance * 0
mesh1.position.x = 2

mesh2.position.y = -objectDistance * 1
mesh2.position.x = -2

mesh3.position.y = -objectDistance * 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const meshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */

const particlesCount = 2000
const positions = new Float32Array(particlesCount * 3)

const particleSpan = 15

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * particleSpan
  positions[i * 3 + 1] =
    objectDistance * 0.5 - Math.random() * objectDistance * meshes.length
  positions[i * 3 + 2] = (Math.random() - 0.5) * particleSpan
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
)

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Cursor
 */

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Lights
 */
const directionalLights = new THREE.DirectionalLight("#ffffff", 1)
directionalLights.position.set(1, 1, 0)
scene.add(directionalLights)

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
  35,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 6

// Add group for better parallax animation
const cameraGroup = new THREE.Group()
cameraGroup.add(camera)
scene.add(cameraGroup)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  alpha: true, // Makes canvas transparent!
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener("scroll", () => {
  scrollY = window.scrollY
  let newSection = Math.round(scrollY / sizes.height)
  if (currentSection != newSection) {
    console.log("section changed")
    currentSection = newSection

    gsap.to(meshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
    })
  }
  console.log(currentSection)
})
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Render
  renderer.render(scene, camera)

  // Update camera position to scroll value
  // We divide by size height to scale the scroll speed to the height
  // This makes each section scroll equal to one THREE.js UNIT
  // we then multiply by ObjectDistance to make one section scroll equal to the object distance
  camera.position.y = (-scrollY / sizes.height) * objectDistance

  // Parallax - move camera based on cursor to simulate parallax effect
  const parallaxX = cursor.x
  const parallaxY = -cursor.y
  const easeValue = 1
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * easeValue * deltaTime // Easing / lerping formula (dest - current) * 10
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * easeValue * deltaTime
  // Rotate meshes
  for (const mesh of meshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.12
  }

  particles.rotation.y = elapsedTime * 0.01

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
