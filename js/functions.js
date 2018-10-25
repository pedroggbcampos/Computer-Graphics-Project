function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.premultiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.getWorldQuaternion(object.matrix, object.scale);
}
