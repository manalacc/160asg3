class Triangle{
  constructor(){
    this.type = 'triangle'
    this.position = [0.0, 0.0, 0.0]
    this.vertices = [] // for drawing
    this.color = [1.0, 1.0, 1.0, 1.0]
    this.size = 10.0;
  }

  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size of a point to u_Size variable
    gl.uniform1f(u_Size, size);
    // Draw
    var d = this.size/200.0; //delta
    drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d])
  }

}
var g_vertexBuffer = null;
var g_uvBuffer = null;
var g_colorBuffer = null;

function initTriangle3Dvertex() {

  // Create a buffer object
  g_vertexBuffer = gl.createBuffer();
  if (!g_vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

}

function initTriangle3DUV() {
  g_uvBuffer = gl.createBuffer();
  if (!g_uvBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);

  // Assign the buffer object to a_UV variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_UV);
}

//function initTriangle3DColor() {
//  g_colorBuffer = gl.createBuffer();
//  if (!g_colorBuffer) {
//    console.log('Failed to create the buffer object');
//    return -1;
//  }
//
//  // Bind the buffer object to target
//  gl.bindBuffer(gl.ARRAY_BUFFER, g_colorBuffer);
//
//  // Assign the buffer object to a_UV variable
//  gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);
//
//  // Enable the assignment to a_UV variable
//  gl.enableVertexAttribArray(a_Color);
//}

function drawTriangle(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function drawTriangle3D(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length / 3; // The number of vertices

  if (g_vertexBuffer==null) {
    initTriangle3Dvertex();
  }
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  if (g_uvBuffer==null) {
    initTriangle3DUV();
  }
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  //if (!g_colorBuffer) {
  //  initTriangle3DColor();
  //}
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
//
  gl.drawArrays(gl.TRIANGLES, 0, n)

  g_vertexBuffer = null;
  g_uvBuffer = null;
  //g_colorBuffer = null;
}
