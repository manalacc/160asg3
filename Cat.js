const ORANGE = [1.0, 0.5, 0.0, 1.0];
const ORANGE2 = [.95, 0.49, 0.1, 1.0];

let g_legAngle = -10;
let g_direction = 1;  // 1 = forward, -1 = backward
let g_tuftAngle = 45;
let g_body2Angle = 45;
let g_legPosZ = 0;
let g_legPosY = -0.7;
let g_mouthPosY = 0.035;

function drawCat() {
    var cube = new Cube();
    var tri = new TriPrism();
    cube.textureNum = -2;
    
    // body 
    cube.matrix.setTranslate(0, 0, 0);
    cube.color = [1,1,1,1];
    cube.matrix.translate(-.25, -.25, 0.0);
    cube.matrix.scale(0.5, .5, .5);
    cube.render();

    // body 2
    cube.color = ORANGE;
    cube.matrix.setTranslate(0, 0, 0);
    cube.matrix.translate(-.275, -0.55, 1.025);
    cube.matrix.rotate(180, 1, 0, 0);
    cube.matrix.rotate(g_body2Angle, 1, 0, 0);
    cube.matrix.scale(0.55, .5, 1);
    cube.render();

    //body 3
    cube.color = ORANGE;
    cube.matrix.setTranslate(0, 0, 0);
    cube.matrix.translate(-.275, -0.55, .525);
    cube.matrix.rotate(90, 1, 0, 0);
    cube.matrix.scale(0.55, .5, .55);
    cube.render();

    //white tuft of fur
    tri.matrix.setTranslate(0,0,0);
    tri.matrix.translate(-.125, -.21, -0.05);
    tri.matrix.rotate(g_tuftAngle, 1, 0, 0);
    tri.matrix.scale(0.25,.15,.75);
    tri.render();

    // head
    cube.matrix.setTranslate(0,0,0);
    cube.color = ORANGE;
    cube.matrix.translate(-.275, -0.05, -0.05);
    cube.matrix.scale(0.55, .5, .57);
    cube.render();

    // mouth
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(-0.15, 0, -0.1);
    cube.matrix.rotate(10, 0, 0, 1);
    cube.matrix.scale(0.2, .1, .1);
    cube.render();

    // mouth 2
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(-0.05, 0.035, -0.1);
    cube.matrix.rotate(-10, 0, 0, 1);
    cube.matrix.scale(0.2, .1, .1);
    cube.render();

    // mouth 3
    tri.matrix.setTranslate(0,0,0);
    tri.matrix.translate(-0.05, g_mouthPosY, -0.1);
    tri.matrix.rotate(90, 1, 0, 0);
    tri.matrix.scale(0.1, .1, .1);
    tri.render();

    // ear 1
    tri.color = ORANGE2; 
    tri.matrix.setTranslate(0,0,0);
    tri.matrix.translate(-0.24, 0.4, 0.425);
    tri.matrix.scale(0.2, 0.25, 0.2);
    tri.matrix.rotate(-90, 1, 0, 0);
    tri.matrix.rotate(9, 0, 0, 1);
    tri.render();

    // ear 2
    tri.color = ORANGE;
    tri.matrix.setTranslate(0,0,0);
    tri.matrix.translate(0.045, 0.4, 0.39);
    tri.matrix.scale(0.2, 0.25, 0.2);
    tri.matrix.rotate(-90, 1, 0, 0);
    tri.matrix.rotate(-8.5, 0, 0, 1);
    tri.render();

    // eye
    cube.color = [1,1,1,1];
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(0.05, 0.3, -0.06)
    cube.matrix.scale(0.125, 0.09, .1);
    cube.matrix.rotate(-45, 0, 0, 1);
    cube.render();

    // eye2
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(-0.225, 0.3, -0.06)
    cube.matrix.scale(0.125, 0.09, .1);
    cube.matrix.rotate(-45, 0, 0, 1);
    cube.render();

    // pupil1 = new Cube();
    cube.color = [0,0,0,1];
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(0.1, 0.3, -0.07)
    cube.matrix.scale(0.05, 0.09, .1);
    cube.matrix.rotate(-45, 0, 0, 1);
    cube.render();

    // pupil2 = new Cube();
    cube.color = [0,0,0,1];
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(-0.175, 0.3, -0.07)
    cube.matrix.scale(0.05, 0.09, .1);
    cube.matrix.rotate(-45, 0, 0, 1);
    cube.render();

    var frontleg_left = new Cube();
    frontleg_left.color = ORANGE;
    frontleg_left.textureNum = -2;
    frontleg_left.matrix.translate(0.14, g_legPosY, g_legPosZ)
    frontleg_left.matrix.rotate(g_legAngle, 1, 0, 0);
    frontleg_leftMat = new Matrix4(frontleg_left.matrix);
    frontleg_left.matrix.scale(0.15, 0.5, 0.2)
    frontleg_left.render();

    var frontleg_left_joint = new Cube();
    frontleg_left_joint.color = ORANGE;
    frontleg_left_joint.textureNum = -2;
    frontleg_left_joint.matrix = frontleg_leftMat;
    frontleg_left_joint.matrix.translate(0, 0, 0.20)
    frontleg_left_joint.matrix.rotate(-170, 1, 0, 0);
    frontleg_left_jointMat = new Matrix4(frontleg_left_joint.matrix)
    frontleg_left_joint.matrix.scale(0.15, 0.35, 0.19)
    frontleg_left_joint.render();

    var frontleg_left_joint2 = new Cube();
    frontleg_left_joint2.color = [1,1,1, 1.0];
    frontleg_left_joint2.textureNum = -2;
    frontleg_left_joint2.matrix = frontleg_left_jointMat;
    frontleg_left_joint2.matrix.translate(0, 0.35, 0)
    frontleg_left_joint2.matrix.rotate(0, 1, 0, 0);
    frontleg_left_joint2.matrix.scale(0.15, 0.09, 0.2)
    frontleg_left_joint2.render();

    var frontleg_right = new Cube();
    frontleg_right.color = ORANGE;
    frontleg_right.textureNum = -2;
    frontleg_right.matrix.translate(-0.285,-0.2, -0.3)
    frontleg_right.matrix.rotate(75, 1, 0, 0);
    frontleg_right.matrix.rotate(5, 0, 0.5, 0.6);
    var frontleg_rightMat = new Matrix4(frontleg_right.matrix);
    frontleg_right.matrix.scale(0.15, 0.35, 0.2)
    frontleg_right.render();

    var frontleg_right_joint = new Cube();
    frontleg_right_joint.color = ORANGE;
    frontleg_right_joint.textureNum = -2;
    frontleg_right_joint.matrix = frontleg_rightMat;
    frontleg_right_joint.matrix.translate(0.1, -0.1, -0)
    frontleg_right_joint.matrix.rotate(-90, 0.5, 0.5, 0);
    frontleg_right_joint.matrix.rotate(20 * Math.sin(g_seconds), 0.1, 0, 0.1);
    var frontleg_right_jointMat = new Matrix4(frontleg_right_joint.matrix)
    frontleg_right_joint.matrix.scale(0.15, 0.35, 0.19)
    frontleg_right_joint.render();

    var frontleg_right_joint2 = new Cube();
    frontleg_right_joint2.color = [1,1,1, 1.0];
    frontleg_right_joint2.textureNum = -2;
    frontleg_right_joint2.matrix = frontleg_right_jointMat;
    frontleg_right_joint2.matrix.translate(-0, .35, -0)
    frontleg_right_joint2.matrix.rotate(0, 1, 0, 0);
    frontleg_right_joint2.matrix.scale(0.15, 0.09, 0.2)
    frontleg_right_joint2.render();

    // hindleg_left = new Cube();
    cube.color = ORANGE2;
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(0.175,-1.1, 0.65)
    cube.matrix.rotate(-45, 1, 0, 0);
    cube.matrix.scale(0.15, 0.4, 0.4)
    cube.render();

    // hindleg_left_joint = new Cube();
    cube.color = ORANGE2;
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(0.175,-1.1, 0.65)
    cube.matrix.scale(0.15, 0.15, -0.35)
    cube.render();

    // hindleg_left_foot = new Cube();
    cube.color = [1,1,1, 1.0];
    cube.matrix.translate(0.175,-1.1, 0.3)
    cube.matrix.scale(0.15, 0.15, -0.1)
    cube.render();

    // hindleg_right = new Cube();
    cube.color = ORANGE2;
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(-0.325,-1.1, 0.65)
    cube.matrix.rotate(-45, 1, 0, 0);
    cube.matrix.scale(0.15, 0.4, 0.4)
    cube.render();

    // hindleg_right_joint = new Cube();
    cube.color = ORANGE2;
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(-0.325,-1.1, 0.65)
    cube.matrix.scale(0.15, 0.15, -0.35)
    cube.render();

    // hindleg_right_foot = new Cube();
    cube.color = [1,1,1, 1.0];
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(-0.325,-1.1, 0.3)
    cube.matrix.scale(0.15, 0.15, -0.1)
    cube.render();

    // tail1 = new Cube();
    cube.color = ORANGE2;
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(-0.05,-1.1,1.01);
    cube.matrix.rotate(60,0, 1, 0);
    cube.matrix.scale(.1,.1,.45)
    cube.render(1, 0.55, 0.1);

    // tail2 = new Cube();
    cube.color = ORANGE;
    cube.matrix.setTranslate(0,0,0);
    cube.matrix.translate(0.35,-1.1, 1.25);
    cube.matrix.rotate(120 ,0, 1, 0);
    cube.matrix.scale(.1,.1,.45)
    cube.render(1, 0.55, 0.1);

    var tail3 = new Cube();
    tail3.color = ORANGE2;
    tail3.textureNum = -2;
    tail3.matrix.translate(0.75,-1.1, 1);
    tail3.matrix.rotate(g_tailPos * 10, 1, 0, 0);
    var tail3_Mat = new Matrix4(tail3.matrix);
    tail3.matrix.rotate(180,0, 1, 0);
    tail3.matrix.scale(.1,.1,.2);
    tail3.render();

    var tail4 = new Cube();
    tail4.color = ORANGE;
    tail4.textureNum = -2;
    tail4.matrix = new Matrix4(tail3_Mat);
    tail4.matrix.translate(0, 0, -0.2);
    tail4.matrix.rotate(g_tailPos * 20, 1, 0, 0);
    var tail4_Mat = new Matrix4(tail4.matrix);
    tail4.matrix.rotate(190, 0, 1, 0);
    tail4.matrix.scale(.1,.1,.2);
    tail4.render();

    var tail5 = new Cube();
    tail5.color = [1, 1, 1, 1.0];
    tail5.textureNum = -2;
    tail5.matrix = new Matrix4(tail4_Mat);
    tail5.matrix.translate(-0.025, 0, -0.2);
    tail5.matrix.rotate(g_tailPos * 50, 1, 0, 0);
    tail5.matrix.rotate(190, 0, 1, 0);
    tail5.matrix.scale(.1,.1,.2);
    tail5.render();

}