/**
 * In this file, we define the objects
 */

/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class GraphicalEntity extends THREE.Object3D {
  constructor() {
    super()

    // Physics Variables
    this.dof = new THREE.Vector3( 0, 0, 0 ); // facing direction
    this.velocity = 0//= new THREE.Vector3( 0, 0, 0 );
    this.acceleration = 0 //= new THREE.Vector3( 0, 0, 0 );
  }

/**
 * Scales the Velocity by a factor
 */
  change_velocity(value) {
    this.velocity += value
  }

  // accepts value in degrees
  rotate(value) {
    this.rotation.y += Math.PI*2*(value/360)
  }

  // update function is called to update the object
  update() {  }

  update_dof(){
    this.dof.x = Math.sin(this.rotation.y)
    this.dof.z = Math.cos(this.rotation.y)
  }
}
