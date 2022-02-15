import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import { BoxGeometry, Mesh, MeshStandardMaterial, PointLight } from "three"

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
 * We put everything in a CONTAINER so we can scale / move it easily - THREE.Group()
 */

const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3), // Unites in meteres
  new THREE.MeshStandardMaterial({ color: "#ac8e82" })
)

walls.position.y = 1.5

house.add(walls)

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.1, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
)

roof.position.y = 3.5
roof.rotation.y = Math.PI * 0.25

house.add(roof)

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.2, 1.9),
  new THREE.MeshStandardMaterial({ color: "#aa7b7b" })
)

door.position.y = 0.9
door.position.z = 1.51
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" })

const bigBushScale = 0.5
const smallBushScale = 0.25

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.position.set(1, 0, 1.5)
bush1.scale.set(bigBushScale, bigBushScale, bigBushScale)
house.add(bush1)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.position.set(1.2, 0, 2)
bush2.scale.set(smallBushScale, smallBushScale, smallBushScale)
house.add(bush2)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.position.set(-1, 0, 1.5)
bush3.scale.set(bigBushScale, bigBushScale, bigBushScale)
house.add(bush3)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.position.set(-1.5, 0, 1.5)
bush4.scale.set(smallBushScale, smallBushScale, smallBushScale)
house.add(bush4)

/**
 * Grave
 */

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: "grey" })

// Randomly generate graves
for (let i = 0; i < 100; i++) {
  // Randomly tilt graves
  let tiltX = Math.random() * Math.PI * 0.05 // forward / backward tilt
  let tiltY = Math.random() * Math.PI * 0.05 // forward / backward tilt
  let tiltZ = Math.random() * Math.PI * 0.05 // forward / backward tilt

  let positionX = Math.random() * 20 - 10 // forward / backward tilt
  let positionZ = Math.random() * 20 - 10 // forward / backward tilt

  let grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.rotation.set(tiltX, tiltY, tiltZ)
  grave.position.set(positionX, 0.3, positionZ)

  graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: "#a9c388" })
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12)
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, "intensity").min(0).max(1).step(0.001)
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001)
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001)
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001)
scene.add(moonLight)

const doorLight = new THREE.PointLight("red", 1, 7)
doorLight.position.z = 1.53
doorLight.position.y = 3.1
house.add(doorLight)

/**
 * Fog
 */

const fog = new THREE.Fog("#262837", 1, 15)
scene.fog = fog

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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

renderer.setClearColor("#262837") // Set renderer color the same as the color to blur the fog even more

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
