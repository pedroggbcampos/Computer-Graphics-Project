/// Constants
ALLOWED_POLY_LENGTH = 8

function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Polygonal mesh functions
 */

/**
  *Function that constructs a given geometry and returns its Mesh
      vertices, positions: array of THREE.Vector3()
      material: for example new THREE.MeshBasicMaterial()
      rgb: new THREE.Color() type
  */
function constructGeometry(vertices, normals) {
  var geometry = new THREE.Geometry();
  var j = 0
  var normal = new THREE.Vector3();
  console.log(vertices)
  for (var vertex in vertices)
    geometry.vertices.push(vertices[vertex]);
  for (var i = 0; i < vertices.length; i += 3){  // vertices / 3  = number of faces
      if (normals.length != 0){
        var normal = normals[j];
      }
      var face = new THREE.Face3( i, i + 1, i + 2, normal);
      console.log(normals[j])
      j+=1
      geometry.faces.push(face);
  }

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  return geometry
}

/**
 * Decomposes a given triangle in
 *     |\ (b)
 *     | \
 *     |  \
 * (d) |---| (c)
 *     |  /
 *     | /
 *     |/ (a)
 **/
function decompose(vertices, level=0){
  var num_vertices = vertices.length
  var result = vertices

  // step 1: decompose in triangles if not already like so
  // it pairs the first vertex with all other pairs to form triangles
  // /!\ Part of the code incomplete
  /*if (num_vertices > 3) {
    result = []
    for (var i=1; i<num_vertices-1; i++) {
      console.log("decomposing!!!")
      console.log(vertices[0],vertices[i],vertices[i+1])
      result.concat(decompose_triangle([
        vertices[0],
        vertices[i],
        vertices[i+1]
      ]));
    }
    return result
  }
  result = vertices*/
  // step 2: determine the longes edge
  var distances = [] // contains the distances of the vertices in order
  var max_distance = 0 // stores the maximum distance between two consecutive vertices
  var max_i = 0        // stores the index of the above
  for (var i in vertices){
    if (vertices[i].distanceTo(vertices[(i+1)%num_vertices])> max_distance)
      max_i = i;
  }

  edge1 = max_i
  edge2 = (edge1+1)%3
  edge3 = (edge1+2)%3

  // goes through all the edges until it finds one with bigger lenght than permitterd
  for (var i=0; i < 3; i++) {
    console.log(level, " with distance ",vertices[edge1].distanceTo(vertices[edge2]))
    if (vertices[edge1].distanceTo(vertices[edge2]) > ALLOWED_POLY_LENGTH) {
      var a = vertices[edge1]
      var b = vertices[edge2]
      var c = vertices[edge3]

      var ab = vertices[edge2].clone()
      ab.sub(a)
      ab.setLength(ab.length()/2)
      var d = a.clone()
      d = d.add(ab)

      var triangle1 = decompose_triangle([a, d, c],level+1)
      var triangle2 = decompose_triangle([d, b, c], level+1)

      result = triangle1.concat(triangle2)
      break
    }
    edge1 = (edge1+1)%3
    edge2 = (edge1+2)%3
    edge3 = (edge1+3)%3
  }
  return result
}
// decompose triangle decorator
// adds functionality
function decompose_triangle(vertices, enabled=false){
  if (!enabled) return vertices
  var verts = decompose(vertices)
  return verts

}
