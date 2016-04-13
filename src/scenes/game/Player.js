import Debug from "debug";
import Object2D from "../../library/Object2D";
import { Enum } from "../../Util";
import { CONFIG } from "../../Config";

const debug = Debug("game:player");

export default class Player extends Object2D {
    constructor(options) {
        super(options);
        this.leaf = true; // Tell the renderer to not render any children
        this.spacing = options.spacing;
        this.positions = [options.initialPosition];
        this.currentPosition = options.initialPosition;
        this.size = this.spacing * 0.3;
        this.color = options.color || "green";
    }

    render(ctx) {
        const s = this.size;
        const hs = this.size/2;
        const [ix, iy] = this.positions[0];

        ctx.beginPath();
        const irx = this.toRealPosition(ix);
        const iry = this.toRealPosition(iy);
        ctx.moveTo(irx, iry - this.spacing/2);
        ctx.lineTo(irx, iry);

        // Render the tron stream
        if(this.positions.length > 2) this.positions.slice(1, -1).forEach(([x, y], i) => {
            ctx.lineTo(this.toRealPosition(x), this.toRealPosition(y));
        });

        let [cx, cy] = this.currentPosition;
        let x = this.toRealPosition(cx);
        let y = this.toRealPosition(cy);

        ctx.lineTo(x, y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = hs;
        ctx.stroke();

        ctx.translate(x, y);
        ctx.fillStyle = this.color;
        ctx.fillRect(-hs, -hs, s, s);
        
        if(DEBUG >= 3) {
            ctx.fillStyle = "purple";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${cx},${cy}`, 0, 0);
        }
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
        const [x, y] = Player.movePoint(...this.currentPosition, move);
        debug("Moving %s (from %o)", Player.moves[move], this.currentPosition);

        if(this.positions.length > 1) {
            const [px, py] = this.positions[this.positions.length - 2]

            if(x === px && y === py) {
                this.positions.pop();
                this.currentPosition = this.positions[this.positions.length - 1];
                return;
            }
        }

        this.moveTo(x, y);
    }

    static movePoint(x, y, move) {
        move = Player.moves[move];

        if(move === Player.moves.up) y -= 1;
        else if(move === Player.moves.down) y += 1;
        else if(move === Player.moves.left) x -= 1;
        else if(move === Player.moves.right) x += 1;

        return [ x, y ];
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