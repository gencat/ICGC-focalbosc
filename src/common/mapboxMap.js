// @flow


import Map from "./Map";
import mapboxgl from "mapbox-gl";

/**
 * Map using the mapbox backend
 *
 * @param {string} apiKey The api key used by the map
 * @param {string} containerId The container id where the map will be drawn
 * @param {string} styleId The style id that will be used to draw the map
 */
class MapboxMap extends Map {

	apiKey: string;
	layerIds: Array<string>;
	sourceIds: Array<string>;

	constructor(apiKey: ?string, options: ?MapOptions) {

		const defaultParameters = {
			container: "",
			style: "https://tilemaps.icgc.cat/tileserver/styles/fosc.json",
			center: [1.60859, 41.7554],
			zoom: 6,
		};

		super(Object.assign(defaultParameters, options));

		this.apiKey = apiKey || "";
		this.layerIds = [];
		this.sourceIds = [];

	}

	/**
	 * Creates the map. Do not call directly
	 *
	 * @param {function} resolve The function to call when the map creation succeeds
	 * @param {function} reject The function to call when the map creation fails
	 *
	 * @see Map::create
	 */
	mapCreate(resolve, reject) {

	//	if (this.apiKey !== "") {

		mapboxgl.accessToken = this.apiKey;
		this.map = new mapboxgl.Map(this.options);
		this.isInitialized = true;
		this.map.on("load", () => {

			super.mapHasLoaded();
			resolve();

		});

	//	} else {

	//		reject(new Error("API Key not set"));

	//	}

	}

	/**
	 * Removes the map from the element. Do not call directly
	 *
	 * @see Map::remove
	 */
	mapRemove() {

		this.map.remove();

	}









	/**
	 * Adds data to draw to the map. Do not call directly
	 *
	 * @param {MapData} data
	 * @see Map::addData
	 */
	addMapData(data: MapData) {

		data.sources.forEach(source => {

			this.map.addSource(source.name, source.data);
			this.sourceIds.push(source.name);

		});

		data.layers.forEach(layer => {

			this.map.addLayer(layer);
			this.layerIds.push(layer.id);

		});

	}

	/**
	 * Removes all the data from the map. Implementation specific
	 *
	 */
	removeMapData() {

		this.layerIds.forEach(layer => {

			this.map.removeLayer(layer);

		});

		this.layerIds = [];

		this.sourceIds.forEach(source => {

			this.map.removeSource(source);

		});

		this.sourceIds = [];

	}

	/**
	 * Sets the data to draw. Do not call directly
	 *
	 * @param {baseLayr} url
	 * @see Map::setMapBaseLayer
	 */
	setMapBaseLayer(baseLayerURL: string) {

		return new Promise((resolve, reject) => {

			this.map.setStyle(baseLayerURL);
			this.map.on("styledata", (data) => {

				// Setting a style removes all the layers and sources from the map
				// remove the pointers to them
				this.layerIds = [];
				this.sourceIds = [];

				if (data.dataType === "style") {
					console.info("isStyleLoaded", this.map.isStyleLoaded());
					resolve();
				}
			});

		});

	}



	fitBounds(bounds: array) {

		this.map.fitBounds(bounds);
	}


	getZoom() {

		return	this.map.getZoom();

	}

	easeTo(options) {

		this.map.easeTo(options);


	}


	getLayer(id: string) {

		return this.map.getLayer(id);
	}

	setCursorPointer(pointer: string) {

		this.map.getCanvas().style.cursor = pointer;
	}


	removeLayer(id) {
		this.map.removeLayer(id);
	}

	setPaintProperty(layer, property, data) {

		this.map.setPaintProperty(layer, property, data);

	}

	setLayoutProperty(layer, property, data) {

		this.map.setLayoutProperty(layer, property, data);

	}


	/**
	 * SetFilters
	 *
	 *
	 */
	setFilter(layer, filter) {

		this.map.setFilter(layer, filter);

	}

	/**
	 * return filter getFilter
	 *
	 *
	 */

	getFilter(layer) {

		return this.map.getFilter(layer);

	}

	updateLayer(layer: object) {
		console.info(layer.id);
		console.info(this.map.isStyleLoaded());
		//if (this.map.isStyleLoaded()) {
		if (this.map.getLayer(layer.id)) {
			this.map.removeLayer(layer.id);
			this.map.addLayer(layer);
		} else {

			this.map.addLayer(layer);
		}
		//}

	}

	/**
	 * Sets the API key used by the map
	 *
	 * @param {string} apiKey
	 */
	setAPIKey(apiKey: string) {

		this.apiKey = apiKey;

	}

	/**
	 * Subscribe to a map event that happens on a layer
	 *
	 * @param {string} eventName The event name
	 * @param {string} layerName The layer name
	 * @param {Function} callback The callback to run when the event arrives
	 */
	subscribe(eventName, layerName, callback) {

		if (layerName.trim() !== "")
			this.map.on(eventName, layerName, (e) => callback(e, layerName));
		else
			this.map.on(eventName, (e) => callback(e));
	}


	addControlMap(controlName, controlOptions) {

		let defaultOptions = {};
		if (controlName == "attribution") {

			defaultOptions = controlOptions || {compact: true};

			this.map.addControl(new mapboxgl.AttributionControl(defaultOptions));

		} else if (controlName == "popup") {

			defaultOptions = controlOptions || {closeButton: false};
			const popup = new mapboxgl.Popup(defaultOptions);
			return popup;

		} else if (controlName == "zoom") {
			defaultOptions = controlOptions || {zoomIn: true, zoomOut: true, compass: false };
			this.map.addControl(new mapboxgl.NavigationControl(defaultOptions));


		}

	}


	/**
	 * Queries the rendered features in a point or a bbox
	 *
	 * @param {(PointLike | Array<PointLike>)?} place
	 * @param {string} layer
	 */
	queryRenderedFeatures(place, layer) {

		return this.map.queryRenderedFeatures(place, {layers: [layer]});

	}

	/**
	 * Changes the cursor type
	 *
	 * @param {string} name
	 */
	setCursor(name) {

		this.map.getCanvas().style.cursor = name;

	}

}

module.exports = MapboxMap;
