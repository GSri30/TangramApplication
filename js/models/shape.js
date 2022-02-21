class Shape{
    constructor(origin, sides, vertices, color){
      this.centroid = origin; //center
      this.sides = sides;
      this.vertices = vertices;
      this.color = color;
      this.translation = origin; //origin; vertices are wrt to this only
      this.rotation = 0; //radians
      this.scaling = [1, 1];
      this.state = {translation: this.translation, rotation: this.rotation, scaling: this.scaling};
    }

    setOrigin(newOrigin){
      this.translation = newOrigin;
    }

    distance(x, y){
      return Math.sqrt(Math.pow(this.centroid[0]-x, 2) + Math.pow(this.centroid[1]-y, 2));
    }
    moveRight(dx=1){
      if(this.centroid[0] + dx>=600) return;
      this.translation[0] += dx;
      this.centroid[0] += dx;
    }
    moveLeft(dx=1){
      if(this.centroid[0] - dx<=0) return;
      this.translation[0] -= dx;
      this.centroid[0] -= dx;
    }
    moveUp(dy=1){
      if(this.centroid[1] - dy<=0) return;
      this.translation[1] -= dy;
      this.centroid[1] -= dy;
    }
    moveDown(dy=1){
      if(this.centroid[1] + dy>=600) return;
      this.translation[1] += dy;
      this.centroid[1] += dy;
    }
    rotateClock(drad=1){
      let angle = 360 - drad;
      this.rotation += (angle*Math.PI)/180;
    }
    rotateAntiClock(drad=1){
      this.rotation += (drad*Math.PI)/180;
    }
    scalePos(ds=0.01){
      this.scaling[0] += ds;
      this.scaling[1] += ds;
    }
    scaleNeg(ds=0.01){
      this.scaling[0] -= ds;
      this.scaling[1] -= ds;
    }
}

export {
    Shape
}