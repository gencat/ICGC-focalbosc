//@flow


//export const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiZ2Vvc3RhcnRlcnMiLCJhIjoiMGNxekwxayJ9.sE1YC8Zxwzjh4CQeZiZN_g";
export const MAPBOX_ACCESS_TOKEN = "";
export const URL_COMPARADOR = "http://visors.icgc.cat/comparador-incendis/?codifinal=";

export const ANY_INIT = 1986;
export const ANY_FINAL = 2017;
export const MAX_YEAR = ANY_FINAL + 1;
export const ANY_COMPARADOR = 2004;

export const COLOR_INIT = "#ffbd00";
export const COLOR_FINAL = "#c21125";
export const TEMATIC_FIELD = "AREA";
export const FILTER_FIELD = "ANY";

export const MAX_INIT_ZOOM = 16;


/* THEMATICS */
export const ARRAY_AREA = [2, 1000000 , 31000000, 66000000, 112000000,182000000, 415000000 ];
//export const ARRAY_AREA = [70, 770833, 69343652, 207889290, 277162109, 346434928, 415707747];
export const ARRAY_RADIS = [2, 6, 12, 20, 25, 35, 48];
//export const ARRAY_COLORS = ["#ffe657", "#ffbd00", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#b10026"];
//export const ARRAY_COLORS = ["#e6f057","#eac849","#efa03a","#f3782b","#f7501d","#fb280e","#ff00ee"];
export const ARRAY_COLORS = ["#f4db18", "#f6b614", "#f89210", "#fa6d0c", "#fc4908", "#fe2404", "#b10026"];


export const THEMATIC_BY_AREA = generateThematicByAreaStyle();
export const THEMATIC_BY_RADIUS = generateThematicByRadius();


/* MAP SOURCES - MAP LAYERS */
export const MAPSTYLE_HISTORIC = "https://tilemaps.icgc.cat/tileserver/styles/historic.json";
export const PBF_INCENDIS = "https://tilemaps.icgc.cat/tileserver/tileserver.php/Incendis_1986_2017/{z}/{x}/{y}.pbf";

export const VECTOR_LAYER_POL = "incendis_4326_poligons_ok";
export const VECTOR_LAYER_POINT = "incendis_4326_centroides_ok";
export const INCENDISCAT_SOURCE_NAME = "incendis-cat";
export const INCENDISCAT_LINE_LAYER_NAME = "incendis-line";
export const LAYER_POL = "indencis_pol";
export const LAYER_LIN = "indencis_lin";
export const LAYER_CIRCLE = "indencis_circle";

export const INCENDISCAT_SOURCE = {
	name: INCENDISCAT_SOURCE_NAME,
	data: {
		"attribution": "Font: <a href='https://agricultura.gencat.cat.cat/' target='_blank'>DARP</a>",
		"type": "vector",
		"center": [1.8457, 41.7262, 8],
		"description": "Incendis Cat",
		"format": "pbf",
		"maxzoom": 18,
		"minzoom": 6,
		"tiles": [
			PBF_INCENDIS
		],
		"vector_layers": [{
			"id": VECTOR_LAYER_POL
		},
		{
			"id": VECTOR_LAYER_POINT
		}
		]
	}
};

export const INCENDISCAT_LINE_LAYER = {
	"id": LAYER_LIN,
	"source": INCENDISCAT_SOURCE_NAME,
	"source-layer": VECTOR_LAYER_POL,
	"interactive": true,
	"type": "line",
	"maxzoom": 18,
	"minzoom": 10.5,
	"layout": {
		"visibility": "visible"
	},
	"paint": {
		"line-opacity": .8,
		"line-width": 3,
		"line-color": THEMATIC_BY_AREA, //this.generateThematicByAreaStyle(),
	}
};

export const INCENDISCAT_CIRCLE_LAYER = {
	"id": LAYER_CIRCLE,
	"source": INCENDISCAT_SOURCE_NAME,
	"source-layer": VECTOR_LAYER_POINT,
	"interactive": true,
	"type": "circle",
	"maxzoom": 10.4,
	"minzoom": 6,
	"layout": {
		"visibility": "visible"
	},
	"paint": {
		"circle-color": THEMATIC_BY_AREA, //this.generateThematicByAreaStyle(),
		"circle-opacity": 0.8,
		"circle-stroke-color": "#b30000",
		"circle-stroke-width":1.5,
		"circle-stroke-opacity": 0.5,
		"circle-radius": THEMATIC_BY_RADIUS, //this.generateThematicByRadius()

	}
};


export const INCENDISCAT_POL_LAYER = {
	"id": LAYER_POL,
	"source": INCENDISCAT_SOURCE_NAME,
	"source-layer": VECTOR_LAYER_POL,
	"interactive": true,
	"type": "fill",

	"maxzoom": 11,
	"minzoom": 9.5,
	"layout": {
		"visibility": "visible"
	},
	"paint": {
		"fill-opacity": .5,
		"fill-color": THEMATIC_BY_AREA, //this.generateThematicByAreaStyle(),
	}
};




function generateThematicByAreaStyle() {

	const paintStyle = ["step", ["get", TEMATIC_FIELD]];

	ARRAY_AREA.forEach((_break, i) => {
		paintStyle.push(ARRAY_COLORS[i], parseInt(_break));
	});
	paintStyle.push("rgba(0,0,0,0)");

	return paintStyle;
}

function generateThematicByRadius() {

	const paintStyle = ["interpolate", ["exponential", 1], ["number", ["get", TEMATIC_FIELD]]];

	ARRAY_AREA.forEach((_break, i) => {

		paintStyle.push(_break, ARRAY_RADIS[i]);

	});

	return paintStyle;
}
