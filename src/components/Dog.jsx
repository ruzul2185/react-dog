import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useGLTF, useTexture, useAnimations } from "@react-three/drei";
import { texture } from "three/tsl";
import { useEffect } from "react";

// 2:19:140

const Dog = () => {
  const model = useGLTF("/models/dog.drc.glb");

  useThree(({ camera, scene, gl }) => {
    // console.log(camera.position);
    camera.position.z = 1.3;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  const [normalMap, sampleMatCap, branchMap, branchNormalMap] = useTexture([
    "/dog_normals.jpg",
    "/matcap/mat-2.png",
    "/branches_diffuse.jpg",
    "/branches_normals.jpg",
  ]).map((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const dogMaterail = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: sampleMatCap,
  });

  const branchMaterial = new THREE.MeshMatcapMaterial({
    normalMap: branchNormalMap,
    map: branchMap,
  });

  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = dogMaterail;
    } else {
      child.material = branchMaterial;
    }
  });

  return (
    <>
      <primitive
        object={model.scene}
        position={[0.5, -1.1, 0]}
        scale={[2, 2, 2]}
        rotation={[0, Math.PI / 3.7, 0]}
      />
      <directionalLight position={[0, 5, 5]} color={0xffffff} intensity={10} />
      {/* <OrbitControls /> */}
    </>
  );
};

export default Dog;
