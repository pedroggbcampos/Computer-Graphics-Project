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
  tentativeUpdate (delta) {
  	// remembers current position and velocity
  	this.colide_pos.x = this.position.x
  	this.colide_pos.y = this.position.y
  	//this.colide_vel.x = this.velocity.x
  	//this.colide_vel.y = this.velocity.y
    console.log(this.colide_pos)
  	// updates the tentative variables to the next position and velocity
  	if (this.velocity>0.05) {
      this.tent_vel += this.acceleration*delta
      this.tent_pos.x += this.velocity*delta*this.dof.x
      this.tent_pos.z += this.velocity*delta*this.dof.z
    } else if (this.velocity<-0.05) {
      this.tent_vel += this.acceleration*delta
      this.tent_pos.x += this.velocity*delta*this.dof.x
      this.tent_pos.z += this.velocity*delta*this.dof.z
    }
    console.log(this.tent_pos)
  }

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
    var dist = this.tent_pos.distanceTo(other.tent_pos)

    // TODO not tested
    if (dist < this.boundingbox.radious + other.boundingbox.radious) {
      this.on_colision_moveable(other);
    }
  }

  on_colision_moveable(other){
    /*console.log("resolved colision between balls")
    this.position.x = this.colide_pos.x
  	this.position.y = this.colide_pos.y
    other.position.x = other.colide_pos.x
    other.position.y = other.colide_pos.y
    var tmp_velocity = this.velocity
    this.velocity = - other.velocity
    other.velocity = - tmp_velocity
    */
  }

  // we assume that if it is coliding with a non movable object
  colision_detect_nonmoveable(other){
    console.log("detecting colision with wall")
    // gives the distance to the wall along the axis that the wall is facing
    var dist = Math.abs(other.position.dot(other.dof) - this.tent_pos.dot(other.dof))
    console.log()
    console.log(other.dof)

    console.log(dist, " < ", this.boundingbox.radious)
    //console.log(typeof(this))
    if (dist < this.boundingbox.radious) {
      this.on_colision_nonmoveable(other)

    }

  }


  on_colision_nonmoveable(other){
    /*
    console.log("resolved colision with wall")
    this.position.x = this.colide_pos.x
  	this.position.y = this.colide_pos.y
  	var tmp_dof = new THREE.Vector3()
    console.log(other.dof)
    tmp_dof.copy(other.dof)
    console.log(this.tmp_dof)
    tmp_dof.multiplyScalar(-1) // invertes it
    this.dof.multiplyVectors(this.dof, tmp_dof)
    console.log(this.tmp_dof)
    console.log(this.dof)
    console.log("colision!")
    */
  }

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
    console.log(this.dof)
  }
}


/**
* Field Object & related functions
*/
class LengthWall extends FieldWall {
  constructor(x, y, z) {
    super(x, y, z)
    var height = Math.sqrt(Math.pow(2*scaling,2)/99);
    var geometry = new THREE.CubeGeometry(0, height , 2*scaling);
    var mesh = new THREE.Mesh(geometry, this.material);
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
    super(x, y, z)
    var height = Math.sqrt(Math.pow(2*scaling,2)/99);
    var geometry = new THREE.CubeGeometry(scaling, height, 0);
    var mesh = new THREE.Mesh(geometry, this.material);
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
    this.dof.x = randFloat(-5, 5)
    this.dof.z = randFloat(-5, 5)
  }

}
