import * as THREE from 'three'

export const deg2rad = (deg: number) => deg * (Math.PI / 180)

export const calculateAspectRatio = (width: number, height: number): number[] => {
  const aspectRatio = height / width

  // if (refObj.current) {
  //   refObj.current.scale.set(1, aspectRatio, 1)
  // }
  return [1, aspectRatio, 1]
}

export const detectCollision = (item: any, group: any) => {
  // console.log(item)
  const meshBoundingBox = new THREE.Box3().setFromObject(item)
  const modelBoundingBox = new THREE.Box3().setFromObject(group.current)

  if (meshBoundingBox.intersectsBox(modelBoundingBox)) {
    // Perform any desired actions when collision occurs
    return true
  } else {
    return false
  }
}
