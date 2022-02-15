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
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
)

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
)
object3.position.x = 2

scene.add(object1, object2, object3)

const raycaster = new THREE.Raycaster()

// // We set the origin and direction of the raycaster using Vectors
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(1, 0, 0)

// // We must normalize the rayDirection!!
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)

// // For testing intersection with ONE object
// const intersect = raycaster.intersectObject(object1)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

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
const redColor = new THREE.Color("red")
const blueColor = new THREE.Color("blue")

/**
 * Event handler to detect mouse movement
 */

// Vector 2, because the mouse lives in a 2D space
const mouse = new THREE.Vector2()

window.addEventListener("mousemove", (_event) => {
  // Normalize x & y to be between -1 ~ 1
  mouse.x = (_event.clientX / sizes.width - 0.5) * 2
  mouse.y = (_event.clientY / sizes.height - 0.5) * -2
})

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  object1.position.y = Math.sin(elapsedTime * 0.3) * 2
  object2.position.y = Math.sin(elapsedTime * 0.6) * 2
  object3.position.y = Math.sin(elapsedTime * 0.8) * 2

  /**
   * Change sphere color to blue if it crosses Raycaster's line
   */
  // Set ray caster
  //   const rayOrigin = new THREE.Vector3(-3, 0, 0)
  //   const rayDirection = new THREE.Vector3(10, 0, 0)
  //   rayDirection.normalize()

  //   raycaster.set(rayOrigin, rayDirection)

  //   const objectsToTest = [object1, object2, object3]
  //   const intersects = raycaster.intersectObjects(objectsToTest)

  //   //   console.log(intersects.length)

  //   // Reset intersecting colors to red
  //   for (let object of objectsToTest) {
  //     object.material.color = redColor
  //   }

  //   // Set intersecting colors to blue
  //   for (let intersect of intersects) {
  //     console.log(intersect)
  //     intersect.object.material.color = blueColor
  //   }

  /**
   * Change sphere's colors to blue if the cursor HOVERS over it
   */

  // Set origin to be camera, direction to be the mouse. X,Y coordinates of mouse should be between -1 and 1
  raycaster.setFromCamera(mouse, camera)
  const objectsToTest = [object1, object2, object3]

  const intersects = raycaster.intersectObjects(objectsToTest)

  for (let object of objectsToTest) {
    object.material.color = redColor
  }

  for (let intersect of intersects) {
    intersect.object.material.color = blueColor
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
