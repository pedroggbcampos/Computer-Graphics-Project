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
}
/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class Wing extends GraphicalEntity {
  constructor() {
    super()
    var vertices = [];
    var material = new THREE.MeshBasicMaterial( { color : 0x00cc00 } );
    vertices.push( new THREE.Vector3( 5, 0, 0 ) );
	  vertices.push( new THREE.Vector3( 0, 5, 0 ) );
  	vertices.push( new THREE.Vector3( 0, 0, 5 ) );
    vertices.push( new THREE.Vector3( 5, 0, 0 ) );
    vertices.push( new THREE.Vector3( 0, 0, 5 ) );
    vertices.push( new THREE.Vector3( 5, 0, 5 ) );

    this.Mesh = constructGeometry(vertices, material)
    scene.add(this.Mesh)

  }

  // update function is called to update the object
  update(delta) {  }

}
