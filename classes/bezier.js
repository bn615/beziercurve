

class Bezier{
    // points -> array of points of beziers -> varies as bezier's degree changes
    // coeffs -> coefficients in Bernstein polynomial
    constructor(points){
        this.points = points;
        this.size = points.length - 1;
    }

    // calculates the value of the a bezier at a chosen t value
    // pts = points of the bezier curve
    // uses deCasteljau algorithm (recursive)
    // https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm 
    static deCasteljau(pts, t){
        if (pts.length === 1) {
            return pts;
        }
        const newPts = [];
        
        for (let i = 0; i < pts.length - 1; i++) {
            const next = Point.lerp(pts[i], pts[i + 1], t);
            newPts.push(next);
        }
        
        return deCasteljau(next, t);
    }

    
}


function choose(n, k){
    if((n / 2) < k){
        k = n - k;
    }
    if(k == 0) {
        return 1;
    }
    if(k > n){
        return 0;
    }
    let result = 1;
    for(let i = n; i > n - k; i--){
        result = result * i;
    }
    for(let i = 1; i <= k; i++){
        result = result / i;
    }
    return result;
    
}

// generates coefficients for bezier curves expressed in berstein polynomial form
// n is the degree of the bezier curve
function generateBernstein(n){
    const coeffs = [];
    for(let i = 0; i <= n; i++){
        const coI = [];
        const cof = choose(n, i);
        for(let k = n - i; k >= 0; k--){
            if ((k % 2) == 1){
                coI.push(-1 * cof * choose(n - i, k));
            }
            else{
                coI.push(cof * choose(n - i, k));
            }
        }

        while(coI.length < (n + 1)){
            coI.push(0);
        }
        coeffs.push(coI);

    }
    return coeffs;
}

class bernsteinBezier extends Bezier {
    constructor(points){
        super(points);
        this.size = points.length - 1;
        this.coeffs = generateBernstein(points.length - 1);
    }

    evaluate(t){
        const degree = this.points.length - 1;
        const tCoeffs = [];
        for(let i = 0; i <= degree; i++){
            let tValue = 0;
            for(let k = 0; k <= degree; k++){
                tValue += + t * this.coeffs[i][k] * Math.pow(t, degree - k);
            }
            tCoeffs.push(tValue);
        }

        let pt = new Point(0, 0);
        for(let i = 0; i <= degree; i++){
            pt = pt + this.points[i].multiply(tCoeffs[i]);
        }
        return pt;
        
    }


    // calculates derivative (velocity)
    derivative(){
        const degree = points.length - 1;
        for(let i = 0; i <= degree; i++){
            for(let k = 0; k <= degree; k++){
                this.coeffs[i][k] *= (degree - k);
            }
            this.coeffs[i].pop();
            this.coeffs[i].unshift(0);
        }
        return this;
    }

    //calculates 2nd derivative (acceleration)
    secondDerivative(){
        this.derivative();
        this.derivative();
        return this;
    }

    // calculates 3rd derivative (jerk)
    thirdDerivative(){
        this.secondDerivative();
        this.derivative();
        return this;
    }


    // calculates signed curvature at t value
    curvature(t){
        const firstD = this.derivative();
        const secondD = this.secondDerivative();
        const firstDPoint = firstD.evaluate(t);
        const secondDPoint = secondD.evaluate(t);
        const numerator = firstDPoint.x * secondDPoint.y - firstDPoint.y * secondDPoint.x;
        const denominator = Math.pow(firstDPoint.magnitude(), 3);
        return numerator / denominator;
    }

}