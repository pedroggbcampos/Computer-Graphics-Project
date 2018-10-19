/**
 * In this file, we define the objects
 */

var scaling = 50;

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


/**
* Field Object & related functions
*/
class Field extends GraphicalEntity {
  constructor(x, y, z) {
    super()

    this.material = new THREE.MeshBasicMaterial({ color: 0xcd853f, wireframe: true });
    this.name = "Table"

    this.addBase(  0,  0,  0);
    this.addLengthWall( scaling/2 , 0 , 0);
    this.addLengthWall( -scaling/2 , 0 , 0);
    this.addWidthWall( 0 , 0 ,  scaling);
    this.addWidthWall( 0 , 0 , -scaling);
    //this.addTableLeg(-25, -10, -8);
    scene.add(this);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  addBase( x, y, z) {
    var geometry = new THREE.CubeGeometry(scaling, 0, scaling*2);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y , z);
    this.add(mesh);
  }
  addLengthWall( x, y, z) {
    var height = Math.sqrt(Math.pow(2*scaling,2)/99);
    var geometry = new THREE.CubeGeometry(0, height , 2*scaling);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + height/2, z);
    this.add(mesh);
  }
  addWidthWall( x, y, z) {
    var height = Math.sqrt(Math.pow(2*scaling,2)/99);
    var geometry = new THREE.CubeGeometry(scaling, height, 0);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + height/2 , z);
    this.add(mesh);
  }
}


/**
* Ball Object & related functions
*/
class Ball extends GraphicalEntity {
  constructor(x, y, z) {
    super()
    console.log("sdgsdss")
    this.radius = Math.sqrt(Math.pow(2*scaling,2)/99) / 2
    this.material = new THREE.MeshBasicMaterial({ color: 0xcd853f, wireframe: true});
    this.name = "Ball"

    var geometry = new THREE.SphereGeometry(this.radius);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + this.radius, z);
    this.add(mesh);

    scene.add(this);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

/**
* Ball Object & related functions
*/
class FieldBall extends Ball {
  constructor(objs_already_placed) {
    super(0, 0, 0)
    var min_x = -scaling/2 + this.radius
    var max_x =  scaling/2 - this.radius
    var min_y = -scaling   + this.radius
    var max_y =  scaling   - this.radius
    this.position.x = randFloat(min_x, max_x)
    this.position.z = randFloat(min_y, max_y)
  }
}
