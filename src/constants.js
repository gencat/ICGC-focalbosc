//@flow


//export const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZ2Vvc3RhcnRlcnMiLCJhIjoiMGNxekwxayJ9.sE1YC8Zxwzjh4CQeZiZN_g";

export const MAPBOX_ACCESS_TOKEN = "";
export const STYLE_URL = "https://tilemaps.icgc.cat/tileserver/styles/historic.json";
export const PBF_INCENDIS = "https://tilemaps.icgc.cat/tileserver/tileserver.php/Incendis_1986_2017/{z}/{x}/{y}.pbf";
export const VECTOR_LAYER_POL = "incendis_4326_poligons_ok";
export const VECTOR_LAYER_POINT = "incendis_4326_centroides_ok";
export const URL_COMPARADOR = "http://visors.icgc.cat/comparador-incendis/?codifinal=";
export const ANY_INIT = 1986;
export const ANY_FINAL = 2017;
export const ANY_COMPARADOR = 2004;
export const COLOR_INIT = "#ffbd00";
export const COLOR_FINAL = "#c21125";
export const TEMATIC_FIELD = "AREA";
export const FILTER_FIELD = "ANY";
//export const ARRAY_AREA = [2, 25502887.20, 51005772.36, 76508657.53, 102011542.69, 127514427.86, 293017313.02];

export const ARRAY_AREA = [70833, 69343652, 138616471, 207889290, 277162109, 346434928, 415707747];
export const ARRAY_RADIS = [4, 8, 13, 19, 25, 29, 36];
export const ARRAY_COLORS = ["#ffe900", "#ffbd00", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"];