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
    this.boundingbox = {}
  }

  /*colision_detect(other) {
    console.log("Whoops. Not implemented")
  }*/
}
/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class NonMoveableGraphicalEntity extends GraphicalEntity {
  constructor() {
    super()
    this.boundingbox.type = "plane"

  }

  // update function is called to update the object
  update(delta) {  }

  // when the object colides with another
  colision_detect(other) {
    // wall colides with ball (calls reverse)
    if (other instanceof MoveableGraphicalEntity) {
      // ball colides with wall
      other.colision_detect_nonmoveable(this);
    }
    // otherwise it is NonMovable with NonMovable which does nothing
  }
}



/**
 * Object which can be moved around and has to simulate physics
 */
class MoveableGraphicalEntity extends GraphicalEntity {
  constructor() {
    super()

    // Physics Variables
    this.dof = new THREE.Vector3(1, 0, 0);
    this.velocity = 10 //new THREE.Vector3(0, 0, 0);
    this.acceleration = 2

    // if the object has colided in the last update
    this.colided = false

    // colision detection with spheres
    this.boundingbox.radious = Math.sqrt(Math.pow(2*scaling,2)/99) / 2
    this.boundingbox.type = "sphere"

    // are the result of the movement with no colision
    this.tent_pos = new THREE.Vector3(0, 0, 0);
    this.tent_vel = 0//new THREE.Vector3(0, 0, 0);

    // are the result of the movement with colision
    this.colide_pos =  new THREE.Vector3(0, 0, 0);
    this.colide_vel =  0//new THREE.Vector3(0, 0, 0);
  }

/**
 * Scales the Velocity by a factor
 */
  change_velocity(value) {
    this.velocity += value
  }

  // updates physics variables to a temporary variables
  tentative_update() {  }

  colision_detect(other) {
    if (other instanceof MoveableGraphicalEntity) {
      // ball colides with ball
      this.colision_detect_moveable(other);
    } else if (other instanceof NonMovableGraphicalEntity) {
      // ball colides with wall
      this.colision_detect_nonmoveable(other);
    } else {
      console.log(this, "colided with object with unidentified colision properties");
    }
  }

  colision_detect_moveable(other){
    // distance between centers of spheres
    var dist = this.position.distanceTo(other.position)

    // TODO not tested
    if (dist < this.boundingbox.radious + other.boundingbox.radious) {
      this.on_colision_moveable(other);
    }
  }

  on_colision_moveable(other){
    console.log("on_colision_moveable not implmented yet")
  }

  // we assume that if it is coliding with a non movable object
  colision_detect_nonmoveable(other){
    console.log("detecting colision")
    // gives the distance to the wall along the axis that the wall is facing
    //console.log(other.dof)
    var dist = Math.abs(other.position.dot(other.dof) - this.position.dot(other.dof))
    //console.log(dist)

    //console.log(dist, " < ", this.boundingbox.radious)
    if (dist < this.boundingbox.radious) {

      console.log("colision!")
    }
  }


  on_colision_nonmoveable(other){

  }

  // applies the temporary physics variables
  update(delta) {
    if (this.velocity>0.05) {
      this.velocity += this.acceleration*delta
      this.position.x += this.velocity*delta*this.dof.x
      this.position.z += this.velocity*delta*this.dof.z
    } else if (this.velocity<-0.05) {
      this.velocity += this.acceleration*delta
      this.position.x += this.velocity*delta*this.dof.x
      this.position.z += this.velocity*delta*this.dof.z
    }
  }
}



/**
* Field Object & related functions
*/
class Field extends NonMoveableGraphicalEntity {
  constructor() {
    super()

    this.material = new THREE.MeshBasicMaterial({ color: 0xcd853f, wireframe: true });
    this.name = "Field"
  }
}

class FieldWall extends NonMoveableGraphicalEntity {
  constructor(x, y, z) {
    super()
    this.dof.set(-x, -y, -z).normalize() // all walls point to zero
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
    this.dof.x = randFloat(0, 5)
    this.dof.z = randFloat(0, 5)
  }
}
