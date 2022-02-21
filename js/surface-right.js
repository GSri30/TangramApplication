import { createProgramFromScripts } from './utils/shader-utils.js';
import { getGL, resetCanvas } from './utils/canvas-utils.js';

import { SHADERS } from './data/shaders.js';
import { op } from './utils/transform-utils.js';
import { SHAPES } from './data/shapes.js';
import { getRandom } from './helpers/math.js';

var IMAGE;

function net_origin(shapes){
  var x_left=2000, x_right=-2000, y_up=2000, y_down=-2000;
  shapes.forEach((shape, _) => {
    shape.vertices.forEach((v, i) => {
      if(i&1) return;
      let x = shape.centroid[0];
      let y = shape.centroid[1];
      let matrix = op.translation_matrix(x, y);
      matrix = op.rotate(matrix, shape.state.rotation);
      matrix = op.scale(matrix, shape.state.scaling[0], shape.state.scaling[1]);
      let xdash = (matrix[(0 * 3) + 0] * shape.vertices[i]) + (matrix[(1 * 3) + 0] * shape.vertices[i+1]) + (matrix[(2 * 3) + 0] * 1);
      let ydash = (matrix[(0 * 3) + 1] * shape.vertices[i]) + (matrix[(1 * 3) + 1] * shape.vertices[i+1]) + (matrix[(2 * 3) + 1] * 1);
      x_left = Math.min(x_left, xdash);
      x_right = Math.max(x_right, xdash);
      y_up = Math.min(y_up, ydash);
      y_down = Math.max(y_down, ydash);
      return;
    });
  });
  return [(x_left+x_right)/2.0, (y_up+y_down)/2.0];
}

function randomize(shapes){
  let newShapes = [];
  shapes.forEach((_, i) => {
    let newShape = Object.assign(Object.create(Object.getPrototypeOf(shapes[i])), shapes[i]);
    let random_origin = [Math.floor(getRandom(200, 400)), Math.floor(getRandom(200, 400))];
    newShape.centroid = random_origin;
    newShape.translation = random_origin;
    newShape.rotation = (Math.floor(getRandom(0,  360))*Math.PI)/180;
    // newShape.scaling = [Math.floor(getRandom(1-0.1, 1+0.1)*100)/100, Math.floor(getRandom(1-0.1, 1+0.1)*100)/100];
    newShape.scaling = [1, 1];
    newShapes.push(newShape);
  });
  return newShapes;
}

function init_right(id){
  try{
    var mode = 0;
    var shapeidx = null;
    var shapes = randomize(SHAPES);
    var O = [0, 0];

    const gl = getGL(document, id);
    const program = createProgramFromScripts(gl, SHADERS);
    
    var attrPos = gl.getAttribLocation(program, "a_position");
    var uniUMat = gl.getUniformLocation(program, "u_matrix");
    var uniUColor = gl.getUniformLocation(program, "u_color");
    
    var locations = {
                  "attrPos": attrPos,
                  "uniUMat": uniUMat,
                  "uniUColor": uniUColor}

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    console.log('Started right-surface. In mode 0.');
    draw(gl, program, locations, mode, shapes, O);

    gl.canvas.addEventListener("mousedown", (event) => {
      let rect = gl.canvas.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      console.log([x,y]);
      if(mode == 1){
        let mx = 2000;
        shapes.forEach((shape, i) => {
          let dist = shape.distance(x, y);
          if(mx >= dist){
            mx = dist;
            shapeidx = i;
          }
        });
        console.log(`selected shape ${shapeidx}`);
      }
    });

    document.addEventListener("keydown", (event) => {
      if(mode == 0 || mode == 3) return;
      if((mode == 1) && (shapeidx == null)){
        return;
      }
      console.log(`${event.key} key down applied in mode ${mode}`);
      if(event.key == "ArrowRight"){
        if(mode == 1) shapes[shapeidx].moveRight();
        if(mode == 2) shapes.forEach((shape)=>shape.moveRight()), O[0] += 1;
        draw(gl, program, locations, mode, shapes, O);
      }else if(event.key == "ArrowLeft"){
        if(mode == 1) shapes[shapeidx].moveLeft();
        if(mode == 2) shapes.forEach((shape)=>shape.moveLeft()), O[0] -= 1;
        draw(gl, program, locations, mode, shapes, O);
      }else if(event.key == "ArrowUp"){
        if(mode == 1) shapes[shapeidx].moveUp();
        if(mode == 2) shapes.forEach((shape)=>shape.moveUp()), O[1] -= 1;
        draw(gl, program, locations, mode, shapes, O);
      }else if(event.key == "ArrowDown"){
        if(mode == 1) shapes[shapeidx].moveDown();
        if(mode == 2) shapes.forEach((shape)=>shape.moveDown()), O[1] += 1;
        draw(gl, program, locations, mode, shapes, O);
      }else if(event.key == '('){
        if(mode == 1) shapes[shapeidx].rotateClock();
        if(mode == 2) shapes.forEach((shape)=>shape.rotateClock());
        draw(gl, program, locations, mode, shapes, O);
      }else if(event.key == ')'){
        if(mode == 1) shapes[shapeidx].rotateAntiClock();
        if(mode == 2) shapes.forEach((shape)=>shape.rotateAntiClock());
        draw(gl, program, locations, mode, shapes, O);
      }else if(event.key == '+'){
        if(mode == 1) shapes[shapeidx].scalePos();
        if(mode == 2) shapes.forEach((shape)=>shape.scalePos());
        draw(gl, program, locations, mode, shapes, O);
      }else if(event.key == '-'){
        if(mode == 1) shapes[shapeidx].scaleNeg();
        if(mode == 2) shapes.forEach((shape)=>shape.scaleNeg());
        draw(gl, program, locations, mode, shapes, O);
      }
    });

    document.addEventListener("keyup", (event) => {
      if(event.key == 'm'){
        mode += 1;
        mode = mode % 4;
        if(mode == 0){
          console.log('Switched to mode 0');
          mode = 0;
          shapes = randomize(SHAPES);
          shapeidx = null;
          O = [0, 0];
          draw(gl, program, locations, mode, shapes, O);
        }else if(mode == 1){
          console.log('Switched to mode 1');
          draw(gl, program, locations, mode, shapes, O);
        }else if(mode == 2){
          console.log('Switched to mode 2');
          shapes.forEach((shape, i) => {
            shapes[i].state = {
              translation: [shape.translation[0], shape.translation[1]],
              rotation: shape.rotation,
              scaling: [shape.scaling[0], shape.scaling[1]]
            }
            shapes[i].translation = [0, 0];
            shapes[i].rotation = 0;
            shapes[i].scaling = [1, 1];
          });
          O = net_origin(shapes);
          console.log(`Net Centroid is set at ${O}`);
          draw(gl, program, locations, mode, shapes, O);
        }else if(mode == 3){
          console.log('Switched to mode 3');
          resetCanvas(gl);
        }
      }
    });
      
  }catch(error){
    console.log(error);
  }
}

