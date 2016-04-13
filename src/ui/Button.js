import { Box, Rect, Text } from "./primitives";

export default class Button extends Box {
    constructor(options) {
        const width = options.width || 140;
        const height = options.height || 40;

        super({ width, height, ...options });

        this.fill = new Rect({ width, height, fill: options.fillBackground });
        this.text = new Text({ 
            text: options.text,
            align: "center",
            baseline: "middle",
            x: width/2, 
            y: height/2,
            color: options.fillText
        });

        this.addChildren(this.fill, this.text);
    }
}