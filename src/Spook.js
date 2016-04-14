import Debug from "debug";
import Hammer from "hammerjs";
import Renderer from "./library/Renderer";

const debug = Debug("game");

export default class Spook {
    constructor(renderer) {
        debug("Creating new game.");
        this.renderer = renderer;
        this.scenes = {};
        this.currentScene = null;

        this.renderer.canvas.addEventListener("click", ::this.onClick);
        var gestures = new Hammer(document);
        gestures.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
        gestures.on("swipe", ::this.onSwipe);
        window.addEventListener("keydown", ::this.onKeyDown);

        this.renderer.render = ::this.render;
        this.renderer.update = ::this.update;
    }

    update() {
        this.currentScene.setState(this.currentScene.update(this.currentScene.state));
    }

    render(context) {
        this.currentScene.render(context, this.currentScene.state);
    }

    transition(sceneName, ...data) {
        const scene = this.getScene(sceneName);
        this.currentScene = new scene(this.renderer);
        this.currentScene.transition = ::this.transition;
        this.currentScene.create(...data);
    }

    registerScene(name, scene) {
        debug(`Registering scene: "${name}"`);
        this.scenes[name] = scene;
    }

    getScene(name) {
        const scene = this.scenes[name];

        if(!scene)
            throw new Error(`Unkown scene "${name}".`);

        return scene;
    }

    start(scene, ...data) {
        this.transition(scene, ...data);
        this.renderer.start();
    }

    onClick(event) {
        this.currentScene.click(event.offsetX, event.offsetY);
    }

    onKeyDown(event) {
        this.currentScene.onKeyDown(event.keyCode || event.which, event);
    }

    onSwipe(event) {
        let direction;

        switch(event.direction) {
            case Hammer.DIRECTION_UP: direction = "up"; break;
            case Hammer.DIRECTION_LEFT: direction = "left"; break;
            case Hammer.DIRECTION_RIGHT: direction = "right"; break;
            case Hammer.DIRECTION_DOWN: direction = "down"; break;
        }

        // Convert swipes to keys
        this.currentScene.onSwipe(direction);
    }
}