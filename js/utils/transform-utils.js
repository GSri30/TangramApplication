import { multiply } from '../helpers/math.js';

class op{
    static projection(width, height){
      return [
        2/width, 0, 0,
        0, -2/height, 0,
        -1, 1, 1
      ]
    }
    
    static translation_matrix(tx, ty){
      return [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1
      ]
    }

    static rotation_matrix(angleInRadians){
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return [
        c, -s, 0,
        s, c, 0,
        0, 0, 1
      ];
    }

    static translate(m, tx, ty){
      return multiply(m, [
        1, 0, 0,
        0, 1, 0,
        tx, ty, 1
      ]);
    }
  
    static rotate(m, angleInRadians){
      var c = Math.cos(angleInRadians);
      var s = Math.sin(angleInRadians);
      return multiply(m, [
        c, -s, 0,
        s, c, 0,
        0, 0, 1
      ]);
    }
  
    static scale(m, sx, sy){
      return multiply(m, [
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
      ]);
    }
}

export {
    op
}