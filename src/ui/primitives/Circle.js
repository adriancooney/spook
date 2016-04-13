import Object2D from "../../library/Object2D";

export default class Circle extends Object2D {
    constructor(options) {
        super(options);
        this.radius = options.radius;
        this.fill = options.fill || "orange";
        this.stroke = options.stroke;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.fill;
        ctx.fill();

        if(this.stroke) {
            ctx.strokeStyle = this.stroke;
            ctx.stroke();
        }

        super.render(ctx);
    }
}