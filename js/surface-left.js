import { SHADERS } from './data/shaders.js';
import { createProgramFromScripts } from './utils/shader-utils.js';
import { getGL, resetCanvas } from './utils/canvas-utils.js';
import { handleError } from './helpers/errors.js';
import { getRandomInt } from './helpers/math.js';
import { op } from './utils/transform-utils.js';
import { SHAPES } from './data/shapes.js';

function init_left(id){
  try{
    // init vars
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
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // making ARRAY_BUFFER == positionBuffer

    draw(gl, program, locations);
    
    // console.log(gl.canvas.toDataURL());

  }catch(error){
    console.log(error);
  }
}

function draw(gl, program, locations){
    resetCanvas(gl);
    
    gl.useProgram(program);
    gl.enableVertexAttribArray(locations.attrPos);

    SHAPES.forEach((shape, i) => {
      let matrix = op.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      matrix = op.translate(matrix, shape.translation[0], shape.translation[1]);
      matrix = op.rotate(matrix, shape.rotation);
      matrix = op.scale(matrix, shape.scaling[0], shape.scaling[1]);

      gl.uniformMatrix3fv(locations.uniUMat, false, matrix);
      gl.uniform4fv(locations.uniUColor, shape.color);

      gl.vertexAttribPointer(locations.attrPos, 2, gl.FLOAT, false, 0, 0);// Link attribute to ARRAY_BUFFER to send data from buffer to attribute
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.vertices), gl.STATIC_DRAW);
      
      gl.drawArrays(gl.TRIANGLES, 0, 3*(shape.sides-2));
    });
}

export {
    init_left,
}