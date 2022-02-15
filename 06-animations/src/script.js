import "./style.css"
import * as THREE from "three"
import gsap from "gsap"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Axes Helper
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

// We can use animation libraries like GSAP!
gsap.to(mesh.position, {
  x: 2,
  duration: 1,
  delay: 2,
})

const tick = () => {
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()

let time = Date.now()

const clock = new THREE.Clock()

// Animation
/*
const tick = () => {
  renderer.render(scene, camera)

  // Unfortuantely, higher framerate -> higher speed
  // 1. Time
  
  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime
  
  // Rotate object
  mesh.rotation.y += 0.001 * deltaTime
  mesh.rotation.z += 0.001 * deltaTime
  

  // 2. Three.js Clock Class
  const elapsedTime = clock.getElapsedTime()
  console.log(elapsedTime)

  mesh.rotation.y = elapsedTime * Math.PI * 2 // One revolution by second
  mesh.rotation.z = elapsedTime * Math.PI * 2 // One revolution by second
  mesh.position.x = Math.sin(elapsedTime) * 1.5
  mesh.position.y = Math.cos(elapsedTime)

  camera.lookAt(mesh.position)

  window.requestAnimationFrame(tick) // Have the function run each tick
}

tick()
*/
