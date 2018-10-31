/**
 * In this file, we define the objects
 */


/**
 * Generic Object - basically a decorated THREE.js Object3D
 */
class GraphicalEntity extends THREE.Geometry {
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
    var material = new THREE.MeshStandardMaterial( { color : 0x00cc00 } );
    this.vertices.push( new THREE.Vector3( 5, 0, 0 ) );
	this.vertices.push( new THREE.Vector3( 0, 5, 0 ) );
	this.vertices.push( new THREE.Vector3( 0, 0, 5 ) );

	var normal = new THREE.Vector3( 1, 1, 1 ); //optional
	var color = new THREE.Color( 0x00ff00 ); //optional
	var materialIndex = 0; //optional
	var face = new THREE.Face3( 0, 1, 2, normal, color, materialIndex );

	this.faces.push(face);

	this.computeFaceNormals();
	this.computeVertexNormals();

    scene.add(new THREE.Mesh(this, material))

  }

  // update function is called to update the object
  update(delta) {  }

}
