import Box from "./Box";

export default class Rect extends Box {
    constructor(options) {
        super(options);
        this.fill = options.fill;
    }

    render(ctx) {
        if(this.fill) {
            ctx.fillStyle = this.fill;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        super.render(ctx);
    }
}