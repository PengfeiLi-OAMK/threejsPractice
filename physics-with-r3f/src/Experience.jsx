import { useGLTF,OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import {InstancedRigidBodies,CylinderCollider,BallCollider,CuboidCollider, Debug,RigidBody,Physics } from '@react-three/rapier'
import { useMemo,useEffect,useState,useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Experience()
{
  const[hitSound]= useState(() => new Audio('./hit.mp3'))
  const twister=useRef()
  const cube=useRef()
  const cubeJump=() => {
    const mass = cube.current.mass()
    cube.current.applyImpulse({x:0,y:5*mass,z:0})
    cube.current.applyTorqueImpulse({x:Math.random(),y:Math.random(),z:Math.random()})
  }
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    const eulerRotation = new THREE.Euler(0, time, 0)
    const quaternionRotation = new THREE.Quaternion()
    quaternionRotation.setFromEuler(eulerRotation)
    twister.current.setNextKinematicRotation(quaternionRotation)

    const angel=time*0.5
    const x= Math.cos(angel)*2
    const z= Math.sin(angel)*2
    twister.current.setNextKinematicTranslation({x,y:-0.8,z})
  })
  const collisionEnter = () => {
    hitSound.currentTime = 0
    hitSound.volume = Math.random() 
    hitSound.play()
  }

  const hamburger = useGLTF('./hamburger.glb')
  const cubesCount=100
  const cubes=useRef()
  const cubesTransform=useMemo(() =>
  {
    const positions= []
    const rotations= []
    const scales= []

    for(let i=0;i<cubesCount;i++)
    {
      positions.push([
        (Math.random() - 0.5) * 8,
        6+i*0.2,
        (Math.random() - 0.5) * 8,
      ])
      rotations.push([
        Math.random() ,
        Math.random() ,
        Math.random() ,
      ])
      const scale = 0.8
      // Math.random() * 0.8 + 0.2;
      scales.push([scale, scale, scale])
    }
    return {
      positions,
      rotations,
      scales,
      }
  }, [])
  // useEffect(() => {
  //   for(let i=0;i<cubesCount;i++)
  //   {
  //    const matrix= new THREE.Matrix4()
  //    matrix.compose(
  //     new THREE.Vector3(i*2，0,0),
  //     new THREE.Quaternion(),
  //     new THREE.Vector3(1,1,1)
  //    )
  //    cubes.current.setMatrixAt(i,matrix)
  //   }
  // }, [])

    return (
      <>
        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
        <ambientLight intensity={1.5} />
        <Physics gravity={[0, -9.8, 0]}>
          {/* <Debug /> */}
          <RigidBody colliders="ball" restitution={0.5}>
            <mesh castShadow position={[-1.5, 2, 0]}>
              <sphereGeometry />
              <meshStandardMaterial color="orange" />
            </mesh>
          </RigidBody>
          <RigidBody
            ref={cube}
            position={[1.5, 2, 0]}
            restitution={0.5}
            friction={0.5}
            onCollisionEnter={collisionEnter}
          >
            <mesh castShadow onClick={cubeJump}>
              <boxGeometry />
              {/* <torusGeometry args={[1, 0.5, 16,32]} /> */}
              <meshStandardMaterial color="mediumpurple" />
            </mesh>
          </RigidBody>
          {/* <RigidBody>
            <mesh castShadow position={[2, 2, 0]}>
              <boxGeometry />
              <meshStandardMaterial color="mediumpurple" />
            </mesh>
          </RigidBody> */}

          <RigidBody type="fixed" restitution={0} friction={0}>
            <mesh receiveShadow position-y={-1.25}>
              <boxGeometry args={[10, 0.5, 10]} />
              <meshStandardMaterial color="greenyellow" />
            </mesh>
          </RigidBody>
          <RigidBody
            ref={twister}
            position={[0, -0.8, 0]}
            friction={0}
            type="kinematicPosition"
          >
            <mesh castShadow scale={[0.4, 0.4, 4]}>
              <boxGeometry />
              <meshStandardMaterial color="red" />
            </mesh>
          </RigidBody>
          <RigidBody colliders={false} position={[0, 4, 0]} restitution={1}>
            <primitive object={hamburger.scene} scale={0.25} />
            <CylinderCollider args={[0.5, 1.25]} />
          </RigidBody>
          <RigidBody type="fixed">
            <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
            <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
            <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
            <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
          </RigidBody>
          <InstancedRigidBodies
            positions={cubesTransform.positions}
            rotations={cubesTransform.rotations}
            scales={cubesTransform.scales}
            restitution={0.5}
          >
            <instancedMesh
              ref={cubes}
              castShadow
              args={[null, null, cubesCount]}
            >
              <boxGeometry />
              <meshStandardMaterial color="tomato" />
            </instancedMesh>
          </InstancedRigidBodies>
        </Physics>
      </>
    );
}