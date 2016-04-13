import Debug from "debug";
import Object2D from "../../library/Object2D";
import { Enum } from "../../Util";

const debug = Debug("game:player");

export default class Player extends Object2D {
    constructor(options) {
        super(options);
        this.leaf = true; // Tell the renderer to not render any children
        this.spacing = options.spacing;
        this.positions = [options.initialPosition];
        this.currentPosition = options.initialPosition;
        this.size = 16;
        this.color = options.color || "green";
    }

    render(ctx) {
        const s = this.size;
        const hs = this.size/2;

        // Render the tron stream
        if(this.positions.length > 1) {
            ctx.beginPath();

            const [ix, iy] = this.positions[0];
            ctx.moveTo(this.toRealPosition(ix), this.toRealPosition(iy));

            this.positions.forEach(([x, y], i) => {
                if(i === 0) return;
                ctx.lineTo(this.toRealPosition(x), this.toRealPosition(y));
            });

            ctx.strokeStyle = this.color;
            ctx.lineWidth = hs;
            ctx.stroke();
        } 

        let [x, y] = this.currentPosition;
        x = this.toRealPosition(x);
        y = this.toRealPosition(y);

        ctx.fillStyle = this.color;
        ctx.fillRect(x - hs, y - hs, s, s);
    }

    isOnTile(x, y) {
        return !!this.positions.find(([dx, dy]) => dx === x && dy === y);
    }

    /**
     * Convert a value to real position.
     * @param  {Number} value Tile value.
     * @return {Number}       Real position value.
     */
    toRealPosition(value) {
        return value * this.spacing + (this.spacing/2);
    }

    /**
     * The possible moves for a player.
     *
     * WARNING: ORDERING IS IMPORTANT! See `Game.toDirection`
     * for reasons why.
     * 
     * @type {Array}
     */
    static moves = Enum("up", "right", "down", "left");

    /**
     * Move the player.
     * @param  {String} move See .moves.
     */
    move(move) {
        move = Player.moves[move];
        let [x, y] = this.currentPosition;

        if(move === Player.moves.up) y -= 1;
        else if(move === Player.moves.down) y += 1;
        else if(move === Player.moves.left) x -= 1;
        else if(move === Player.moves.right) x += 1;

        debug("Moving %s (from %o)", Player.moves[move], this.currentPosition);
        this.moveTo(x, y);
    }

    /**
     * Force a player to jump to a position.
     * @param  {Number} x X tile position.
     * @param  {Number} y Y tile position.
     */
    moveTo(x, y) {
        const position = [x, y];
        debug("Moving to %o from %o", position, this.currentPosition);
        this.positions.push(position);
        this.currentPosition = position;
    }
}