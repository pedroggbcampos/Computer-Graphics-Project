/*global THREE, requestAnimationFrame, console*/
var controls;
var camera, scene, renderer;
var num_balls = 10;
var scaling = 50;
var delta = 1;
var pause = false;
var flagL = false
var flag_reset = false;
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
    addObject(new AmbientLight(0.25), "ambientLight");
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
  onResize() // update to the scale once
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
}

function createOrbitControls(){
  controls = new THREE.OrbitControls( camera );
  controls.autoRotateSpeed = 3
  controls.autoRotate = true
}

function pauseMenu(){
	var hudCanvas = document.createElement('canvas');
	hudCanvas.width = window.innerWidth;
	hudCanvas.height = window.innerHeight;
	var hudBitmap = hudCanvas.getContext('2d');
	hudBitmap.font = "40px Arial";
	hudBitmap.textAlign = 'center';
	hudBitmap.fillStyle = "rgba(100,255,255)";
	hudBitmap.fillText('Pause', window.innerWidth / 2, window.innerHeight / 2);
	
	var hudTexture = new THREE.Texture(hudCanvas)
	hudTexture.needsUpdate = true;
	var material = new THREE.MeshBasicMaterial( {map: hudTexture } );
	material.transparent = true;
	
	var planeGeometry = new THREE.PlaneGeometry( window.innerWidth /4, window.innerHeight/4 );
	plane = new THREE.Mesh( planeGeometry, material );
	camera.add(plane);
	plane.position.set(0,0,-40);
	plane.visible = false;
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
              objects_named["directionalLight"].toggle()
              break;
          case "77": //M
              objects_named["ball"].toggle_speed()
              break;
          case "80": //P
              objects_named["boardLight"].toggle()
              break;
		  case "82": //R - reset
			if(flag_reset){
			  createiInit()
			  pause = !pause;
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
			 	if(plane.visible){
					plane.visible = false;
					flag_reset = false;
				}
				else{
					plane.visible = true;
					flag_reset = true;
				}
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
