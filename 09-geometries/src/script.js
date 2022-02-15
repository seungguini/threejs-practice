import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
// Array of Vertex geometries
const positionArray = new Float32Array([
  // Array size = itemSize * numVertices
  0, // x position
  0, // y position
  0, // first vertex
  1,
  1,
  1, // second vertex
  -1,
  0,
  0, // third vertex
])

const positionAttribute = new THREE.BufferAttribute(positionArray, 3) // 3 represents the number of values (itemSize) representing each vertex

const geometry = new THREE.BufferGeometry()
geometry.setAttribute("position", positionAttribute) // position is the attribute name
 */

const count = 1000
const numVertices = count * 3
// 50 triangles
// 3 vertices
// 3 values per vertex (x,y,z)
const itemSize = 3
const positionArray = new Float32Array(numVertices * itemSize)

for (let i = 0; i < numVertices * itemSize; i++) {
  positionArray[i] = Math.random() * 2
}

const positionAttribute = new THREE.BufferAttribute(positionArray, itemSize) // Second param -> how many items per vertex

const geometry = new THREE.BufferGeometry()
geometry.setAttribute("position", positionAttribute)

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10) // last three params define segments (divisions) for width, height, and depths of the geometry
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
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

// Camera
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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
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
