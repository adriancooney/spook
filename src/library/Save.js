export class Save {
    constructor(store) {
        this.store = store;
    }

    get(name, defaultValue) {
        const value = this.store[name];
        return typeof value !== "undefined" ? value : defaultValue;
    }

    getNumber(name, defaultValue) {
        return parseInt(this.get(name, defaultValue));
    }

    set(name, value) {
        return this.store[name] = value;
    }
}

export default new Save(typeof window !== "undefined" ? window.localStorage : {});