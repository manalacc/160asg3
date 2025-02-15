class Cube{
  constructor(){
    this.type = 'cube'
    this.color = [1.0, 1.0, 1.0, 1.0]
    this.matrix = new Matrix4();
    this.textureNum = -1;
  }

  render() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);
    
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    // Top face
    drawTriangle3DUV([0, 1, 0, 0, 1, 1, 1, 1, 1], [0,1, 0,0, 1,0]); 
    drawTriangle3DUV([0, 1, 0, 1, 1, 1, 1, 1, 0], [0,1, 1,0, 1,1]); 

    // Front face
    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangle3DUV([0, 0, 0, 1, 1, 0, 1, 0, 0], [0,0, 1,1, 1,0]); 
    drawTriangle3DUV([0, 0, 0, 0, 1, 0, 1, 1, 0], [0,0, 0,1, 1,1]); 

    // Right face
    gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
    drawTriangle3DUV([1, 0, 0, 1, 1, 0, 1, 1, 1], [1,0, 1,1, 0,1]); 
    drawTriangle3DUV([1, 0, 0, 1, 1, 1, 1, 0, 1], [1,0, 0,1, 0,0]); 

    // Back face
    gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
    drawTriangle3DUV([0, 0, 1, 1, 0, 1, 1, 1, 1], [0,0, 1,0, 1,1]); 
    drawTriangle3DUV([0, 0, 1, 1, 1, 1, 0, 1, 1], [0,0, 1,1, 0,1]); 

    // Left face
    gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
    drawTriangle3DUV([0, 0, 0, 0, 0, 1, 0, 1, 1], [0,0, 1,0, 1,1]); 
    drawTriangle3DUV([0, 0, 0, 0, 1, 1, 0, 1, 0], [0,0, 1,1, 0,1]); 

    // Bottom face
    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangle3DUV([0, 0, 0, 1, 0, 0, 1, 0, 1], [0,0, 1,0, 1,1]); 
    drawTriangle3DUV([0, 0, 0, 1, 0, 1, 0, 0, 1], [0,0, 1,1, 0,1]); 
  }

  renderfast() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);
    
    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    var allverts=[];
    var alluvs=[];

    // Top face
    allverts=allverts.concat([0, 1, 0, 0, 1, 1, 1, 1, 1]);
    allverts=allverts.concat([0, 1, 0, 1, 1, 1, 1, 1, 0]);
    alluvs=alluvs.concat([0,1, 0,0, 1,0]);
    alluvs=alluvs.concat([0,1, 1,0, 1,1]);

    // Front face
    //gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    allverts=allverts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 0, 0, 1, 0, 1, 1, 0]);
    alluvs=alluvs.concat([0,0, 1,1, 1,0], [0,0, 0,1, 1,1]);

    // Right face
    //gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
    allverts=allverts.concat([1, 0, 0, 1, 1, 0, 1, 1, 1], [1, 0, 0, 1, 1, 1, 1, 0, 1]);
    alluvs=alluvs.concat([1,0, 1,1, 0,1], [1,0, 0,1, 0,0]);
    // Back face
    //gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
    allverts=allverts.concat([0, 0, 1, 1, 0, 1, 1, 1, 1], [0, 0, 1, 1, 1, 1, 0, 1, 1]);
    alluvs=alluvs.concat([0,0, 1,0, 1,1], [0,0, 1,1, 0,1]);

    // Left face
    //gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
    allverts=allverts.concat([0, 0, 0, 0, 0, 1, 0, 1, 1], [0, 0, 0, 0, 1, 1, 0, 1, 0]);
    alluvs=alluvs.concat([0,0, 1,0, 1,1], [0,0, 1,1, 0,1]);

    // Bottom face
    //gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    allverts=allverts.concat([0, 0, 0, 1, 0, 0, 1, 0, 1], [0, 0, 0, 1, 0, 1, 0, 0, 1]);
    alluvs=alluvs.concat([0,0, 1,0, 1,1], [0,0, 1,1, 0,1])

    drawTriangle3DUV(allverts, alluvs);
  }
}
