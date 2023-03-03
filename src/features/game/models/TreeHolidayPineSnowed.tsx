/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 treeHolidayPineSnowed.glb -t
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { snow } from "./materials"

type GLTFResult = GLTF & {
  nodes: {
    Mesh_treePineSnowed: THREE.Mesh
    Mesh_treePineSnowed_1: THREE.Mesh
  }
  materials: {
    snow: THREE.MeshStandardMaterial
    wood: THREE.MeshStandardMaterial
  }
}

export function TreeHolidayPineSnowed(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/treeHolidayPineSnowed.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Mesh_treePineSnowed.geometry} material={snow} />
      <mesh geometry={nodes.Mesh_treePineSnowed_1.geometry} material={materials.wood} />
    </group>
  )
}

useGLTF.preload('/treeHolidayPineSnowed.glb')