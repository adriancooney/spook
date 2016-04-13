import Scene from "../library/Scene";
import { Button } from "../ui";

export default class Menu extends Scene {
    create() {
        this.addChildren(
            new Button({ 
                x: 40, y: 50, 
                text: "New Game",
                fillBackground: "red",
                onClick: () => this.transition("Game")
            })
        );
    }
}