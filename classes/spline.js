class bezierSpline {
    constructor(points, sectioned = [], spline = [], degree = 3){
        this.points = points;
        this.sectioned = sectioned;
        this.spline = spline;
        this.degree = degree;
    }

    section() {
        const sectionedPoints = [];
        for (let i = 3; i < this.points.length; i += 3) {
            const bez = new Bernstein([this.points[i - 3], this.points[i - 2], this.points[i - 1], this.points[i]]);
            sectionedPoints.push(bez);
        }

        this.sectioned = sectionedPoints;
    }

    evaluate(t) {
        if(t == this.sectioned.length){
            return this.sectioned[t - 1].evaluate(1);
        }

        // u is the integral part of t
        const u = Math.floor(t);
        const tPrime = t - u;
        return this.sectioned[u].evaluate(tPrime);
    }

    inject(numPoints){
        if(this.sectioned.length == 0){
            this.section();
        }
        for(let i = 0; i < this.sectioned.length; i++){
            this.sectioned[i].inject(Math.floor(numPoints / this.sectioned.length));
        }
        return this;
    }

    MultiCumDistLUT(){
        for(let i = 0; i < this.sectioned.length; i++){
            this.sectioned[i].generateCD();
        }
        return this;
    }

    getT(dist){
        for(let k = 0; k < this.sectioned.length; k++){
            for(let i = 1; i < this.sectioned[k].cumD.length; i++){
                if(this.sectioned[k].cumD[i][1] >= dist){
                    const dValue1 = new Point(this.sectioned[k].cumD[i - 1][0], this.sectioned[k].cumD[i - 1][1]);
                    const dValue2 = new Point(this.sectioned[k].cumD[i][0], this.sectioned[k].cumD[i][1]);
                    const t = (dist - dValue1.y) / (dValue2.y - dValue1.y);
                    const findingT = Point.lerp(dValue1, dValue2, t);
                    return(findingT.x + k);
                }
            }
        }
    }

    spaceInject(distBetween){
        this.section();
        this.inject(50 * this.sectioned.length); 
        this.MultiCumDistLUT();
        

        const path = [];
        const curveLength = this.sectioned[this.sectioned.length - 1].cumD[this.sectioned[this.sectioned.length - 1].cumD.length - 1][1];
        
        const numPoints = Math.floor(curveLength / distBetween);
        
        distBetween = curveLength / numPoints;

        for(let i = 0; i < numPoints + 1; i++){
            const distAtPoint = i * distBetween;
            const t = this.getT(distAtPoint);
            const pt = this.evaluate(t);
            path.push([t, pt]);
        }
        this.spline = path;
        
    }

    update(distBetween){
        this.section();
        this.inject(50 * this.sectioned.length); 
        this.MultiCumDistLUT();
        this.spaceInject(distBetween);
    }

    // returns complete spline
    generateSpline(distBetween){
        spaceInject(distBetween);
        const path = [];
        for(let i = 0; i < this.spline.length; i++){
            path.push(this.spline[i][1]);
        }
       return path;

    }
    

    static project(projected, p1, p2){
        const aVector = Point.subtract(projected, p1);
        const bVector = Point.subtract(p2, p1);
        return Point.sum(p1, bVector.multiply(Point.dotProduct(aVector, bVector) / Point.dotProduct(bVector, bVector)));
    }


    adjust3k_0(){
        for(let i = 3; i < this.points.length - 1; i += 3){
            this.points[i] = this.constructor.project(this.points[i], this.points[i - 1], this.points[i + 1]);
        }
        return this;
    }

    adjust3k_1(){
        for(let i = 4; i < this.points.length; i += 3){
            this.points[i] = this.constructor.project(this.points[i], this.points[i - 2], this.points[i - 1]);
        }
        return this;
    }

    adjust3k_2(){
        for(let i = 2; i < this.points.length - 2; i += 3){
            this.points[i] = this.constructor.project(this.points[i], this.points[i + 1], this.points[i + 2]);
        }
        return this;
    }
    curvature(t){
        const u = Math.floor(t);
        const tPrime = t - u;
        return this.sectioned[u].evaluate(tPrime);
    }
    
    generateSpeeds(){
        for(let i = 0; i < this.sectioned.length; i++){
            const bez = this.sectioned[i];
            let t = 0;
            while(t >= i && t <+ i + 1){
                
            }
        }
    }

}

