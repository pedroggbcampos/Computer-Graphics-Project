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
    this.scaling = 1
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


/**
* Field Object & related functions
*/
class Field extends GraphicalEntity {
  constructor(x, y, z) {
    super()

    this.material = new THREE.MeshBasicMaterial({ color: 0xcd853f, wireframe: true });
    this.name = "Table"
    this.scaling = 50

    this.addBase(  0,  0,  0);
    this.addLengthWall( this.scaling/2 , 0 , 0);
    this.addLengthWall( -this.scaling/2 , 0 , 0);
    this.addWidthWall( 0 , 0 ,  this.scaling);
    this.addWidthWall( 0 , 0 , -this.scaling);
    //this.addTableLeg(-25, -10, -8);
    scene.add(this);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  addBase( x, y, z) {
    var geometry = new THREE.CubeGeometry(this.scaling, 0, this.scaling*2);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y , z);
    this.add(mesh);
  }
  addLengthWall( x, y, z) {
    var height = Math.sqrt(Math.pow(2*this.scaling,2)/99);
    var geometry = new THREE.CubeGeometry(0, height , 2*this.scaling);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + height/2, z);
    this.add(mesh);
  }
  addWidthWall( x, y, z) {
    var height = Math.sqrt(Math.pow(2*this.scaling,2)/99);
    var geometry = new THREE.CubeGeometry(this.scaling, height, 0);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y+ height/2 , z);
    this.add(mesh);
  }

}
