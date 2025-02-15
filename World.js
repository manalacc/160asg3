// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`
  
// Fragment shader program
var FSHADER_SOURCE =`
    precision mediump float;
    uniform vec4 u_FragColor;
    varying vec2 v_UV;  
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform int u_whichTexture;
    void main() {
      if (u_whichTexture == -2) {
        gl_FragColor = u_FragColor;

      } else if (u_whichTexture == -1) {
        gl_FragColor = vec4(v_UV,1.0,1.0);

      } else if (u_whichTexture == 0) {
        gl_FragColor = texture2D(u_Sampler0, v_UV);

      } else if (u_whichTexture == 1) {
        gl_FragColor = texture2D(u_Sampler2, v_UV);

      } else if (u_whichTexture == 2) {
        vec4 sofa = texture2D(u_Sampler2, v_UV);
        vec3 sofa_color = mix(u_FragColor.rgb, sofa.rgb, sofa.a);

        gl_FragColor = vec4(sofa_color, 1);

      } else if (u_whichTexture == 3) {
        gl_FragColor = vec4(v_UV, 0.5,0.2);

      } else if (u_whichTexture == 4) {
        gl_FragColor = texture2D(u_Sampler1, v_UV);

      } else {
         gl_FragColor = vec4(1, .2, .2, 1);
      }
    }`


// Glb vars
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;


function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas)
    gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }    
    

    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
    }

    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return false;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return false;
    }

    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return false;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return false;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// UI globals
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize = 10;
let g_selectedSegments = 10;
let g_globalAngle = 0;
let g_mouseDragging = false;
let g_globalAngleX = 0;
let g_globalAngleY = 0;
let g_globalAngleZ = 0;
let g_tailPos = 0;
let g_camera = new Camera();

function addActionsForHtmlUI() {
}

g_imagePaths = [
    'textures/carpet.jpg',
    'textures/fn.jpg',
    'textures/sofaa.jpg',
]

function initTextures(){

    for (i=0; i<3; i++){
        var image = new Image();
        if(!image) {
            console.log('Failed to create the image object');
            return false;
        }
        sendTextureToGLSL(image, i);
    }
    return true;
}

