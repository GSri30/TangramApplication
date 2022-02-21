function getGL(doc, id){
  const canvas = doc.getElementById(id);
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if(!gl) throw handleError('WebGL init error', 'WebGL not supported!');
  return gl;
}

/**
 * Resizes .width & .height of canvas based on .clientWidth & .clientHeight
 * @param {*} canvas 
 * @returns 
 */
function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
   
    return needResize;
}

function resetCanvas(gl){
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export {
    getGL,
    resetCanvas,
}