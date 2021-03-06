import seedrandom from "seedrandom";
import Debug from "debug";
import Scene from "../../library/Scene";
import Player from "./Player";
import Save from "../../library/Save";
import { Enum, Array2d, map2d } from "../../Util";
import { Button, Grid } from "../../ui";
import { Group, Text, Rect } from "../../ui/primitives";
import { DEBUG, Theme } from "../../Config";
import { levels } from "../../levels.json";

const Directions = Enum("NORTH", "EAST", "SOUTH", "WEST");
const debug = Debug("game:Game");

export default class Game extends Scene {
    create(level) {
        if(typeof level === "number") {
            this.level = level;
            level = levels[level];
        }

        let { seed, initialPosition, grid, difficulty } = level;

        const width = this.renderer.width * 0.7;
        this.game = new Group({ x: (this.renderer.width/2) - (width/2), y: (this.renderer.height/2) - (width/2) });

        this.theme = Theme;
        this.seed = seed;
        this.random = seedrandom(seed);
        this.gridSize = grid + 2; // Plus two for the extra bounding lanes
        this.grid = new Grid({
            grid: this.gridSize,
            width: width,
            renderDot: ::this.renderGridDot,
            renderTile: ::this.renderGridTile
        });

        this.game.addChild(this.grid);

        // Generate the gate state. This creates 
        this.posts = Array2d(this.gridSize - 2, (x, y) => {
            // Create the gates for each grid dot. We can only have 1 gates
            // on corner dots and two on outer dots.
            // 
            // WARNING: ADJUSTING THIS ALGORITHM WILL INVALIDATE ALL
            // THE LEVELS!
            const hingeCount = this.randInt(1, 4 - this.randInt(2));

            const hinges = [];

            for(let i = 0; i < hingeCount; i++) {
                const direction = this.randInt(4);

                if(hinges.find(hinge => hinge.direction === direction))
                    continue;

                hinges.push({ direction });
            }

            return hinges;
        });

        // Create the player
        this.player = new Player({
            initialPosition: [initialPosition, 0],
            spacing: this.grid.spacing,
            color: this.theme.player
        });

        const lineSize = this.player.size/2;

        // Start line
        this.game.addChild(this.startline = new Rect({ 
            y: -lineSize, x: -1, // -1 To budge for border
            width: this.grid.width + 2, 
            height: lineSize, 
            fill: this.theme.player 
        }));

        // Finish line
        this.game.addChild(new Rect({ 
            y: this.grid.width, x: -1, 
            width: this.grid.width + 2, 
            height: lineSize, 
            fill: this.theme.finish 
        }));

        // Level indicator
        if(typeof this.level !== "undefined") {
            this.addChild(new Text({
                text: `LEVEL ${this.level + 1}`,
                x: this.renderer.width/2,
                y: this.renderer.width/2 - this.grid.width/2 - 45,
                align: "center",
                font: "bold 1.5em Arial",
                color: "#aaa"
            }));

            // Restart button
            this.addChild(new Button({
                text: "RESTART",
                x: (this.renderer.width/2) + (this.grid.width/2) - 60,
                y: (this.renderer.height/2) + (this.grid.width/2) + 10,
                font: "14px Arial",
                fillText: "#777",
                width: 60,
                height: 24,
                onClick: this.transition.bind(this, "Game", this.level)
            }));
        }

        this.game.addChild(this.player);
        this.addChild(this.game);

        if(DEBUG) {
            this.seedText = new Text({ 
                x: 5, y: 5, 
                text: `Seed: ${this.seed}${difficulty ? "   Difficulty: " + difficulty + "/10" : ""}` 
            });

            this.addChild(this.seedText);
        }
    }

    /**
     * Return a post.
     * @param  {Number} x 
     * @param  {Number} y 
     * @return {Array}      The hinges on the post.
     */
    getPost(x, y) {
        return this.posts[y][x];
    }

    /**
     * Get a seeded random integer.
     * @param  {Number} min 
     * @param  {Number} max 
     * @return {Number}
     */
    randInt(min, max) {
        if(typeof max === "undefined") max = min, min = 0;
        return Math.max(0, Math.floor(min + (this.random() * (max - min))));
    }

