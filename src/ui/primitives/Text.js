import Box from "./Box";

export default class Text extends Box {
    constructor(options) {
        super(options);
        this.text = options.text;
        this.fill = options.fill || "#000000";
        this.font = options.font || "16px Arial";
        this.baseline = options.baseline || "top";
        this.align = options.align || "left";
    }

    render(ctx) {
        ctx.font = this.font;
        ctx.textAlign = this.align;
        ctx.textBaseline = this.baseline;
        ctx.fillStyle = this.fill;
        ctx.fillText(this.text, 0, 0);

        super.render(ctx);
    }
}