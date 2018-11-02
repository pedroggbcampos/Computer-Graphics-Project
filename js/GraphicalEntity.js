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
  }
  update(delta) {  }

  change_material() {
    console.log()
    this.mesh.material = this.materials[(this.current_material_index + 1 )% (this.materials.length )]
    this.current_material_index += 1
  }

}
/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class Wing extends GraphicalEntity {
  constructor(x,y,z) {
    super()
    var vertices = this.generateVertices()

    // add the different material shading
    var wing_color = 0x00cc00;
    this.materials.push(new THREE.MeshBasicMaterial( { color : wing_color } ));
    this.materials.push(new THREE.MeshLambertMaterial( { color : wing_color } ));
    this.materials.push(new THREE.MeshPhongMaterial( { color : wing_color } ));

    var geometry = constructGeometry(vertices)


    console.log( this.materials[0])
    this.mesh = new THREE.Mesh(geometry, this.materials[0])

    this.add(this.mesh)
    this.position.set(x,y,z)
    scene.add(this)
  }

  generateVertices() {
    var vertices = [];
    vertices.push( new THREE.Vector3( 5, 0, 0 ) );
	  vertices.push( new THREE.Vector3( 0, 5, 0 ) );
  	vertices.push( new THREE.Vector3( 0, 0, 5 ) );

    vertices.push( new THREE.Vector3( 5, 0, 0 ) );
    vertices.push( new THREE.Vector3( 0, 0, 5 ) );
    vertices.push( new THREE.Vector3( 5, 0, 5 ) );

    vertices.push( new THREE.Vector3( 0, 0, 5 ) );
    vertices.push( new THREE.Vector3( 0, 0, 10 ) );
    vertices.push( new THREE.Vector3( 5, 0, 10 ) );

    return vertices
  }

  // update function is called to update the object
  update(delta) {  }

}
