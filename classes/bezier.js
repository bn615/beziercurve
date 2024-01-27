class Bezier{
    // points -> array of points of beziers -> varies as bezier's degree changes
    // coeffs -> coefficients in Bernstein polynomial
    constructor(points, injected = [], cumD = []){
        this.points = points;
        this.injected = injected;
        this.cumD = cumD;
    }

    // calculates the value of the a bezier at a chosen t value
    // returns a Point
    // pts = points of the bezier curve
    // uses deCasteljau algorithm (recursive)
    // https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm 
    deCasteljau(t){
        const bez = new Bezier(this.points);
        const pts = bez.points;
        if (pts.length === 1) {
            return pts[0];
        }
        const newPts = [];
        
        for (let i = 0; i < pts.length - 1; i++) {
            const next = Point.lerp(pts[i], pts[i + 1], t);
            newPts.push(next);
        }
        bez.points = newPts;
        return bez.deCasteljau(t);
    }

    // injects numPoints of points into the curve
    // result is stored in this.injected as an array of [t value, Point]
    inject(numPoints){
        const path = [];
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const addPoint = this.deCasteljau(t);
            path.push([t, addPoint]);
        }
        this.injected = path;
        
        return this;
    }

    // generates cumulative Distance LUT
    // result is stored in this.cumD as an array of [t value, cumulative Distance ]
    generateCD(){
        let d = 0;
        const cumDistance = [[0, 0]];
        
        for (let i = 0; i < this.injected.length - 1; i++) {
            const pointToPointDistance = Point.distance(this.injected[i][1], this.injected[i + 1][1]);
            d += pointToPointDistance;
            cumDistance.push([this.injected[i + 1][0], d]);
        }
        
        this.cumD = cumDistance;
        return this;
    }

    // gets t-value for a distance value given the cum dist LUT
    getT(dist){
        for(let i = 1; i < this.cumD.length; i++){
            if(this.cumD[i][1] >= dist){
                const dValue1 = new Point(this.cumD[i - 1][0], this.cumD[i - 1][1]);
                const dValue2 = new Point(this.cumD[i][0], this.cumD[i][1]);
                
                const t = (dist - dValue1.y) / (dValue2.y - dValue1.y);
                
                const findingT = Point.lerp(dValue1, dValue2, t);
                return(findingT.x);
            }
        }
    }

    // injects points based on distance between each 2 points instead of t values
    // adjust -> if true, adjust the distance between by a tiny margin such that the end point of the bezier is contained on the injected bezier
    // if false, no adjustment is made.
    spaceInject(distBetween, adjust = true){
        //default injects 50, generates cD if the injected attribute is empty
        if(this.injected.length == 0){
            this.inject(50); 
            this.generateCD();
        }
        
        const path = [];

        const curveLength = this.cumD[this.cumD.length - 1][1];
        const numPoints = Math.floor(curveLength / distBetween);

        //adjusting distance between 
        if(adjust == true){
            distBetween = curveLength / numPoints;
        }


        for(let i = 0; i < numPoints + 1; i++){
            const distAtPoint = i * distBetween;
            const t = this.getT(distAtPoint);
            path.push([t, this.deCasteljau(t)]);
        }
        this.injected = path;
    }

}

