import Object2D from "../../library/Object2D";

export default class Box extends Object2D {
    constructor(options) {
        super(options);
        this.width = options.width;
        this.height = options.height;
    }

    render(ctx) {
        if(window.DEBUG) {
            ctx.save();
            ctx.rect(0, 0, this.width, this.height);
            ctx.strokeStyle = "green";
            ctx.stroke();
            ctx.restore();
        }

        super.render(ctx);
    }

    contains(x, y) {
        return x > this.x && y > this.y && x < (this.x + this.width) && y < (this.y + this.height);
    }
}