class Point {
    // x and y coordinates in cartesian plane
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  

    // adds x coords of each point and y coords of each point
    static add(pt1, pt2){
      return new Point(pt1.x + pt2.x, pt1.y + pt2.y);
    }


    static sum() {
      var total = new Point(0, 0);
        for (let i = 0; i < arguments.length; i++) {
          total = this.add(total, arguments[i]);
        }
      return total;
    }
  
    // (x1, y1) - (x2, y2) = (x1 - x2, y1 - y2)
    static subtract(pt1, pt2) {
      return new Point(pt1.x - pt2.x, pt1.y - pt2.y);
    }
  

    // d * (x, y) = (dx, dy)
    multiply(d) {
      return new Point(this.x * d, this.y * d);
    }
  
    // d * (x, y) = (x/d, y/d)
    divide(d) {
      return new Point(this.x / d, this.y / d);
    }
  
    static equals(pt1, pt2) {
      return pt1.x === pt2.x && pt1.y === pt2.y;
    }
  
    static distance(pt1, pt2) {
      const d = Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
      return d;
    }
    

    magnitude(){
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
  

    // rotates p2 theta radians about p1
    static rotate(pt1, pt2, theta) {
      const shifted = new Point(pt2.x - pt1.x, pt2.y - pt1.y);
      const xcord = shifted.x * Math.cos(theta) - shifted.y * Math.sin(theta);
      const ycord = shifted.y * Math.cos(theta) + shifted.x * Math.sin(theta);
      return new Point(xcord + pt1.x, ycord + pt1.y);
    }
  
    static print(pt) {
      console.log(`(${pt.x}, ${pt.y})`);
    }
  
    static dotProduct(pt1, pt2) {
      return pt1.x * pt2.x + pt1.y * pt2.y;
    }
  

    // linear interpolation
    // returns pt1 * (1 - t) + pt2 * t
    
    static lerp(pt1, pt2, t) {
      // 0 <= t <= 1
      const x = (1 - t) * pt1.x + t * pt2.x;
      const y = (1 - t) * pt1.y + t * pt2.y;
      return new Point(x, y);
    }
}
  
  