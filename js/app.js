/*global THREE, requestAnimationFrame, console*/
var controls;
var camera, scene, renderer;
var pause_camera;
var num_balls = 10;
var scaling = 50;
var delta = 1;
var pause = false;
var flagL = false
var plane;

var keys_pressed = {}; // stores the keys pressed
var objects = []; // Objects in the scene
var objects_named = {} // object that are named and need to be called

var clock = new THREE.Clock();

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    addObject(new ChessBoard(0,0,0), "board");
    addObject(new Ball(0,2,0), "ball");
    addObject(new RubikCube(0,2.5,0), "rubixcube");


    addObject(new BoardLight( 2*Math.sqrt(2)*3, 1.6, 2*Math.sqrt(2)*3), "boardLight");
    //addObject(new AmbientLight(0.25), "ambientLight");
    addObject(new DirectionalLight(-10, 5, -10, 1), "directionalLight");

    scene.add(new THREE.AxisHelper(10));

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
  objects.push(object); // add object to the generic array of scene objects
  return object // returns object such that other function can catch its reference
}

/**
 * Gets an object of a specified name
 * @param {string} name - Name the object we want
 * @return {SceneObject} object -d The Object being retrieved
 */
function getObject(name){
  if (objects_named[name] !== "undefined") {
    return objects_named[name]
  } else {
    console.log("error: object is not in the list")
  }
}



function createCamera() {
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.isPerspectiveCamera = true
  camera.position.x = 30;
  camera.position.y = 30;
  camera.position.z = 30;
  camera.lookAt(scene.position);
  scene.add(camera)
}

function onResize() {
  'use strict';
  resizeCamera(camera);
  resizeCamera(pause_camera);
}

function resizeCamera(cam){
  var aspect = window.innerWidth / window.innerHeight;
  var frustumSize = 100;

  if (cam.isPerspectiveCamera) {
    cam.aspect = aspect
    //Resizes the output canvas to (width, height) with device pixel ratio taken into account
    renderer.setSize( window.innerWidth, window.innerHeight );

    // Updates the camera projection matrix. Must be called after any change of parameters.
    cam.updateProjectionMatrix();

  } else { // OrthographicCamera
    /*   __________________ ^
     *   |        |       | |
     *   |________|_______| | FrustumSize
     *   |        |       | |
     *   |________|_______| V
     *   <---------------->
     *    FrustumSize * aspect
     */
    cam.left   = - frustumSize * aspect / 2;
    cam.right  =   frustumSize * aspect / 2;
    cam.top    =   frustumSize / 2;
    cam.bottom = - frustumSize / 2;

    // Updates the camera projection matrix. Must be called after any change of parameters.
    renderer.setSize( window.innerWidth, window.innerHeight );
    cam.updateProjectionMatrix();

  }
}

function createOrbitControls(){
  controls = new THREE.OrbitControls( camera );
  controls.autoRotateSpeed = 3
  controls.autoRotate = true
}
/**
 * creates the camera and pause title
 * they are located around (0,1000,0) in order not to interfere with the rest
 * of the scene
 */
function pauseMenu(){
  // pause title
  addObject(new PauseScreen(0,999,0), "pausescreen");

  // pause OrthographicCamera
  pause_camera = new THREE.OrthographicCamera(
    window.innerWidth / - 2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / - 2,
    0, 5 ); // very short far in order not to render anything else in the scene
  pause_camera.isPerspectiveCamera = false

  pause_camera.position.set(0,1000,0)
  pause_camera.lookAt(scene.position);


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
        case "70": //F
            break;
          case "71": //G
              for (var object in objects)
                objects[object].change_material()
              break;
          case "68": //D
              if (!pause) objects_named["directionalLight"].toggle()
              break;
          case "77": //M
              if (!pause) objects_named["ball"].toggle_speed()
              break;
          case "80": //P
              if (!pause) objects_named["boardLight"].toggle()
              break;
		  case "82": //R - reset
        			if(pause){
        			  createiInit()
        			  pause = false;
        			}
              break;
          case "87": //W
              // assuming all submeshes inherit material from parent object
              for (var object in objects)
              console.log(objects[object])
                // TODO add possibility for objects to have different materials
                objects[object].material = new THREE.MeshBasicMaterial({ wireframe: true});
    			    break;
          case "83": //S - pauses the game
              pause = !pause;
              break;
      }
    }

}

function render() {
    'use strict';
    renderer.autoClear = false
    renderer.clear(true, true, true)

    renderer.render(scene, camera);

    if (pause){
      renderer.render(scene, pause_camera);
    }
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createiInit()

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

}

function createiInit(){
	createScene();
  createCamera();
  createOrbitControls();
	pauseMenu();

  onResize()

  render();
}

function animate() {
    'use strict';

    delta = clock.getDelta();
    if (!pause) {
      // Update
      controls.update() // autoRotate orbitControls
      objects.map( function(object) {
        if (typeof object.update === 'function') {
          object.update(delta);
        }
      });
    }

    render();

    requestAnimationFrame(animate);
}
