import qs from "qs";

/**
 * Different levels of debug. Increase for more verbosity.
 * @type {Number}
 */
export const DEBUG = typeof window !== "undefined" && window.location.search.length > 1 ? 
    parseInt(qs.parse(window.location.search).debug) : 0;

const ThemeBlue = {
    border: "#E0E4CC",
    post: "#F38630",
    hinge: "#000000",
    tile: "#A7DBD8",
    coord: "#ffffff" 
};

export const Theme = {
    border: "#BCBCBC",
    post: "#FF9900",
    hinge: "#424242",
    hingeHighlight: "#C41A1E",
    tile: "#E9E9E9",
    coord: "#ffffff",
    player: "#3299BB",
    finish: "#8BE76C"
};