    renderGridDot(ctx, x, y) {        
        if(x > 0 && x < this.gridSize - 1 && y > 0 && y < this.gridSize - 1) {
            // Render the hinges
            const hx = x - 1, hy = y - 1;
            const hinges = this.getPost(x - 1, y - 1);
            const pi2 = Math.PI/2;

            // Render the hinge
            hinges.forEach(hinge => {
                ctx.save();

                // Hinge animation
                const { direction, directionPrevious, directionProgress } = hinge;
                let rotation = direction * pi2;
                if(typeof directionPrevious !== "undefined") {
                    if(directionProgress < 1) {
                        rotation = directionPrevious * pi2;
                        const clockDirection = Game.getClockDirection(directionPrevious, direction);

                        rotation += (clockDirection * directionProgress) * pi2;
                        hinge.directionProgress += 0.1;
                    } else {
                        delete hinge.directionPrevious;
                        delete hinge.directionProgress;
                    }
                }

                // Rotate the hinge in the correct direction
                ctx.rotate(Math.PI + rotation)

                // Display any highlights
                if(hinge.highlight) {
                    const now = Date.now();
                    if((now - hinge.highlightTime) > 300) {
                        hinge.highlight = false;
                        delete hinge.highlightTime;
                    }

                    ctx.fillStyle = this.theme.hingeHighlight;
                } else {
                    ctx.fillStyle = this.theme.hinge;
                }

                ctx.fillRect(-2, 0, 4, this.grid.spacing * 0.47);

                if(DEBUG >= 3) {
                    ctx.fillStyle = "red";
                    ctx.fillText(`${hinge.direction}`, 0, 15);
                }

                ctx.restore();
            });

            // Render the post
            ctx.fillStyle = this.theme.post[hinges.length];
            ctx.beginPath();
            ctx.arc(0, 0, 6, 0, Math.PI*2);
            ctx.closePath();
            ctx.fill();

            if(DEBUG >= 3) {
                ctx.fillStyle = "blue"
                ctx.fillText(`${hx},${hy}`, 0, 0);
            }
        }
    }