function draw(gl, program, locations, mode, shapes, O){
    resetCanvas(gl);
    
    gl.useProgram(program);
    gl.enableVertexAttribArray(locations.attrPos);

    shapes.forEach((shape, i) => {
      if(mode != 2){
        var matrix = op.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = op.translate(matrix, shape.translation[0], shape.translation[1]);
        matrix = op.rotate(matrix, shape.rotation);
        matrix = op.scale(matrix, shape.scaling[0], shape.scaling[1]);
      }
      if(mode == 2){
        var matrix = op.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        let x_old = shape.state.translation[0];
        let y_old = shape.state.translation[1];
        let x_new = shape.translation[0];
        let y_new = shape.translation[1];
        
        const get_updated_verts = (x, y, radians) => {
          return [(x*Math.cos(radians)-(y*Math.sin(radians))), ((x*Math.sin(radians))+(y*Math.cos(radians)))]
        }
        let verts;
        matrix = op.translate(matrix, shape.state.translation[0], shape.state.translation[1]);
        matrix = op.rotate(matrix, shape.state.rotation);
        matrix = op.scale(matrix, shape.state.scaling[0], shape.state.scaling[1]);
        verts = get_updated_verts(O[0]-x_old, O[1]-y_old, shape.state.rotation);
        matrix = op.translate(matrix, verts[0], verts[1]);
        matrix = op.rotate(matrix, shape.rotation);
        matrix = op.scale(matrix, shape.scaling[0], shape.scaling[1]);
        verts = get_updated_verts(x_old+x_new-O[0], y_old+y_new-O[1], shape.state.rotation);
        matrix = op.translate(matrix, verts[0], verts[1]);
      }

      gl.uniformMatrix3fv(locations.uniUMat, false, matrix);
      gl.uniform4fv(locations.uniUColor, shape.color);

      gl.vertexAttribPointer(locations.attrPos, 2, gl.FLOAT, false, 0, 0);// Link attribute to ARRAY_BUFFER to send data from buffer to attribute
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.vertices), gl.STATIC_DRAW);
      
      gl.drawArrays(gl.TRIANGLES, 0, 3*(shape.sides-2));

      if(mode == 2) IMAGE = gl.canvas.toDataURL();
    });
}

function downloadCanvas(doc){    
  let image = IMAGE;

  var tmpLink = doc.createElement( 'a' );  
  tmpLink.download = 'tangram.png';
  tmpLink.href = image;  

  doc.body.appendChild( tmpLink );  
  tmpLink.click();  
  doc.body.removeChild( tmpLink );  
}

export {
  init_right,
  downloadCanvas,
}