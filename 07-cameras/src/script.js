import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  100
)

// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   aspectRatio,
//   1,
//   -1,
//   0.1,
//   1000
// )
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 2

/**
 * We can also use OrbitControls!
 */

const controls = new OrbitControls(camera, canvas)
// controls.target.y = 2
// controls.update()

// We can smooth the controls with DAMPING
controls.enableDamping = true

// Track mouse movement with camera

/**
 *  Cursor
 */

const cursor = {
  x: 0,
  y: 0,
}

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5 // Cursor values should be between 0 and 1
  cursor.y = event.clientY / sizes.height - 0.5
})
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  //   mesh.rotation.y = elapsedTime

  // Camera rotates in a full circle!
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  //   camera.position.y = cursor.y * 5
  //   camera.lookAt(mesh.position)

  controls.update() // To update the control (ie. damping) on each frame

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
