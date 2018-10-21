/**
 * COLISION DETECTION FUNCTIONS
 **/

function objs_colision_detection(obj_array) {
  for (var i=0; i < obj_array.length; i++) {
    for (var j=i+1; j < obj_array.length; j++) {
      obj_array[i].colision_detect(obj_array[j]);
    }
  }
}
