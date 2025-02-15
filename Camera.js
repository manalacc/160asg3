const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  q: false,
  e: false,
  space: false,
  c: false,
};

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w': 
      keys.up = true;
      break;
    case 's': 
      keys.down = true;
      break;
    case 'a': 
      keys.left = true;
      break;
    case 'd': 
      keys.right = true;
      break;
    case 'q': 
      keys.q = true;
      break;
    case 'e': 
      keys.e = true;
      break;
    case ' ': 
      event.preventDefault();
      keys.space = true;
      break;
    case 'c':
      keys.c = true;
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w': 
      keys.up = false;
      break;
    case 's': 
      keys.down = false;
      break;
    case 'a': 
      keys.left = false;
      break;
    case 'd': 
      keys.right = false;
      break;
    case 'q': 
      keys.q = false;
      break;
    case 'e': 
      keys.e = false;
      break;
    case ' ':
      event.preventDefault();
      keys.space = false;
      break;
    case 'c':
      keys.c = false;
      break;
  }

});


class Camera{
  constructor(){
    this.type = 'camera'
    this.fov = 60.0;
    this.eye = new Vector3([0,0,1]);
    this.at = new Vector3([0,0,-1]);
    this.up = new Vector3([0,1,0]);
    this.theta = 0;
    this.phi = 0;
    //this.viewMat = new Matrix4();
    //this.projMat = new Matrix4();
    this.moveSpeed = .05;
  }

  moveForward() {
    var d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);
    d.normalize().mul(this.moveSpeed);

    this.eye.add(d);
    this.at.add(d);
  }

  moveBackward() {
    var d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);
    d.normalize().mul(this.moveSpeed);

    this.eye.sub(d);
    this.at.sub(d);
  }

  moveLeft() {
    var d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);
    d.normalize().mul(this.moveSpeed);
    var left = Vector3.cross(d, this.up)

    this.eye.sub(left);
    this.at.sub(left);
  }

  moveRight(){
    var d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);
    d.normalize().mul(this.moveSpeed);
    var right = Vector3.cross(d, this.up)

    this.eye.add(right);
    this.at.add(right);
  }

  moveUp(){
    var d = new Vector3();
    d.set(this.up);
    d.normalize().mul(this.moveSpeed)

    this.eye.add(d);
    this.at.add(d);
  }

  moveDown() {
    var d = new Vector3();
    d.set(this.up);
    d.normalize().mul(this.moveSpeed)

    this.eye.sub(d);
    this.at.sub(d);
  }

  panLeftKey(){
    var d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);

    var r = Math.sqrt(Math.pow(d.elements[0], 2) + Math.pow(d.elements[2], 2));
    var theta = Math.atan2(d.elements[2], d.elements[0]);
    theta -= this.moveSpeed;

    var x = r * Math.cos(theta);
    var z = r * Math.sin(theta);
    var new_d = new Vector3([x, d.elements[1], z]);

    new_d.add(this.eye);
    
    this.at.set(new_d);
  }

  panRightKey(){
    var d = new Vector3();
    d.set(this.at);
    d.sub(this.eye);

    var r = Math.sqrt(Math.pow(d.elements[0], 2) + Math.pow(d.elements[2], 2));
    var theta = Math.atan2(d.elements[2], d.elements[0]);
    theta += this.moveSpeed;

    var x = r * Math.cos(theta);
    var z = r * Math.sin(theta);
    var new_d = new Vector3([x, d.elements[1], z]);

    new_d.add(this.eye);
    
    this.at.set(new_d);
  }
}



function handleKeyDown(event) { 
  switch (event.key) {
    case 'w':
      g_camera.moveForward();
      break;
    case 's':
      g_camera.moveBackward();
      break;
    case 'a':
      g_camera.moveLeft();
      break;
    case 'd':
      g_camera.moveRight();
      break;
    case 'q':
      g_camera.panLeftKey();
      break;
    case 'e':
      g_camera.panRightKey();
      break;
    case 'r':
      g_camera.moveUp();
      break;
    case 'f':
      g_camera.moveDown();
      break;
  }
}

let g_initialX = 0;
let g_initialY = 0;
let g_cameraSens = 0.25;

function updateCameraX(e) {
  var dx = (e.movementX - g_initialX) / 100;

  var d = new Vector3();
  d.set(g_camera.at);
  d.sub(g_camera.eye);

  var rx = Math.sqrt(Math.pow(d.elements[0], 2) + Math.pow(d.elements[2], 2));
  var theta = Math.atan2(d.elements[2], d.elements[0]);
  theta += dx * g_cameraSens; //yaw

  var x = rx * Math.cos(theta);
  var zx = rx * Math.sin(theta);
  var new_d = new Vector3([x, 0, zx]);

  new_d.add(g_camera.eye);
  
  g_camera.at.set(new_d);
}

function updateCameraY(e) {
  var dy = (e.movementY - g_initialY) / 100;

  var d = new Vector3();
  d.set(g_camera.at);
  d.sub(g_camera.eye);

  var r = Math.sqrt(Math.pow(d.elements[1], 2) + Math.pow(d.elements[2], 2));
  var phi = Math.atan2(d.elements[2], d.elements[1]);
  phi -= dy * g_cameraSens; //yaw

  var y = r * Math.cos(phi);
  var z = r * Math.sin(phi);
  var new_d = new Vector3([0, y, z]);

  new_d.add(g_camera.eye);
  
  g_camera.at.set(new_d);
}