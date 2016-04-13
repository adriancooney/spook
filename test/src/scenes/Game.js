import assert from "assert";
import Game from "../../../src/scenes/game/Game";

describe("Game", () => {
    describe("#getTileForRotation", () => {
        it("should correctly return the rotation", () => {
            const tests = [
                [0, 3, -1, -1],
                [3, 0, -1, -1],
                [0, 1, 0, -1],
                [1, 0, 0, -1],
                [1, 2, 0, 0],
                [2, 1, 0, 0],
                [2, 3, -1, 0],
                [3, 2, -1, 0]
            ];

            tests.forEach(([pd, d, x, y]) => {
                assert.deepEqual(Game.getTileForRotation(0, 0, pd, d), [x, y], `pd: ${pd}, d: ${d}, x: ${x}, y: ${y}`);
            });
        });
    });
});