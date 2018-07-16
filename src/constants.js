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
export const MAX_YEAR = ANY_FINAL + 1;
export const ANY_COMPARADOR = 2004;

export const COLOR_INIT = "#ffbd00";
export const COLOR_FINAL = "#c21125";
export const TEMATIC_FIELD = "AREA";
export const FILTER_FIELD = "ANY";

export const ARRAY_AREA = [2, 1000000 , 31000000, 66000000, 112000000,182000000, 415000000 ];
//export const ARRAY_AREA = [70, 770833, 69343652, 207889290, 277162109, 346434928, 415707747];
export const ARRAY_RADIS = [2, 6, 12, 20, 25, 35, 48];
//export const ARRAY_COLORS = ["#ffe657", "#ffbd00", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"];
//export const ARRAY_COLORS = ["#e6f057","#eac849","#efa03a","#f3782b","#f7501d","#fb280e","#ff00ee"];

export const ARRAY_COLORS = ["#f4db18","#f6b614","#f89210","#fa6d0c","#fc4908","#fe2404","#b10026"];
