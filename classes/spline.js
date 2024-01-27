class bezierSpline {
    constructor(points, sectioned = [], spline = [], degree = 3){
        this.points = points;
        this.sectioned = sectioned;
        this.spline = spline;
        this.degree = degree;
    }

    section() {
        const sectionedPoints = [];
        for (let i = 0; i < this.points.length - 1; i += 3) {
            const bez = new Bernstein([this.points[i], this.points[i + 1], this.points[i + 2], this.points[i + 3]]);
            sectionedPoints.push(bez);
        }

        this.sectioned = sectionedPoints;
    }

    evaluate(t) {
        // u is the integral part of t
        const u = Math.floor(t);
        const tPrime = t - u;
        return this.sectioned[u].evaluate(tPrime);
    }

    inject(numPoints){
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

    spaceInject(distBetween){
        if(this.sectioned[0].injected.length == 0){
            this.inject(50 * this.sectioned.length); 
            this.MultiCumDistLUT();
        }

        const path = [];

        const curveLength = this.sectioned[this.sectioned.length - 1].cumD[this.sectioned[this.sectioned.length - 1].cumD.length - 1][1];
        console.log(curveLength);
        
        
        const numPoints = Math.floor(curveLength / distBetween);

        const ptsPerCurve = [];
        
        //  for

        // adjusting distance between 
        // if(adjust == true){
        //     distBetween = curveLength / numPoints;
        // }


        // for(let i = 0; i < numPoints + 1; i++){
        //     const distAtPoint = i * distBetween;
        //     const t = this.getT(distAtPoint);
        //     path.push([t, this.evaluate(t)]);
        // }
        // this.injected = path;
    }

    // sticks all the individual parts of the spline together
    transfer(){

    }


}