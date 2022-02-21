class point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    setX(newX){this.x = newX;}
}

var points = [new point(1,1), new point(2,2)];

points[0].setX(3);

console.log(points[0].x);