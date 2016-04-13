export function AbstractMethod(name) {
    name = name || arguments.callee.name || "anonymous";
    throw new Error(`${name}() is an abstract method to be implemented, not called directly.`);
}

export function Enum(...enums) {
    enums.forEach((str, i) => enums[str] = i);
    return enums;
}

export function Array2d(m, n, value) {
    if(typeof n === "function") value = n, n = m;

    const top = [];
    for(let i = 0; i < m; i++) {
        let ia = top[i] = []

        for(let u = 0; u < n; u++) {
            ia.push(value ? typeof value === "function" ? value(i, u) : value : 0);
        }
    }

    return top;
}

export function map2d(array2d, iterator) {
    const dimY = array2d.length;
    const dimX = array2d[0].length;

    for(let i = 0; i < dimY; i++)
        for(let u = 0; u < dimX; u++)
            array2d[i][u] = iterator(array2d[i][u], u, i);
}

export function forEach2d(array2d, iterator) {
    const dimY = array2d.length;
    const dimX = array2d[0].length;

    for(let i = 0; i < dimY; i++)
        for(let u = 0; u < dimX; u++)
            iterator(array2d[i][u], u, i);
}