    renderGridTile(ctx, x, y, size) {
        const pad = size * 0.15;
        const pad2 = pad * 2;

        // Render inset background
        ctx.beginPath();
        ctx.rect(pad, pad, size - pad2, size - pad2);
        ctx.fillStyle = this.theme.tile;
        ctx.fill();
        ctx.closePath();

        // Render Border
        ctx.beginPath();
        ctx.rect(0, 0, size, size);
        ctx.strokeStyle = this.theme.border;
        ctx.stroke();
        ctx.closePath();

        if(DEBUG >= 3) {
            // Render Coordinate
            ctx.fillStyle = this.theme.coord;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${x},${y}`, size/2, size/2);
        }
    }

    /**
     * Move the player in Direction.
     * @param  {String} move Direction.
     */
    move(move) {
        if(this.hasWon) return;

        debug("Moving player %s.", move);

        const [ x, y ] = this.player.currentPosition;
        const [nx, ny] = Player.movePoint(x, y, move);
        const gs = this.gridSize - 2; // Minux two to account for extra lanes

        // Check if the game is complete
        if(ny >= this.gridSize - 1) {
            // Reached the end!
            this.won();
        }

        // Not allow to move outside the posts
        if(nx < 0 || ny < 0 || nx > gs || ny > gs) {
            debug("Illegal move, ignoring.");
            return;
        }

        const direction = Game.moveToDirection(move);
        const gateState = this.getGateState(x, y, direction);

        debug("Next gate state: %s", Game.gateStates[gateState])

        // Check to see if move is legal
        // 1. Check if gate is open
        if(gateState !== Game.gateStates.OPEN)
            return this.highlightGate(x, y, direction);

        // Move the player
        this.player.move(move);

        // Normalize move to left and right.
        const rotation = move === "up" ? "right" : move === "down" ? "left" : move;

        // Rotate the gates
        this.rotateGates(rotation);
    }


    highlightGate(x, y, direction) {
        debug("Highlighting gate <%d,%d> %s.", x, y, Directions[direction]);
        this.getGate(x, y, direction).forEach(hinge => {
            if(hinge) {
                hinge.highlight = true;
                hinge.highlightTime = Date.now();
            }
        });
    }

    rotateGates(rotation) {
        debug("Rotate gates %s.", rotation);

        const hp = Math.PI/2;
        const rotationTransform = rotation === "left" ? hp : -hp;
        map2d(this.posts, (hinges, rx, ry) => {
            // Rotate the hinges
            hinges.forEach((hinge, i) => {
                const directionPrevious = hinge.direction;
                const direction = Game.rotateDirection(directionPrevious, rotation === "left");

                // Check first if we can rotate into the direction because the user's
                // tron stream could be in the way.
                let [dx, dy] = Game.getQuadrantForRotation(directionPrevious, direction);
                const x = rx + dx + 1;
                const y = ry + dy + 1;

                if(this.player.isOnTile(x, y)) // + 1 because of bounding tiles
                    return;

                // For animations
                hinge.directionPrevious = directionPrevious;
                hinge.directionProgress = 0;

                // Rotate the state. Why do we use strings? More reliable comparasion
                // when determining strings. 
                hinge.direction = direction;
            });

            // Now remove any hinges facing the same direction
            return hinges.reduce((nextHinges, hinge) => {
                if(!nextHinges.find(h => hinge.direction === h.direction))
                    nextHinges.push(hinge);

                return nextHinges;
            }, []);
        });
    }

    won() {
        this.hasWon = true;
        this.player.won();
        this.player.color = this.theme.finish;
        this.startline.fill = this.theme.finish;

        if(typeof this.level !== "undefined") setTimeout(() => {
            this.transition("Game", Save.set("level", ++this.level));
        }, 1500);
    }

    static gateStates = Enum("CLOSED", "HALF_OPEN", "OPEN");

    /**
     * This returns the state of the gate at x, y and direction at
     * a GRID POINT (not way).
     * @param  {Number} x         The row.
     * @param  {Number} y         The column.
     * @param  {String} direction See Rotations.
     * @return {Array}            [hinge1, hinge2]
     */
    getGate(x, y, direction) {
        let p1x = 0, p1y = 0, p2x = 1, p2y = 1;

        // Determine which post to grab. This is an optimized solution.
        if(direction === Directions.NORTH) p2x = 1, p2y = 0;
        else if(direction === Directions.EAST) p1x = 1, p1y = 0;
        else if(direction === Directions.SOUTH) p1x = 0, p1y = 1;
        else if(direction === Directions.WEST) p2x = 0, p2y = 1;

        // Find the hinges we need
        const h1d = direction === Directions.NORTH || direction === Directions.SOUTH ?
            Directions.EAST : Directions.SOUTH;
        const h2d = direction === Directions.NORTH || direction === Directions.SOUTH ? 
            Directions.WEST : Directions.NORTH;

        const gs = this.gridSize - 1;
        p1x += x; p1y += y;
        p2x += x; p2y += y;

        // Find the posts
        const p1 = p1x > 0 && p1y > 0 && p1x < gs && p1y < gs && this.getPost(p1x - 1, p1y - 1);
        const p2 = p2x > 0 && p2y > 0 && p2x < gs && p2y < gs && this.getPost(p2x - 1, p2y - 1);

        const h1 = p1 && p1.find(hinge => hinge.direction === h1d);
        const h2 = p2 && p2.find(hinge => hinge.direction === h2d);

        return [ h1, h2 ];
    }

    /**
     * Get the state of a gate.
     * @param  {Number} x         The row.
     * @param  {Number} y         The column.
     * @param  {Number} direction See Rotations.
     * @param  {Number}           See Game.gateStates.
     */
    getGateState(x, y, direction) {
        const [ h1, h2 ] = this.getGate(x, y, direction);

        if(h1 && h2) return Game.gateStates.CLOSED;
        else if(!h1 && !h2) return Game.gateStates.OPEN;
        else return Game.gateStates.HALF_OPEN;
    }

    /*
     * Handle keypress.
     */
    onKeyDown(which, event) {
        const keys = {
            [37]: "left",
            [38]: "up",
            [39]: "right",
            [40]: "down"
        };

        if(keys[which]) { // "up", "left", "right", "down"
            // Stop scrolling in Firefox
            event.preventDefault();
            this.move(keys[which]);
        }
    }

    onSwipe(direction) {
        this.move(direction);
    }

    /**
     * Rotate a direction clockwise or anti-clockwise.
     *
     * e.g rotateDirection(Directions.NORTH, true) == "EAST"
     *     rotateDirection(Directions.NORTH", false) == "WEST"
     *     
     * @param  {String} direction The direction to rotate. See DIRECTIONS.
     * @param  {Boolean} clockwise Clockwise (true) or anti-clockwise (false).
     * @return {String}           The rotated direction.
     */
    static rotateDirection(direction, clockwise) {
        const index = direction + (clockwise ? 1 : -1);
        const max = Directions.length - 1;

        if(index < 0) return max;
        else if(index > max) return 0;
        else return index;
    }


    /**
     * Convert move to direction.
     * @param  {String} move Move.
     * @return {String}      Direction.
     */
    static moveToDirection(move) {
        return Player.moves.indexOf(move);
    }

    static getClockDirection(directionPrevious, direction) {
        if(direction === 3 && directionPrevious === 0) return -1;
        else if(direction === 0 && directionPrevious === 3) return 1;
        else return direction - directionPrevious;
    }

    /**
     * Given a post, find the tile to check for collisions
     * when rotating in a specific direction.
     * @param  {Number} dp The current direction.
     * @param  {Number} d  The direction rotating to.
     * @return {Array}     [x, y]
     */
    static getQuadrantForRotation(pd, d) {         
        let dx = 0, dy = -1;

        if(pd === 0 && d === 3 || pd === 3 && d === 0 ||
            pd === 2 && d === 3 || pd === 3 && d === 2) dx = -1;

        if(pd === 1 && d === 2 || pd === 2 && d === 1 ||
            pd === 2 && d === 3 || pd === 3 && d === 2) dy = 0;

        return [dx, dy];
    }
}