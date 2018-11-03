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
    this.mesh_group = new THREE.Group();
  }
  update(delta) {  }

  change_material() {
    console.log()
    this.current_material_index = (this.current_material_index + 1) % this.num_materials

    this.mesh_group.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.material = node.materials[this.current_material_index];
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

    var wing = this.create_wing(0,0,0)
    this.mesh_group.add(wing)

    this.add(this.mesh_group)
    this.position.set(x,y,z)
    scene.add(this)
  }

  create_wing(x,y,z) {
    var wing = new THREE.Mesh(geometry, this.materials[0])
    // wing vertices
    wing.materials = []
    var vertices = []
    vertices.push( new THREE.Vector3( 5, 0, 0 ) );
    vertices.push( new THREE.Vector3( 0, 5, 0 ) );
    vertices.push( new THREE.Vector3( 0, 0, 5 ) );

    vertices.push( new THREE.Vector3( 5, 0, 0 ) );
    vertices.push( new THREE.Vector3( 0, 0, 5 ) );
    vertices.push( new THREE.Vector3( 5, 0, 5 ) );

    vertices.push( new THREE.Vector3( 0, 0, 5 ) );
    vertices.push( new THREE.Vector3( 0, 0, 10 ) );
    vertices.push( new THREE.Vector3( 5, 0, 10 ) );

    var geometry = constructGeometry(vertices)

    // add the different material shading
    var wing_color = 0x00cc00;
    wing.materials.push(new THREE.MeshBasicMaterial( { color : wing_color } ));
    wing.materials.push(new THREE.MeshLambertMaterial( { color : wing_color } ));
    wing.materials.push(new THREE.MeshPhongMaterial( { color : wing_color } ));

    wing.position.set(x,y,z)
    return wing

  }


  // update function is called to update the object
  update(delta) {  }

}
