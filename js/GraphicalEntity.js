/**
 * In this file, we define the objects
 */


/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class GraphicalEntity extends THREE.Object3D {
  constructor() {
    super()
    this.dof = new THREE.Vector3( 1, 0, 0 ); // facing direction
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
    this.normal = new THREE.Vector3

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
    this.tent_dof = new THREE.Vector3(0, 0, 0);
    this.tent_vel = 10

    // are the result of the movement with colision
    this.colide_pos =  new THREE.Vector3(0, 0, 0);
    this.colide_dof =  new THREE.Vector3(0, 0, 0);
    this.colide_vel =  10
  }

/**
 * Scales the Velocity by a factor
 */
  change_velocity(value) {
    this.velocity += value
  }

  // updates physics variables to a temporary variables
  tentativeUpdate (delta) {
	   // updates the tentative variables to the next position and velocity
    //this.tent_vel = this.acceleration*delta
    this.tent_pos.x = this.position.x + this.velocity*delta*this.dof.x
    this.tent_pos.z = this.position.z + this.velocity*delta*this.dof.z
    this.tent_dof = this.dof
  }

  /**
   * simply applies the valies of pos, dof and vel calculated,
   * depending on wether or not it had a colision
   */
   update() {
     //console.log(this.position," -> ", this.tent_pos)
     //console.log(this.colided)
     if (this.colided == true) {
       this.dof = this.colide_dof
       if(this === balls_in_field[0] && ball_cam){ //if true it means the ball with the camera collided
         //changes the direction in which the camera is pointing to the direction in which the ball is moving
         console.log(this.dof.x, this.dof.z)
         camera.lookAt(new THREE.Vector3(this.dof.x, 9.3, this.dof.z));
       }
       this.position.x = this.colide_pos.x
       this.position.z = this.colide_pos.z
       //console.log("updating with colided ", this.position)
       this.velocity = this.colide_vel
     } else {
       this.dof = this.tent_dof

       this.position.x = this.tent_pos.x
       this.position.z = this.tent_pos.z

       this.velocity = this.tent_vel
     }
     this.colided = false
     //this.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), this.dof.x/30)
     //this.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), this.dof.z/30)

   }

  colision_detect(other) {
    // console.log("> detecting colision")
    if (other instanceof MoveableGraphicalEntity) {
      this.colision_detect_moveable(other); // ball colides with ball
    } else if (other instanceof NonMovableGraphicalEntity) {
      this.colision_detect_nonmoveable(other); // ball colides with wall
    } else {
      console.log(this, "colided with object with unidentified colision properties");
    }
  }

  colision_detect_moveable(other){
    // distance between centers of spheres
    var dist = this.tent_pos.distanceTo(other.tent_pos)

    // TODO not tested
    if (dist < this.boundingbox.radious + other.boundingbox.radious) {
      this.colided = true
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
    // gives the distance to the wall along the axis that the wall is facing

    // masking out normal coordinate to obtain de distance to the plane

    // vect_non_movalbe_movabe = other.position - this.position
    var dist_vect = this.position.clone()
    dist_vect.sub(other.position)

    var dist = dist_vect.dot(other.normal)

    if (dist < this.boundingbox.radious) {
      this.colided = true
      this.on_colision_nonmoveable(other)
    }
  }

 /**
  *
  */
  on_colision_nonmoveable(other){
    /**
     * BUG when the ball is too deep into the wall when the detection is called
     */
    // reflection_vector = dof−2(dof⋅normal)normal
    //console.log("colided with wall", other.normal)
    var incidence_vector = this.dof.clone()

    var reflextion_vector = incidence_vector.clone()
    var normal = other.normal.clone()
    reflextion_vector.sub(normal.multiplyScalar(2*incidence_vector.dot(other.normal)))
    //console.log("original: ", incidence_vector , " refletected: ", reflextion_vector)
    this.colide_dof = reflextion_vector
    this.colide_pos.x = this.position.x + this.velocity*delta*this.colide_dof.x
    this.colide_pos.z = this.position.z + this.velocity*delta*this.colide_dof.z
    //console.log("(with collision) ", this.position, ">", this.tent_pos)
    //console.log("(w/o/ collision) ", this.position, ">", this.colide_pos)
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

class FieldWall extends Field {
  constructor(x, y, z) {
    super()
    this.normal.set(-x, 0, -z).normalize() // all walls point to zero
  }
}


/**
* Field Object & related functions
*/
class LengthWall extends FieldWall {
  constructor(x, y, z) {
    super(x, y, z)
    this.name = "LengthWall"
    console.log(this.material)
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
    this.name = "WidthWall"
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
    mesh.position.set(x, y, z);
    this.add(mesh);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.axis = new THREE.AxisHelper(12)
    //this.axis.visible = !this.axis.visible;
    this.add(this.axis);

    scene.add(this);
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
    this.position.y += this.radius
    this.position.z = randFloat(min_y, max_y)
    this.dof.x = randFloat(-5, 5)
    this.dof.z = randFloat(-5, 5)
  }

}
