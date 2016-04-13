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

    game.start("Game", levels.levels[1]);

    window.game = game;
});