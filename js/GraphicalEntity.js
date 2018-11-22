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
    this.update_queue = []

  }
  update(delta) {
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
class ChessBoard extends GraphicalEntity {
  constructor(x,y,z){
    super()

    var loader = new THREE.TextureLoader()
    loader.setCrossOrigin("use-credentials")

    var texture_bottom = loader.load("assets/textures/" + "wood.jpg")
    texture_bottom.wrapT = THREE.RepeatWrapping;
    texture_bottom.repeat.set( 1, 1 );

    var texture = loader.load("assets/textures/" + "wood.jpg")
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 0.1 );

    var geometry = new THREE.BoxGeometry( 20, 1, 20 );
    var boardMaterialsP =
    [
      new THREE.MeshPhongMaterial( {shininess: 0, map: texture, side: THREE.FrontSide} ),
      new THREE.MeshPhongMaterial( {shininess: 0, map: texture, side: THREE.FrontSide} ),
      new THREE.MeshPhongMaterial( {shininess: 0, map: loader.load("assets/textures/" + "board.png"), side: THREE.FrontSide} ),
      new THREE.MeshPhongMaterial( {shininess: 0, map: texture_bottom, side: THREE.FrontSide} ),
      new THREE.MeshPhongMaterial( {shininess: 0, map: texture, side: THREE.FrontSide} ),
      new THREE.MeshPhongMaterial( {shininess: 0, map: texture, side: THREE.FrontSide} )

    ];

    var boardMaterialsB =
    [
      new THREE.MeshBasicMaterial( {shininess: 0, map: texture, side: THREE.FrontSide} ),
      new THREE.MeshBasicMaterial( {shininess: 0, map: texture, side: THREE.FrontSide} ),
      new THREE.MeshBasicMaterial( {shininess: 0, map: loader.load("assets/textures/" + "board.png"), side: THREE.FrontSide} ),
      new THREE.MeshBasicMaterial( {shininess: 0, map: texture_bottom, side: THREE.FrontSide} ),
      new THREE.MeshBasicMaterial( {shininess: 0, map: texture, side: THREE.FrontSide} ),
      new THREE.MeshBasicMaterial( {shininess: 0, map: texture, side: THREE.FrontSide} )

    ];

    var mesh = new THREE.Mesh( geometry, boardMaterialsP)
    this.userData.mesh = mesh
    this.materials.push(boardMaterialsP)
    this.materials.push(boardMaterialsB)
    this.add(mesh);

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
    loader.setPath("assets/textures/")
    var texture = loader.load("ball14.jpg")

    var geometry = new THREE.SphereGeometry( 1.5, 32, 32 );
    var materialP = new THREE.MeshPhongMaterial( {map: texture, specular: 0xfffffff, shininess: 60} );
    var materialB = new THREE.MeshBasicMaterial( {map: texture, specular: 0xfffffff, shininess: 60} );

    var mesh = new THREE.Mesh( geometry, materialP )
    this.userData.mesh = mesh
    this.materials.push(materialP)
    this.materials.push(materialB)
    this.add(mesh)
    //this.add(new THREE.AxisHelper(3))
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
    var delta_position = this.position.clone()
    this.position.z = Math.cos(this.rotation.y)*5
    this.position.x = Math.sin(this.rotation.y)*5
    delta_position.sub(this.position)

    this.rotation.z -= 16*delta*(delta_position.length())
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
    //this.add(new THREE.AxisHelper(3))
    var light = new THREE.PointLight( 0xf4fcba, 1.5, 100, 1 );
    this.light = light
    this.add(light)
    this.position.set(x,y,z)
    this.userData.sphere = new THREE.SphereGeometry(10);
    var geometry = new THREE.SphereGeometry( 1, 32, 32 );
    var material1 = new THREE.MeshBasicMaterial();
    var material2 = new THREE.MeshBasicMaterial();
    var mesh = new THREE.Mesh( geometry, material1)
    this.userData.mesh = mesh
    this.materials.push(material1)
    this.materials.push(material2)
    console.log(this.materials)
    this.add(mesh)
    scene.add(this);
  }
  toggle(){
    if (this.light.intensity == 0) {
      this.light.intensity = 3
    } else {
      this.light.intensity = 0
    }
    this.visible = !this.visible
  }
}

class DirectionalLight extends GraphicalEntity {
  constructor(x, y, z, intensity) {
    super()
    this.intensity = intensity
    this.directionalLight = new THREE.DirectionalLight( 0xffffff, intensity );
    this.add(this.directionalLight);
    this.position.set(x ,y, z);

    this.userData.sphere = new THREE.SphereGeometry(5);
    var geometry = new THREE.SphereGeometry( 1, 32, 32 );
    var material1 = new THREE.MeshBasicMaterial();
    var material2 = new THREE.MeshBasicMaterial();
    var mesh = new THREE.Mesh( geometry, material1 )
    this.userData.mesh = mesh
    this.materials.push(material1)
    this.materials.push(material2)
    this.add(mesh)



  	scene.add(this);
  }

  // enables or disables the light
  toggle() {
    if (this.directionalLight.intensity == 0){
      this.directionalLight.intensity = this.intensity
    } else {
      this.directionalLight.intensity = 0
    }
    this.visible = !this.visible
  }
}

class AmbientLight extends GraphicalEntity {
  constructor(intensity) {
    super()
    this.intensity = intensity

    this.userData.ambientLight = new THREE.AmbientLight( 0x404040 );
    this.userData.ambientLight.intensity = this.intensity
    this.add(this.userData.ambientLight);

  	scene.add(this);
  }

  // enables or disables the light
  toggle() {
    if (this.userData.ambientLight.intensity > 0){
      this.userData.ambientLight.intensity = 0
    } else {
      this.userData.ambientLight.intensity = this.intensity
    }
  }
}

class RubikCube extends GraphicalEntity{
	constructor(x,y,z){
		super()
		var loader = new THREE.TextureLoader()
		loader.setPath("assets/textures/")

    var face_materialsP = []
    for (var i=1; i<= 6; i++){
      face_materialsP.push(new THREE.MeshPhongMaterial( {
        map: loader.load("face"+i+".png"),
        bumpMap: loader.load("bmap_face-emboss.png"),
        bumpScale: -3
      }))
    }

    var face_materialsB = []
    for (var i=1; i<= 6; i++){
      face_materialsB.push(new THREE.MeshBasicMaterial( {
        map: loader.load("face"+i+".png"),
        bumpMap: loader.load("bmap_face-emboss.png"),
        bumpScale: -3
      }))
    }

		var geometry = new THREE.BoxGeometry( 4, 4, 4 );

		var mesh = new THREE.Mesh( geometry, face_materialsP )
    this.userData.mesh = mesh
    this.materials.push(face_materialsP)
    this.materials.push(face_materialsB)
		this.add(mesh)
		this.position.set(x,y,z)
		scene.add(this)
	}
}

class PauseScreen extends GraphicalEntity{
	constructor(x,y,z){
		super()
		var loader = new THREE.TextureLoader()
    loader.setPath("assets/textures/")

		var pause = loader.load("paused2.png")
		var geometry = new THREE.PlaneGeometry( 40, 10 );
		var material = new THREE.MeshBasicMaterial({shininess: 0, map: pause} );
    material.transparent = true
		var mesh = new THREE.Mesh( geometry, material )
		this.add(mesh)
		this.position.set(x,y,z)
    this.rotation.x = 3*Math.PI/2
    //this.add(new THREE.AxisHelper(3))
		scene.add(this)
	}
}
