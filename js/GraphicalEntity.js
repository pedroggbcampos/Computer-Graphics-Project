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
    this.mesh_group.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
		  console.log(node.material)
		  if(node.material.lights == false)
            node.material.lights = true;
		  else
		    node.material.lights = false;
      }
    });

  }

}
/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class Plane extends GraphicalEntity {
  constructor(x,y,z) {
    super()

    var fuselage = this.create_fuselage(-4,-1,0)
    this.mesh_group.add(fuselage)
    var cockpit = this.create_cockpit(-4,-1,0)
    this.mesh_group.add(cockpit)
  	var horizontal_stabilizers1 = this.create_horizontal_stabilizers(-4,4,0,"right")
  	this.mesh_group.add(horizontal_stabilizers1)
  	var horizontal_stabilizers2 = this.create_horizontal_stabilizers(-4,4,0,"left")
  	this.mesh_group.add(horizontal_stabilizers2)
  	var vertical_stabilizer = this.create_vertical_stabilizer(-4,4,0)
  	this.mesh_group.add(vertical_stabilizer)
    var wing_left = this.create_wing(-4,-1,0)
    this.mesh_group.add(wing_left)
    var wing_right = this.create_wing(-4,-1,0)
    wing_right.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI)
    wing_right.translateY(-4)
    this.mesh_group.add(wing_right)
    this.mesh_group.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), Math.PI/35)



    this.add(this.mesh_group)
    this.position.set(x,y,z)
    this.rotateY(-Math.PI / 2) // put it facing z axis
    scene.add(this)
  }

  // Plane Rotations
  pitch(value) {
    this.rotateZ(value)
  }
  yaw(value) {
    this.rotateY(value)
  }


  create_wing(x,y,z) {
    // wing vertices
    var materials = []
    var vertices = []
    var normals = []


    // first half of wing both faces
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 3, 2, -3),
      new THREE.Vector3( 3, 2, -15),
      new THREE.Vector3( 5, 2, -2)]
    ));
    normals.push(new THREE.Vector3(0, 1, 0))

    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 3, 2, -15),
      new THREE.Vector3( 3, 2, -3),
      new THREE.Vector3( 5, 2, -2)]
    ));
    normals.push(new THREE.Vector3(0, -1, 0))

    // second half of wing both faces
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 5, 2, -2),
      new THREE.Vector3( 5, 2, -15),
      new THREE.Vector3( 3, 2, -15)]
    ));
    normals.push(new THREE.Vector3(0, 1, 0))

    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 5, 2, -15),
      new THREE.Vector3( 5, 2, -2),
      new THREE.Vector3( 3, 2, -15)]
    ));
    normals.push(new THREE.Vector3(0, -1, 0))

    // tip of wing both faces
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 3, 2, -15),
      new THREE.Vector3( 5, 2, -15),
      new THREE.Vector3( 3, 2, -18)]
    ));
    normals.push(new THREE.Vector3(0, 1, 0))

    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 5, 2, -15),
      new THREE.Vector3( 3, 2, -15),
      new THREE.Vector3( 3, 2, -18)]
    ));
    normals.push(new THREE.Vector3(0, -1, 0))


    var geometry = constructGeometry(vertices, normals)


    // add the different material shading
    var wing_color = 0x00cc00;
    materials.push(new THREE.MeshBasicMaterial( { color : wing_color} ));
    materials.push(new THREE.MeshLambertMaterial( { color : wing_color} ));
    materials.push(new THREE.MeshPhongMaterial( { color : wing_color, shininess: 140 } ));

    var wing = new THREE.Mesh(geometry, materials[0])
    wing.materials = materials

    wing.position.set(x,y,z)
    return wing
  }

  create_fuselage(x,y,z) {
    // wing vertices
    var materials = []
    var vertices = []
    var normals = []


    // base front
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 15, 0, 0),
      new THREE.Vector3( 0, 0, 7.5 ),
      new THREE.Vector3( 0, 0, -7.5)]
    ));
    // base back
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( -2, 0, 0 ),
      new THREE.Vector3( 0, 0, -7.5 ),
      new THREE.Vector3( 0, 0, 7.5 )]
    ));
    // front right
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 15, 0, 0 ),
      new THREE.Vector3( 0, 0, -7.5 ),
      new THREE.Vector3( 0, 5, 0 )]
    ));
    // front left
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( 15, 0, 0),
      new THREE.Vector3( 0, 5, 0),
      new THREE.Vector3( 0, 0, 7.5)]
    ))
    // back right
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( -2, 0, 0 ),
      new THREE.Vector3( 0, 5, 0 ),
      new THREE.Vector3( 0, 0, -7.5 )]
    ));
    // back left
    vertices = vertices.concat(decompose_triangle([
      new THREE.Vector3( -2, 0, 0 ),
      new THREE.Vector3( 0, 0, 7.5 ),
      new THREE.Vector3( 0, 5, 0 )]
    ));

    var geometry = constructGeometry(vertices, normals)


    // add the different material shading
    var wing_color = 0x00cc00;
    materials.push(new THREE.MeshBasicMaterial( { color : wing_color} ));
    materials.push(new THREE.MeshLambertMaterial( { color : wing_color } ));
    materials.push(new THREE.MeshPhongMaterial( { color : wing_color, shininess: 140  } ));

    var wing = new THREE.Mesh(geometry, materials[0])
    wing.materials = materials

    wing.position.set(x,y,z)
    return wing

  }

  create_cockpit(x,y,z) {
    // wing vertices
    var materials = []
    var vertices = []
    var normals = []
    // front right
    vertices.push( new THREE.Vector3( 13, 0.7, 0 ) );
    vertices.push( new THREE.Vector3( 5, 2, -2 ) );
    vertices.push( new THREE.Vector3( 5, 4, 0 ) );
    // front left
    vertices.push( new THREE.Vector3( 13, 0.7, 0 ) );
    vertices.push( new THREE.Vector3( 5, 4, 0 ) );
    vertices.push( new THREE.Vector3( 5, 2, 2 ) );
    // back right
    vertices.push( new THREE.Vector3( 5, 2, -2 ) );
    vertices.push( new THREE.Vector3( 0, 3, 0 ) );
    vertices.push( new THREE.Vector3( 5, 4, 0 ) );
    // back left
    vertices.push( new THREE.Vector3( 5, 4, 0 ) );
    vertices.push( new THREE.Vector3( 0, 3, 0 ) );
    vertices.push( new THREE.Vector3( 5, 2, 2 ) );

    var geometry = constructGeometry(vertices, normals)


    // add the different material shading
    var wing_color = 0x0000ff;
    materials.push(new THREE.MeshBasicMaterial( { color : wing_color } ));
    materials.push(new THREE.MeshLambertMaterial( { color : wing_color } ));
    materials.push(new THREE.MeshPhongMaterial( { color : wing_color, shininess: 140  } ));

    var wing = new THREE.Mesh(geometry, materials[0])
    wing.materials = materials

    wing.position.set(x,y,z)
    return wing

  }

  create_horizontal_stabilizers(x,y,z,side) {
    // stabilizers vertices
    var materials = []
    var vertices = []
    var normals = []

	//Lado visto como estando atras do aviao
	if(side == "right"){
		//Lado inferior do estabilizador
		vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
		vertices.push( new THREE.Vector3( 0, 0, 2.5 ) );

		vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
		vertices.push( new THREE.Vector3( 2.5, 0, 2.5 ) );
		vertices.push( new THREE.Vector3( 0, 0, 2.5 ) );

		vertices.push( new THREE.Vector3( 0, 0, 2.5 ) );
		vertices.push( new THREE.Vector3( 2.5, 0, 2.5 ) );
		vertices.push( new THREE.Vector3( 0, 0, 5 ) );

		//Lado superior do estabilizador
		vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
		vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		vertices.push( new THREE.Vector3( 0, 0, 2.5 ) );

		vertices.push( new THREE.Vector3( 2.5, 0, 2.5 ) );
		vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
		vertices.push( new THREE.Vector3( 0, 0, 2.5 ) );

		vertices.push( new THREE.Vector3( 2.5, 0, 2.5 ) );
		vertices.push( new THREE.Vector3( 0, 0, 2.5 ) );
		vertices.push( new THREE.Vector3( 0, 0, 5 ) );
	}
	if(side == "left"){
		//Lado superior do estabilizador
		vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
		vertices.push( new THREE.Vector3( 0, 0, -2.5 ) );

		vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
		vertices.push( new THREE.Vector3( 2.5, 0, -2.5 ) );
		vertices.push( new THREE.Vector3( 0, 0, -2.5 ) );

		vertices.push( new THREE.Vector3( 0, 0, -2.5 ) );
		vertices.push( new THREE.Vector3( 2.5, 0, -2.5 ) );
		vertices.push( new THREE.Vector3( 0, 0, -5 ) );

		//Lado inferior do estabilizador
		vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
		vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		vertices.push( new THREE.Vector3( 0, 0, -2.5 ) );

		vertices.push( new THREE.Vector3( 2.5, 0, -2.5 ) );
		vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
		vertices.push( new THREE.Vector3( 0, 0, -2.5 ) );

		vertices.push( new THREE.Vector3( 2.5, 0, -2.5 ) );
		vertices.push( new THREE.Vector3( 0, 0, -2.5 ) );
		vertices.push( new THREE.Vector3( 0, 0, -5 ) );
	}

    var geometry = constructGeometry(vertices, normals)

    // add the different material shading
    var horizontal_stabilizer_color = 0xee00ee;
    materials.push(new THREE.MeshBasicMaterial( { color : horizontal_stabilizer_color } ));
    materials.push(new THREE.MeshLambertMaterial( { color : horizontal_stabilizer_color } ));
    materials.push(new THREE.MeshPhongMaterial( { color : horizontal_stabilizer_color, shininess: 140  } ));

    var horizontal_stabilizer = new THREE.Mesh(geometry, materials[0])
    horizontal_stabilizer.materials = materials

    horizontal_stabilizer.position.set(x,y,z)
    return horizontal_stabilizer

  }

  create_vertical_stabilizer(x,y,z) {
    // stabilizer vertices
    var materials = []
    var vertices = []
    var normals = []


    //Lado direito do estabilizador
    vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
    vertices.push( new THREE.Vector3( 0, 2.5, 0 ) );

    vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
    vertices.push( new THREE.Vector3( 2.5, 2.5, 0 ) );
    vertices.push( new THREE.Vector3( 0, 2.5, 0 ) );

    vertices.push( new THREE.Vector3( 0, 2.5, 0 ) );
    vertices.push( new THREE.Vector3( 2.5, 2.5, 0 ) );
    vertices.push( new THREE.Vector3( 0, 5, 0 ) );

  	//Lado esquerdo do estabilizador
  	vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
  	vertices.push( new THREE.Vector3( 0, 0, 0 ) );
    vertices.push( new THREE.Vector3( 0, 2.5, 0 ) );

    vertices.push( new THREE.Vector3( 2.5, 2.5, 0 ) );
    vertices.push( new THREE.Vector3( 2.5, 0, 0 ) );
    vertices.push( new THREE.Vector3( 0, 2.5, 0 ) );

    vertices.push( new THREE.Vector3( 2.5, 2.5, 0 ) );
    vertices.push( new THREE.Vector3( 0, 2.5, 0 ) );
    vertices.push( new THREE.Vector3( 0, 5, 0 ) );

    var geometry = constructGeometry(vertices, normals)

    // add the different material shading
    var vertical_stabilizer_color = 0xee0000;
    materials.push(new THREE.MeshBasicMaterial( { color : vertical_stabilizer_color } ));
    materials.push(new THREE.MeshLambertMaterial( { color : vertical_stabilizer_color } ));
    materials.push(new THREE.MeshPhongMaterial( { color : vertical_stabilizer_color, shininess: 140  } ));

    var vertical_stabilizer = new THREE.Mesh(geometry, materials[0])
    vertical_stabilizer.materials = materials

    vertical_stabilizer.position.set(x,y,z)
    return vertical_stabilizer

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
      this.spotLight.intensity = 0.8
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
