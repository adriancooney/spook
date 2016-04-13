import Scene from "../library/Scene";
import { DEBUG, Theme } from "../Config";
import { Button } from "../ui";

export default class Menu extends Scene {
    create() {
        const buttons = [
            ["New Game", ::this.onNewGame]
        ];

        if(DEBUG) {
            buttons.push(["Level Generator", ::this.onLevelGenerator])
        }

        const buttonWidth = 140;
        const buttonHeight = 50;
        const buttonGutter = 15;
        const buttonX = this.renderer.width/2 - buttonWidth/2;
        const buttonsHeight = buttons.length * (buttonHeight + buttonGutter) - buttonGutter;
        const buttonYOffset = this.renderer.height/2 - buttonHeight/2;

        this.addChildren(buttons.map(([text, handler], i) => {
            return new Button({ 
                x: buttonX, 
                y: buttonYOffset + (buttonHeight + buttonGutter) * i,
                width: buttonWidth,
                height: buttonHeight,
                text: text,
                fillBackground: Theme.finish,
                onClick: handler
            })
        }));
    }

    onNewGame() {
        this.transition("Game", {
            seed: Math.random(),
            grid: 8,
            initialPosition: 0
        });
    }

    onLevelGenerator() {

    }
}