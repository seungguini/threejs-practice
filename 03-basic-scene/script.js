console.log(THREE)

/* 
1. Scene
- Container (set of a movie set)
2. Objects
- Primitive geometries
- Import models
- Particles
- Lights
3. Camera
4. Renderer
*/

// == Making the First Scene ==
const scene = new THREE.Scene()

// Mesh - combination of Geometry (the shape) & Material (how it looks)

// Red cube (width, height, depth)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: "red" })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

const sizes = {
  width: 800,
  height: 600,
}

// Camera - choosing the POV
// Perspective Camera sees close objects as larger, far objects as smaller..
// Param - (FOV -> how wide you can see, Aspect Ratio (width / height) )
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
scene.add(camera)

// Renderer -> renders scene in the POV of the camera; result drawn onto <canvas>
// Fetch <canvas> from the HTML DOM
const canvas = document.querySelector("canvas.webgl")
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})

// Resize renderer
renderer.setSize(sizes.width, sizes.height)

// Render! - like taking a photo
renderer.render(scene, camera)

// Directions: x is right, y is up, z is towards me
