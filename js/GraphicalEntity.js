/**
 * In this file, we define the objects
 */


/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class GraphicalEntity extends THREE.Object3D {
  constructor(){
    super()
    this.materials = [] // stores the list of materials with different shadings
    this.current_material_index = 0
    this.num_materials = 3
    this.update_queue = []

    // group of meshes
    this.mesh_group = new THREE.Group();
  }
  update(delta) {
  }

  change_material() {
    console.log(this)
    this.current_material_index = (this.current_material_index + 1) % this.num_materials

    // required to do this because the scope of the following function is limited
    var material_index = this.current_material_index
    this.mesh_group.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        console.log(node.materials[material_index])
        node.material = node.materials[material_index];
      }
    });

  }

  change_calc() {
    if (flagL){
      this.mesh_group.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.material = node.materials[0];
        }
      });
    }
    else{
      var material_index = this.current_material_index
      this.mesh_group.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.material = node.materials[material_index];
        }
      });
    }
  }

}

/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class Spotlight extends GraphicalEntity {
  constructor(x, y, z,target) {
    super()

    this.enabled=true

  	this.material = new THREE.MeshBasicMaterial({ color: "yellow"});
  	this.name = "spotlight"

  	this.addSpotlightLight(0, -1, 0);
  	this.addSpotlightTop(0, 0, 0);

    this.spotLight = new THREE.SpotLight(0xFFFFFF);
    this.spotLight.position.set(0,0,0);
    this.spotLight.castShadow = true
    this.spotLight.target = target;
    this.add(this.spotLight);

  	scene.add(this);

    this.position.set(x,y,z)
    var direction = new THREE.Vector3(0, 0, 0)
    direction.sub(this.position)
    direction.setY(500)
    this.lookAt(direction)

  }

  // enables or disables the light
  toggle() {
    if (this.enabled){
      this.spotLight.intensity = 0.0
    } else {
      this.spotLight.intensity = 1
    }
    this.enabled = !this.enabled
  }

  addSpotlightTop(x, y, z){
	var geometry = new THREE.ConeGeometry(1, 2,  20, 32);
	var mesh = new THREE.Mesh(geometry, this.material);
	mesh.position.set(x, y, z);
	this.add(mesh);
  }

  addSpotlightLight(x, y, z){
	var geometry = new THREE.SphereGeometry(.5, 32, 32);
	var mesh = new THREE.Mesh(geometry, this.material);
	mesh.position.set(x, y, z);
	this.add(mesh);
  }
}

class ChessBoard extends GraphicalEntity {
  constructor(x,y,z){
    super()

    var loader = new THREE.TextureLoader()
    loader.setCrossOrigin("use-credentials")

    var texture = loader.load("assets/textures/" + "board.png")


    var geometry = new THREE.BoxGeometry( 20, 1, 20 );
    var material = new THREE.MeshPhongMaterial( {shininess: 0,
                                                 map: texture} );
    this.add(new THREE.Mesh( geometry, material ))

    this.position.set(x,y,z)
    scene.add(this)
  }
}

class Ball extends GraphicalEntity {
  constructor(x,y,z){
    super()
    this.userData.current_velocity = 0
    this.userData.max_velocity = 6
    this.userData.acceleration = 0
    var loader = new THREE.TextureLoader()
    loader.setCrossOrigin("use-credentials")
    var texture = loader.load("assets/textures/" + "ball14.jpg")

    var geometry = new THREE.SphereGeometry( 1.5, 32, 32 );
    var material = new THREE.MeshPhongMaterial( {map: texture, shininess: 60} );

    var mesh = new THREE.Mesh( geometry, material )
    this.add(mesh)
    this.add(new THREE.AxisHelper(3))
    this.position.set(x+5,y,z)
    scene.add(this)
  }

  update(){
    var max_velocity = this.userData.max_velocity
    // increments the velocity
    this.userData.current_velocity += this.userData.acceleration*delta
    if (this.userData.current_velocity < 0) { // force it to stay at zero
      console.log("reached minimum velocity")
      this.userData.current_velocity = 0;
      this.userData.acceleration = 0 // stops decreasing
    } else if (this.userData.current_velocity > max_velocity) {
      console.log("reached maximum velocity")
      this.userData.current_velocity = max_velocity
      this.userData.acceleration = 0 // stops increasing
    }

    // circular movement depend on rotation
    this.rotation.y += this.userData.current_velocity*delta
    this.position.z = Math.cos(this.rotation.y)*5
    this.position.x = Math.sin(this.rotation.y)*5
  }
  // switches between increasing and decreasing velocity
  toggle_speed(){
    if (this.userData.acceleration > 0){
      console.log("now decreasing velocity")
      this.userData.acceleration = -1
    } else if (this.userData.acceleration < 0){
      console.log("now increasing velocity")
      this.userData.acceleration = 1
    } else { // case in which it has reached either max speed or minimum speed
      if (this.userData.current_velocity > 0) {
        console.log("now decreasing velocity")
        this.userData.acceleration = -1
      } else {
        console.log("now increasing velocity")
        this.userData.acceleration = 1
      }
    }
  }
}

class Camera extends GraphicalEntity {
  constructor(x,y,z){
    super()
    this.add(camera)
    this.set(x,y,z)
  }
  update(){
    this.position.x += delta
  }
}

/*
 *
 */
class BoardLight extends GraphicalEntity {
  constructor(x,y,z) {
    super()
    this.add(new THREE.AxisHelper(10))
    var light = new THREE.PointLight( 0xf4fcba, 3, 100, 1 );
    this.light = light
    this.add(light)
    this.position.set(x,y,z)
    scene.add(this);
  }
  toggle(){
    if (this.light.intensity == 0) {
      this.light.intensity = 3
    } else {
      this.light.intensity = 0
    }
  }
}

class Ambientlight extends GraphicalEntity {
  constructor(intensity) {
    super()

    this.enabled=true

  	this.name = "ambientlight"
    this.intensity = intensity

    this.ambientLight = new THREE.AmbientLight( 0x404040 );
    this.ambientLight.intensity = this.intensity
    this.add(this.ambientLight);

  	scene.add(this);
  }

  // enables or disables the light
  toggle() {
    if (this.enabled){
      this.ambientLight.intensity = this.intensity/10
    } else {
      this.ambientLight.intensity = this.intensity
    }
    this.enabled = !this.enabled
  }
}
