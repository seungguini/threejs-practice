import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import CANNON, { Body, Vec3 } from "cannon"
/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */
const hitSound = new Audio("/sounds/hit.mp3")

// collision param gives collision info.
const playSound = (collision) => {
  const collisionVelocity = collision.contact.getImpactVelocityAlongNormal()

  if (collisionVelocity > 1.5) {
    hitSound.currentTime = 0 // Reset audio to the beginning
    // so each collide will make it start over.
    // By default, sound will just keep plying where it left off
    hitSound.volume = Math.random() // randomize the volume
    hitSound.play()
  }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
])

/**
 * Physics
 */

/**
 * NOTE: We can improve performance by parallelizing the Physics component
 * to another Thread, using workers
 */

const defaultMaterial = new CANNON.Material("default")
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 1.7,
  }
)

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0) // Set earth's gravity :)
world.addContactMaterial(defaultContactMaterial)
world.allowSleep = true

/**
 * OPTIMIZATION
 */
// Switching the broadphase to Switch and Prune (SAP) can
// IMPROVE performance. By default, CANNON checks the collision between
// each bodies, which means n^n checks for n objects PER tick.
world.broadphase = new CANNON.SAPBroadphase(world)
// MATERIALS
const concreteMaterial = new CANNON.Material("concrete")
const plasticMaterial = new CANNON.Material("plastic")

// Contact material -> for when the two materials COLLIDE
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1, // How much it rubs, default 0.3
    restitution: 0.7, // How much bounce, default 0.3
  }
)

world.addContactMaterial(concretePlasticContactMaterial)

const sphereShape = new CANNON.Sphere(0.5)

const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
  material: plasticMaterial,
})

sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0)) // Force direction, local point of focus to apply force

world.addBody(sphereBody)

const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.material = concreteMaterial

floorBody.addShape(floorShape)
floorBody.mass = 0

// Rotate floor
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Utils
 */

// Array of objects
const objectsToAnimate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)

const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
})

const createSphere = (radius, position) => {
  // Threejs Mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  mesh.scale.set(radius, radius, radius)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // Physics object
  const sphereShape = new CANNON.Sphere(radius)
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0), // Have object fall from the sky
    shape: sphereShape,
    material: defaultMaterial,
  })
  sphereBody.position.copy(position)
  world.addBody(sphereBody)

  objectsToAnimate.push({ mesh, body: sphereBody })
}

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
})

const createBox = (x, y, z, position) => {
  // ThreeJS Mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial)
  mesh.scale.set(x, y, z)
  mesh.castShadow = true
  mesh.position.copy(position)
  scene.add(mesh)

  // Cannon 3D
  const boxShape = new CANNON.Box(new CANNON.Vec3(x * 0.5, y * 0.5, z * 0.5)) // Cannon geometries are given HALF values for their constructors "have extents"
  const boxBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: boxShape,
    material: defaultMaterial,
  })

  boxBody.position.copy(position)

  // Collide event listener to add sound
  boxBody.addEventListener("collide", playSound)
  world.addBody(boxBody)
  objectsToAnimate.push({ mesh, body: boxBody })
}

/**
 * GUI
 */
const debugObject = {}

debugObject.createSphere = () => {
  createSphere(
    Math.random() * 2,
    new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 2 + 1,
      (Math.random() - 0.5) * 2
    )
  )
}

debugObject.createBox = () => {
  createBox(
    Math.random(),
    Math.random(),
    Math.random(),
    new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 2 + 1,
      (Math.random() - 0.5) * 2
    )
  )
}

debugObject.clear = () => {
  for (const obj of objectsToAnimate) {
    // Remove Cannon Body
    obj.body.removeEventListener("collide", playSound)
    world.remove(obj.body)

    // Remove ThreeJS
    scene.remove(obj.mesh)
  }
}

gui.add(debugObject, "createSphere")
gui.add(debugObject, "createBox")
gui.add(debugObject, "clear")

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(-3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let oldElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  // Calculate delta time (time elapsed per tick)
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update physics
  world.step(1 / 60, deltaTime, 3) // Framerate, deltaTime, numberOfIterations
  // console.log(sphereBody.position.y)

  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
  // sphere.position.copy(sphereBody.position)

  for (const obj of objectsToAnimate) {
    obj.mesh.position.copy(obj.body.position)
    obj.mesh.quaternion.copy(obj.body.quaternion) // Copy orientation so things can tilt!
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
