import "./style.css"
import * as THREE from "three"
console.log("hello three.js")
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

// Move mesh object!
mesh.position.x = 0.7
mesh.position.y = -0.6
mesh.position.z = 1

// Update x, y, z at once with Vector3.set()
mesh.position.set(3, -1, -3)

// Vector3.normalize() reduces the norm to 1
mesh.position.normalize()
console.log(mesh.position.length())

// Scale Objects
mesh.scale.x = 2
mesh.scale.y = 0.5
mesh.scale.z = 0.5
mesh.scale.set(2, 0.5, 0.5)
scene.add(mesh)

// Rotate Objects

// Axes Helper draws colored lines to visualize axes!
const axesHelper = new THREE.AxesHelper(3) // param = length of axes
scene.add(axesHelper)

// Rotations are from the Euler class (look at Euler angles)

// Avoid GIMBAL LOCK by reordering axes
mesh.rotation.reorder("YXZ")

// Math.PI represents A FULL ROTATION
mesh.rotation.x = Math.PI * 0.5
mesh.rotation.y = Math.PI * 0.5

// This is confusing. Thus, we use QUATERNION

// We can move MULTIPLE Objects with the Group class
const group = new THREE.Group()
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "red" })
)
group.add(cube1)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "green" })
)
cube2.position.x = -2
group.add(cube2)
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "yellow" })
)
cube3.position.x = 2
group.add(cube3)

group.rotation.z = Math.PI / 4
scene.add(group)

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1, 1, 3)
// We can have any objects (camera included) to 'look' at another object
// which means it's -z will face the provided target
camera.lookAt(mesh.position) // Takes Vector3 object as param
scene.add(camera)

// The position variable is a Vector3 object, which has classes like distanceTo()
console.log(mesh.position.distanceTo(camera.position))

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
