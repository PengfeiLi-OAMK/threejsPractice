# Three.js Practice Collection

This repository contains a series of practice exercises I created while learning and experimenting with Three.js and related technologies (like `@react-three/fiber` and `@react-three/rapier`).  
Each folder represents a standalone mini project with its own visual effect and interactive features.

---
## 📁 Projects Overview
### 🔹 physics-with-r3f
- **Description**: A dynamic physics simulation built with React Three Fiber and Rapier. This scene features instanced falling cubes, a user-clickable bouncing box, a spinning "twister" bar that influences object motion, and a 3D hamburger model with a collider. An audio effect plays upon collision, and the scene is lit with ambient and directional lighting.
- **Tech Used**:  
@react-three/fiber: React renderer for Three.js  
@react-three/rapier: Physics engine wrapper  
@react-three/drei: Utility helpers like useGLTF, OrbitControls  
- **Screenshot**:
- ![image](https://github.com/user-attachments/assets/5686c6ab-4df2-4498-a1b7-291d9fa3f610)
### 🔹 physics
- **Description**: A pure Three.js + Cannon-es physics simulation where users can interactively spawn dynamic spheres and boxes into a walled arena. Users can shoot spheres toward the mouse click direction by holding Shift + Left Click. Sound effects play on impactful collisions, and all objects respond to real-time gravity, bounce, and friction.
- **Tech Used**:
three: 3D rendering library for WebGL  
cannon-es: Lightweight 3D physics engine for handling rigid bodies, gravity, and collisions  
lil-gui: UI panel for real-time debug controls (spawn sphere, box, reset scene)    
- **Screenshot**:
![image](https://github.com/user-attachments/assets/02e41a7e-ec04-4c50-a126-891b25eb019b)
### 🔹 3d-text
- **Description**: Practice rendering 3D text using `TextGeometry`.This scene displays a 3D text at the center, surrounded by 200 randomly positioned shapes including toruses, cones, dodecahedrons, and other geometric forms. Each shape has random position, rotation, and scale, creating a dynamic and visually engaging space, while fog and camera controls enhance the depth and interactivity of the scene.
- **Tech Used**: Three.js, `THREE.TextGeometry`, `THREE.MeshStandardMaterial`.
- **Screenshot**:  
 ![image](https://github.com/user-attachments/assets/5b4f80be-3bf3-416d-9540-d896a0e5d231)
### 🔹 materials
- **Description**: This animation using Three.js is created to experiment with different material properties. Three 3D objects—a sphere, a plane, and a torus—are placed in an environment using an HDR image as the background and reflection source. MeshPhysicalMaterial is used with transmission, IOR, and thickness settings to simulate realistic refraction and reflection effects. The objects rotate continuously to showcase how they interact with the lighting and environment map.
- **Tech Used**: Three.js, MeshPhysicalMaterial, lights, shadows.
- **Screenshot**:  
  ![image](https://github.com/user-attachments/assets/110e0a4a-b116-4bf5-9690-87ef6c7abaec)
  ### 🔹 shapeAndMoving
- **Description**:A basic interactive movement demo using Three.js. The user controls a textured 3D box using the arrow keys. The box moves smoothly in the X-Y plane within a simple 3D scene. The camera uses orbit controls for viewing, and the movement is frame-based with smooth animation updates.
- **Tech Used**: Three.js, OrbitControls,TextureLoader
- **Screenshot**:
  ![image](https://github.com/user-attachments/assets/9787758f-bb1b-4ff6-8da7-2fe5ac77a025)
