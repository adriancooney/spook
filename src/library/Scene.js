import Debug from "debug";
import Rect from "../ui/primitives/Rect";

const debug = Debug("game:scene");

export default class Scene extends Rect {
    constructor(renderer) {
        super({ 
            width: renderer.width, 
            height: renderer.height, 
            x: 0, 
            y: 0 
        });
        
        this.renderer = renderer;
    }

    setState(state) {
        this.state = state;
    }

    addChild(child) {
        debug("Adding new child to scene: ", child);
        super.addChild(child);
    }

    clear(ctx) {
        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, this.renderer.width, this.renderer.height);
        ctx.restore();
    }

    background(fill) {
        this.fill = fill;
    }

    render(ctx) {
        this.clear(ctx);
        super.render(ctx);
    }

    click(x, y) {
        this.find(x, y).forEach(node => {
            if(node.onClick)
                node.onClick.call(node, x, y);
        });
    }

    onKeyDown(key, event) {}
    onSwipe(direction) {}
}