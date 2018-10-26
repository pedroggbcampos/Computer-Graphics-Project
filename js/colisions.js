/**
 * COLISION DETECTION FUNCTIONS
 **/

 /**
  * detect colisions between any kind of objects and changes the colision related vectors
  */
function objs_colision_detection(obj_array) {
  for (var i=0; i < obj_array.length; i++) {
    for (var j=i+1; j < obj_array.length; j++) {
      obj_array[i].colision_detect(obj_array[j]);
    }
  }
}

/**
 * detect colisions between one moveable object and others
 */
function detect_movable_colision(obj, objs) {
  colided = false
  for (var i=0; i < objs.length; i++) {
    if (obj.colision_detect_moveable(objs[i])) {
      colided = true;
      break
    }
  }
  return colided
}
