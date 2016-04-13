import Node from "./Node";

export default class Object2D extends Node {
    constructor(options) {
        super(options ? options.children : undefined);

        this.x = options && options.x || 0;
        this.y = options && options.y || 0;

        if(options) {
            this.onClick = options.onClick;
        }
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    addChild(child) {
        if(!(child instanceof Object2D))
            throw new Error("Only <Object2D> objects may be added as child.");

        Node.prototype.addChild.call(this, child);
    }

    update() {}

    render(ctx) {
        if(window.DEBUG) {
            ctx.save();
            ctx.fillStyle = "#000000";
            ctx.textBaseline = "top";
            ctx.fillText(this.constructor.name, 7, 3);
            ctx.fillRect(-5, -5, 10, 10);
            ctx.restore();
        }

        if(!this.leaf) this.children.forEach(child => {
            ctx.save();
            ctx.translate(child.x, child.y);
            child.render(ctx);
            ctx.restore();
        });
    }

    contains(x, y) {
        return false;
    }

    find(x, y, collection = []) {
        if(this.contains(x, y)) {
            collection.push(this);
            
            if(!this.leaf)
                this.children.forEach(child => child.find(x - this.x, y - this.y, collection));
        }

        return collection;
    }
}