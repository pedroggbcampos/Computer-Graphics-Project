/**
 * In this file, we define the objects
 */


/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class GraphicalEntity extends THREE.Object3D {
  constructor() {
    super()
    this.dof = new THREE.Vector3( 0, 0, 0 ); // facing direction

  }

  // update function is called to update the object
  update() {  }
}


/**
 * Object which can be moved around and has to simulate physics
 */
class MoveableGraphicalEntity extends GraphicalEntity {
  constructor() {
    super()

    // Physics Variables
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.acceleration = 0

    // if the object has colided in the last update
    this.colided = false

    // are the result of the movement with no colision
    this.tent_pos = new THREE.Vector3(0, 0, 0);
    this.tent_vel = new THREE.Vector3(0, 0, 0);

    // are the result of the movement with colision
    this.colide_pos =  new THREE.Vector3(0, 0, 0);
    this.colide_vel =  new THREE.Vector3(0, 0, 0);
  }

  /**
   * Scales the Velocity by a factor
   */
    change_velocity(value) {
      this.velocity += value
    }
}



/**
* Field Object & related functions
*/
class Field extends GraphicalEntity {
  constructor() {
    super()

    this.material = new THREE.MeshBasicMaterial({ color: 0xcd853f, wireframe: true });
    this.name = "Field"
  }
}

class FieldWall extends Field {
  constructor(x, y, z) {
    super()
    this.dof(-x, -y, -z) // all walls point to zero
  }
}


/**
* Field Object & related functions
*/
class LengthWall extends FieldWall {
  constructor(x, y, z) {
    super()
    var height = Math.sqrt(Math.pow(2*scaling,2)/99);
    var geometry = new THREE.CubeGeometry(0, height , 2*scaling);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(0, 0, 0);
    this.add(mesh);

    this.position.x = x;
    this.position.y = y + height/2;
    this.position.z = z;

    scene.add(this);
  }
}

/**
* Field Object & related functions
*/
class WidthWall extends FieldWall {
  constructor(x, y, z) {
    super()
    var height = Math.sqrt(Math.pow(2*scaling,2)/99);
    var geometry = new THREE.CubeGeometry(scaling, height, 0);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(0, 0, 0);
    this.add(mesh);

    this.position.x = x;
    this.position.y = y + height/2;
    this.position.z = z;

    scene.add(this);

  }
}


/**
* Field Object & related functions
*/
class FieldBase extends Field {
  constructor(x, y, z) {
    super()

    this.addBase(  0,  0,  0);
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
}


/**
* Ball Object & related functions
*/
class Ball extends MoveableGraphicalEntity {
  constructor(x, y, z) {
    super()
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
