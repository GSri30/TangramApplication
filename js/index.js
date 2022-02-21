import { init_left } from './surface-left.js';
import { init_right } from './surface-right.js';
import { downloadCanvas } from './surface-right.js';

function init(){
  init_left('surface-left');
  init_right('surface-right');
}

window.onload = init;
document.querySelector('.download').addEventListener('click', () => downloadCanvas(document, 'surface-right'));

/* Sending data from js to attribute of shader

bindBuffer(ARRAY_BUFFER, later) : Assigns later to array buffer bind point
bufferData : loads data into a buffer bind point
data <-> ARRAY_BUFFER <-> dataBuffer
vertexAttribPointer : binds attribute to ARRAY_BUFFER
data <-> ARRAY_BUFFER <-> dataBuffer
                |
             attribute
*/