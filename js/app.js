/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;
var num_balls = 10;
var scaling = 50;
var delta = 1;
var pause = false;
var ball_cam = false; // changes to true when user is watching ball camera


var keys_pressed = {}; // stores the keys pressed
var objects = []; // Objects in the scene
var objects_colidable = []; // Objects in the scene that are colidable
var objects_named = {} // object that are named and need to be called
var balls_in_field = []

var clock = new THREE.Clock();


function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    addObject(new LengthWall(scaling/2, 0, 0), "front");
    addObject(new LengthWall(-scaling/2, 0, 0), "back");
    addObject(new WidthWall(0, 0, scaling), "left");
    addObject(new WidthWall(0, 0, -scaling), "right");
    addObject(new FieldBase(0, 0, 0), "base", false);
    for (var i = 0; i < num_balls; i++) {
      balls_in_field.push(addObject(new FieldBall(balls_in_field)));
    }
    setTimeout("speedup()",30000)
}


/**
 * Adds an object to the list of tracket objects in the scene
 * @param {EntidadeGrafica} object - The Object add with "new ObjectName(params)"
 * @param {string} name - (Optional) Name for referencing the object
 */
function addObject(object, name, colidable){
  if (typeof name !== "undefined"){ //if it is a named object
    if (objects_named[name] === "undefined") {
      console.log("give the object another name")
    } else {
      objects_named[name]=object;
    }
  }
  if (typeof colidable == "undefined" || colidable) {
    objects_colidable.push(object)
  }
  objects.push(object); // add object to the generic array of scene objects
  return object // returns object such that other function can catch its reference
}

/**
 * Gets an object of a specified name
 * @param {string} name - Name the object we want
 * @return {SceneObject} object - The Object being retrieved
 */
function getObject(name){
  if (objects_named[name] !== "undefined") {
    return objects_named[name]
  } else {
    console.log("error: object is not in the list")
  }
}

function createCamera() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / - 2,
    -200, 200 );
    camera.isPerspectiveCamera = false
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;
    camera.lookAt(scene.position);
    camera.zoom = 1
  onResize() // update to the scale once
}

function createCameraPerspective() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.isPerspectiveCamera = true
  camera.position.x = 80;
  camera.position.y = 80;
  camera.position.z = 80;
  camera.lookAt(scene.position);
}

function createCameraPerspectiveBall() {
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
  var ball = balls_in_field[0]
  ball.add(camera)
  camera.position.y = camera.position.y + 1.6*ball.radius
  var norm_ball_dof = ball.dof.clone()
  norm_ball_dof = norm_ball_dof.normalize()
  camera.position.x = -16*norm_ball_dof.x
  camera.position.z = -16*norm_ball_dof.z

  camera.lookAt(ball.position);
}


function createCameraFront() {
  camera = new THREE.OrthographicCamera(
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
    camera.isPerspectiveCamera = false
    window.innerWidth / - 16, window.innerWidth / 16,
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1;
    camera.lookAt(scene.position);
}
function createCameraTop() {
  camera = new THREE.OrthographicCamera(
    window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
  camera.isPerspectiveCamera = false
  camera.position.x = 0;
  camera.position.y = 15;
  camera.position.z = 0;
  camera.rotation.y = (Math.PI /2)
  console.log(camera.rotation.y)
  camera.lookAt(scene.position);
}

function createCameraSide() {
  camera = new THREE.OrthographicCamera(
  window.innerWidth / - 16, window.innerWidth / 16,
    window.innerHeight / 16, window.innerHeight / - 16,
    -200, 500 );
  camera.isPerspectiveCamera = false
  camera.position.x = 1;
  camera.position.y = 0;
  camera.position.z = 0;
  camera.lookAt(scene.position);
}

function onResize() {
  'use strict';
  var aspect = window.innerWidth / window.innerHeight;
  var frustumSize = 100;

  if (camera.isPerspectiveCamera) {
    camera.aspect = aspect
    //Resizes the output canvas to (width, height) with device pixel ratio taken into account
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Updates the camera projection matrix. Must be called after any change of parameters.
    camera.updateProjectionMatrix();

  } else { // OrthographicCamera
    /*   __________________ ^
     *   |        |       | |
     *   |________|_______| | FrustumSize
     *   |        |       | |
     *   |________|_______| V
     *   <---------------->
     *    FrustumSize * aspect
     */
		camera.left   = - frustumSize * aspect / 2;
		camera.right  =   frustumSize * aspect / 2;
		camera.top    =   frustumSize / 2;
		camera.bottom = - frustumSize / 2;

    // Updates the camera projection matrix. Must be called after any change of parameters.
		camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  }


  /*var w = window.innerWidth;
  var h = window.innerHeight;
  var viewSize =  80 * (1 / h + 1 / w);
  camera.left = w / - 2 * viewSize;
  camera.right = w / 2 * viewSize;
  camera.top = h / 2 * viewSize;
  camera.bottom = h / - 2 * viewSize;
  camera.updateProjectionMatrix();
  renderer.setSize( w, h );*/
}

function onKeyUp(e) {
  'use strict';
  keys_pressed[e.keyCode]=false;
}

function onKeyDown(e) {
    'use strict';

    // getting the objects

    keys_pressed[e.keyCode]=true
    for (var key in keys_pressed) {
      if (!keys_pressed[key]) continue;
      switch (key) {
          case "66": //B
              break;
          case "37": // left
              break;
          case "38": // up
              break;
          case "39": // right
              break;
          case "40": // down
              break;
          case "49": // 1
              ball_cam = false;
              createCameraTop();
              break;
          case "50": // 2
              ball_cam = false;
              createCameraPerspective();
              break;
          case "51": // 3
              ball_cam = true;
              createCameraPerspectiveBall();
              break;
          case "65": //A
              // assuming all submeshes inherit material from parent object
              for (var object in objects)
                // TODO add possibility for objects to have different materials
                objects[object].material.wireframe = !objects[object].material.wireframe;
              break;
          case "69": //E
              //shows or hides the axis to each ball in the Field
              for (var ball in balls_in_field)
                balls_in_field[ball].axis.visible = !balls_in_field[ball].axis.visible;
              break;
          case "80": //P - pauses the game
              pause = !pause;
              break;
      }
    }

}

function render() {
    'use strict';

    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    delta = clock.getDelta();
    if (!pause) {

      // Tentative Update
      objects.map( function(object) {
        if (typeof object.tentativeUpdate === 'function') {
          object.tentativeUpdate(delta);
        }
      })

      // colision update
      objs_colision_detection(objects_colidable)

      // Update
      objects_colidable.map( function(object) {
        if (typeof object.update === 'function') {
          object.update(delta);
        }
      });
    }
    //console.log(clock.elapsedTime)

    render();

    requestAnimationFrame(animate);
}