function sendTextureToGLSL(image, index) {
    if (index === 0) {
        var texture0 = gl.createTexture();
        if (!texture0) {
            console.log('failed to create the texture object')
            return false;
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
        image.onload = () => {
            // Make the texture unit active
            gl.activeTexture(gl.TEXTURE0);
            // Bind the texture object to the target
            gl.bindTexture(gl.TEXTURE_2D, texture0);
            // Set texture parameters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // Set the texture image
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            // Set the texture unit number to the sampler
            gl.uniform1i(u_Sampler0, 0);
        }
        image.src = g_imagePaths[index]

    } else if (index === 1) {
        var texture1 = gl.createTexture();
        if (!texture1) {
            console.log('failed to create the texture object')
            return false;
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
        image.onload = () => {
            // Make the texture unit active
            gl.activeTexture(gl.TEXTURE1);
            // Bind the texture object to the target
            gl.bindTexture(gl.TEXTURE_2D, texture1);
            // Set texture parameters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // Set the texture image
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            // Set the texture unit number to the sampler
            gl.uniform1i(u_Sampler1, 1);
        }
        image.src = g_imagePaths[index]
    } else if (index === 2) {
        var texture2 = gl.createTexture();
        if (!texture2) {
            console.log('failed to create the texture object')
            return false;
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
        image.onload = () => {
            // Make the texture unit active
            gl.activeTexture(gl.TEXTURE2);
            // Bind the texture object to the target
            gl.bindTexture(gl.TEXTURE_2D, texture2);
            // Set texture parameters
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            // Set the texture image
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            // Set the texture unit number to the sampler
            gl.uniform1i(u_Sampler2, 2);
        }
        image.src = g_imagePaths[index]
    }

    //console.log('loadTexture done');
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
} 

function main() {

    setupWebGL();

    connectVariablesToGLSL();

    // camera controls
    // window.addEventListener('keydown', handleKeyDown);

    addActionsForHtmlUI();

    // hides the mouse so we can move the camera with it when we click on the canvas
    canvas.onclick = function() {
        canvas.requestPointerLock();
        if (document.pointerLockElement === canvas) { click() }
    }

    canvas.onmousemove = function(ev) {
       if (document.pointerLockElement === canvas) {updateCameraX(ev);}
    };

    initTextures(gl, 0);

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    requestAnimationFrame(tick);
}

var g_startTime=performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;
let g_lastFrameTime = performance.now();
let g_fps = 0;

function tick() {
    let now = performance.now();
    let deltaTime = now - g_lastFrameTime;
    g_lastFrameTime = now;

    g_fps = Math.round(1000 / deltaTime);

    document.getElementById("fps").innerText = `FPS: ${g_fps}`;

    g_seconds=performance.now()/1000.0 - g_startTime;

    if(keys.up) {
        g_camera.moveForward();
    }
    if (keys.down) {
        g_camera.moveBackward();
    }
    if (keys.left) {
        g_camera.moveLeft();
    }
    if (keys.right) {
        g_camera.moveRight();
    }
    if (keys.q) {
        g_camera.panLeftKey();
    }
    if (keys.e) {
        g_camera.panRightKey();
    }
    if (keys.space) {
        g_camera.moveUp();
    }
    if (keys.c) {
        g_camera.moveDown();
    }
    
    renderAllShapes();

    requestAnimationFrame(tick);
}

var g_shapesList = [];

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    
    return([x, y])
}

const b = [0,0,0];
const d = [0.670, 0.373, 0.0335];

let g_map = [                                    // W
    [0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, ],
    [0, 1, 1, 5, '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', 5, 1, 1, 0, ],
    [0, 1, 1, 5, '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', 5, 1, 1, 0, ],
    [0, 1, 1, 5, '5', '5', '5', [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], [15, b, -2], '5', '5', '5', 5, 1, 1, 0, ],
    [0, 1, 1, 5, '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', 5, 1, 1, 0, ],
    [0, 1, 1, 5, '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', '5', 5, 1, 1, 0, ],
    [0, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 0, ],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, '4', '4', '4', '4', '4', '4', '4', 5, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4', '4', '4', '4', '4', '4', '4', '4', '4', 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4', '4', '4', '4', '4', '4', '4', '4', '4', 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4', '4', '4', '4', '4', '4', '4', '4', '4', 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4', '4', '4', '4', '4', '4', '4', '4', '4', 0, 0, 0, 0, 0, ], // <-S N->
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4', '4', '4', '4', '4', '4', '4', '4', '4', 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4', '4', '4', '4', '4', '4', '4', '4', '4', 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '4', '4', '4', '4', '4', '4', '4', '4', '4', 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, '4', '4', '4', '4', '4', '4', '4', 5, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 7, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 7, 0, 0, 0, ],
    [0, 0, 0, 7, [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], 7, 0, 0, 0, ],
    [0, 0, 0, 7, [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], 7, 0, 0, 0, ],
    [0, 0, 0, 7, [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], 7, 0, 0, 0, ],
    [0, 0, 0, 7, [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], 7, 0, 0, 0, ],
    [0, 0, 0, 7, [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], [5, d, 2], 7, 0, 0, 0, ],
    [0, 0, 0, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
]                                              // S

function drawMap() {
    var body = new Cube();
    for (x = 0; x < 32; x++) {
        for (y = 0; y < 32; y++) {
            if (Array.isArray(g_map[x][y])) {
                // custom color
                body.matrix.setTranslate(0, 0, 0);
                body.textureNum = g_map[x][y][2];
                body.color = g_map[x][y][1]
                body.matrix.translate(x-16, -1.125, y-16);
                body.matrix.scale(1, g_map[x][y][0], 1);
                body.renderfast();
            } else if (typeof g_map[x][y] === 'string') {
                // floating
                body.matrix.setTranslate(0, 0, 0);
                body.textureNum = -2;
                body.color = d;
                body.matrix.translate(0, parseInt(g_map[x][y]), 0);
                body.matrix.translate(x-16, -1.125, y-16);
                body.matrix.scale(1, 1, 1);
                body.renderfast();
            } else if (g_map[x][y]!=0 && typeof g_map[x][y] !== 'string') {
                //default
                body.matrix.setTranslate(0, 0, 0);
                body.textureNum = -2;
                body.color = d;
                body.matrix.translate(x-16, -1.125, y-16);
                body.matrix.scale(1, g_map[x][y], 1);
                body.renderfast();
                
            }
        }
    }
}

let g_screenTexture = -2;
// destroy or place block next to player (g_camera.eye)
function click() {
    x_eye = Math.round((parseInt(g_camera.eye.elements[0])/24)*32);
    y_eye = Math.round((parseInt(g_camera.eye.elements[1])/24)*32);
    z_eye = 32-Math.abs(Math.round((parseInt(g_camera.eye.elements[2])/24)*32));

    x_at = Math.round((parseInt(g_camera.at.elements[0])/24)*32);
    y_at = Math.round((parseInt(g_camera.at.elements[1])/24)*32);
    z_at = Math.round((parseInt(g_camera.at.elements[2])/24)*32);

    //console.log('EYE:', x_eye, y_eye, 32-Math.abs(z_eye));
    //console.log('AT:', x_at, y_at, z_at-32);

    if (x_eye <= 32 || y_eye <= 32 || z_eye <= 32) {
        //console.log(g_map[x_eye][Math.abs(z_eye)])
        if (g_map[x_eye][Math.abs(z_eye)] == 0) {
            g_map[x_eye][Math.abs(z_eye)] = 1
        } else if ((x_eye >= 3 && x_eye <= 5) && (y_eye >= 5 && y_eye < 13) && (x_eye >= 3 && x_eye <= 5)) {
            g_screenTexture += 1;
            console.log(g_screenTexture)
            if (g_screenTexture > 5) {
                g_screenTexture = -2;
            }
        } else {
            g_map[x_eye][Math.abs(z_eye)] = 0
        } 
        
    }

    drawMap();
}

function renderAllShapes() {

    var projMat = new Matrix4();
    projMat.setPerspective(g_camera.fov + 30, canvas.width/canvas.height, .1, 100)
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    var viewMat = new Matrix4();
    viewMat.setLookAt(
      g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
      g_camera.at.elements[0],  g_camera.at.elements[1],  g_camera.at.elements[2],
      g_camera.up.elements[0],  g_camera.up.elements[1],  g_camera.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements)

    var globalRotMat = new Matrix4();
    globalRotMat.rotate(g_globalAngleX, 1, 0, 0);
    globalRotMat.rotate(g_globalAngleY, 0, 1, 0);
    globalRotMat.rotate(g_globalAngleZ, 0, 0, 1);
    globalRotMat.scale(0.75, 0.75, 0.75);
    globalRotMat.translate(16, -0.5, -16)
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.clear(gl.COLOR_BUFFER_BIT);

    var floor = new Cube();
    floor.textureNum = 0;
    floor.color = [0.910, 0.842, 0.764]
    floor.matrix.setTranslate(0, 0, 0)
    floor.matrix.translate(0, -1.125, 0)
    floor.matrix.scale(32, 0, 32);
    floor.matrix.translate(-0.5, -.5, -0.5);
    floor.renderfast();

    var screen = new Cube();
    screen.textureNum = g_screenTexture;
    screen.color = [0,0,0];
    screen.matrix.translate(-11.95,13.75,-6.5);
    screen.matrix.rotate(90,1,0,0);
    screen.matrix.rotate(90,0,0,1);
    screen.matrix.scale(13, 0, 9);
    screen.renderfast();

    var sky = new Cube();
    sky.textureNum = -2;
    sky.color = ([0.426, 0.990, 0.981, 1.0]);
    sky.matrix.scale(64, 64, 64);
    sky.matrix.translate(-.5, -.5, -.5)
    sky.renderfast();

    drawMap();
    drawCat();
}
