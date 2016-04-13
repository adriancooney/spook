import qs from "qs";
import Debug from "debug";
import Renderer from "./library/Renderer";
import Spook from "./Spook";
import * as scenes from "./scenes";
import levels from "./levels.json";

Debug.enable("game*");

window.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("game");

    const width = 500;
    const height = 500;
    const res = 2; // @2x
    const game = new Spook(new Renderer(canvas, width, height, res));

    for(var scene in scenes)
        game.registerScene(scene, scenes[scene]);


    if(window.location.search.length > 1) {
        const options = qs.parse(window.location.search.substr(1));
        const grid = parseInt(options.grid) || 5;
        game.start("Game", {
            grid,
            seed: parseInt(options.seed) || Math.floor(Math.random() * 1000000),
            initialPosition: options.pos ? parseInt(options.pos) : Math.floor(Math.random() * grid + 1)
        });
    } else {
        game.start("Game", 0);
    }

    window.game = game;
});