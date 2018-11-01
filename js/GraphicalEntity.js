/**
 * In this file, we define the objects
 */


/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class GraphicalEntity extends THREE.Object3D {
  constructor(){
    super()
  }
  update(delta) {  }

}
/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class Wing extends GraphicalEntity {
  constructor() {
    super()
    var vertices = this.generateVertices()
    var material = new THREE.MeshBasicMaterial( { color : 0x00cc00 } );

    var geometry = constructGeometry(vertices)

    var mesh = new THREE.Mesh(geometry, material)
    this.add(mesh)
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
