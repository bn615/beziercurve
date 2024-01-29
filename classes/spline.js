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
        if(this.sectioned.length == 0){
            this.section();
            this.inject(50 * this.sectioned.length); 
            this.MultiCumDistLUT();
        }

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

    // returns complete spline
    transfer(){
        const path = [];
        for(let i = 0; i < this.spline.length; i++){
            path.push(this.spline[i][1]);
        }
       return path;

    }


}