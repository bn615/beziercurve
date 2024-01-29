class CatmullRom{
    constructor(points, injected = []){
        this.points = points;
        this.injected = injected;
    }

    addGhostPoints(){
        const first = this.points[0];
        const second = this.points[1];
        const secondToLast = this.points[this.points.length - 2];
        const last = this.points[this.points.length - 1];
        
        this.points.unshift(Point.subtract(first.multiply(2), second));
        this.points.push(Point.subtract(last.multiply(2), secondToLast));
        
        return this;
    }

    evaluate(t, p0, p1, p2, p3){ // reference: https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
        const t0 = 0, t1 = 1, t2 = 2, t3 = 3; //uniform (change for chordal/centripetal)
        const a1 = Point.add(p0.multiply((t1-t)/(t1-t0)),p1.multiply((t-t0)/(t1-t0)));
        const a2 = Point.add(p1.multiply((t2-t)/(t2-t1)),p2.multiply((t-t1)/(t2-t1)));
        const a3 = Point.add(p2.multiply((t3-t)/(t3-t2)),p3.multiply((t-t2)/(t3-t2)));
        const b1 = Point.add(a1.multiply((t2-t)/(t2-t0)),a2.multiply((t-t0)/(t2-t0)));
        const b2 = Point.add(a2.multiply((t3-t)/(t3-t1)),a3.multiply((t-t1)/(t3-t1)));
        const c = Point.add(b1.multiply((t2-t)/(t2-t1)),b2.multiply((t-t1)/(t2-t1)));
        return c;
    }

    inject(scale){
        const path = [];
        for(let i = 0; i < this.points.length - 3; i++){
            const dist = Point.distance(this.points[i + 1], this.points[i + 2]);
            const nu = Math.floor(dist/scale);
            for(let j = 0; j < nu; j++){
                const t = j / nu;
                const newPoint = this.evaluate(t, this.points[i], this.points[i + 1], this.points[i + 2], this.points[i + 3]);
                path.push(newPoint);
            }
        }
        this.injected = path;
        return this;
    }
}