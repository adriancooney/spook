import Debug from "debug";
import { AbstractMethod } from "../Util";

const debug = Debug("game:renderer");

export default class Renderer {
    constructor(canvas, width, height, resolution = 1) {
        this.canvas = canvas;
        this.resolution = resolution;
        this.context = canvas.getContext("2d");
        this.rendering = false;
        this.width = width;
        this.height = height;

        // Sort out the resolution
        canvas.width = width * resolution;
        canvas.height = width * resolution;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        this.context.scale(resolution, resolution);
    }
    
    update() { AbstractMethod(); }
    render() { AbstractMethod(); }

    start() {
        debug("Starting renderer.");
        this.rendering = true;

        const tick = () => {
            try {
                if(this.rendering) {
                    requestAnimationFrame(tick);
                    this.update();
                    this.render(this.context);
                }
            } catch(e) {
                console.error(e.stack);
                this.rendering = false;
            }
        };

        tick();
    }

    stop() {
        debug("Stopping renderer.");
        this.rendering = false;
    }
}