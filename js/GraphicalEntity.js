/**
 * In this file, we define the objects
 */


/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class GraphicalEntity extends THREE.Geometry {
  constructor(){
    super()
  }
  update(delta) {  }

}
/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class Wing extends GraphicalEntity {
  constructor() {
    super()
    this.boundingbox.type = "plane"
    this.normal = new THREE.Vector3

  }

  // update function is called to update the object
  update(delta) {  }

}
