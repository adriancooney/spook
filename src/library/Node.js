export default class Node {
    constructor(children = []) {
        this.children = children;
    }

    addChild(child) {
        this.children.push(child);
    }

    addChildren(...children) {
        if(Array.isArray(children[0]))
            children = children[0];

        children.forEach(::this.addChild);
    }

    removeChild(child) {
        this.children.splice(this.children.indexOf(child), 1);
    }
}