import Debug from "debug";
import { Box, Rect, Text, Circle } from "./primitives";

const debug = Debug("game:Grid");

export default class Button extends Box {
    constructor(options = {}) {
        const grid  = options.grid || 5;
        const spacing = options.width ? options.width/grid - 1 : (options.spacing || 18);
        const width = options.width || grid - 1 * spacing
        const height = options.height || 40;

        super({ width, height, ...options });
        this.leaf = true;
        this.grid = grid;
        this.spacing = spacing;

        debug(`<Grid size=${grid} spacing=${spacing}>`);

        // Default dot renderer
        const circle = new Circle({ radius: 3 });
        this.renderDot = options.renderDot || ::circle.render;
        this.renderTile = options.renderTile || this.renderTile;
    }

    render(ctx) {
        const grid = this.grid;
        const spacing = this.spacing;

        for(var y = 0; y < grid; y++) {
            for(var x = 0; x < grid; x++) {
                const posX = x * spacing;
                const posY = y * spacing;

                ctx.save();
                ctx.translate(posX, posY);

                // We render one less tile than post
                if(x < grid - 1 && y < grid - 1)
                    this.renderTile(ctx, x, y, this.spacing);

                this.renderDot(ctx, x, y);
                ctx.restore();
            }
        }
    }

    renderTile(ctx, x, y, size) {}
}