//@flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import MapboxMap from "../../common/mapboxMap";
import * as CONSTANTS from "../../constants";

import Utils from "../../common/utils";

import Compare  from "mapbox-gl-compare";
import { Icon, Button, Image } from "semantic-ui-react";

import styles from "./MapCompare.css";

export default class MapCompare extends Component {

	map;
	beforeMap;
	afterMap;
	//currentZoom;
	timestamp;

	doReset;

	state = {
		width: window.innerWidth,
		showPanel: false,
		showPanelPopup: false,
		MUNICIPI:"",
		DATAINCENT:"",
		MUNICIPI_MOV:"",
		DATAINCENT_MOV:"",
		ANY:"",
		AREA:"",
		CODIFINAL:"",
		XMAX:"",
		XMIN:"",
		YMAX:"",
		YMIN:"",
		AREAKM:""
	}

	constructor() {
		super();
		window.addEventListener("resize", this.handleWindowSizeChange);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleWindowSizeChange);
	}

	handleWindowSizeChange = () => {
		this.setState({ width: window.innerWidth });
	};

	async componentDidMount() {

		console.log("componentDidMount");
		/* this.timestamp = Date.now(); */

		this.doReset = 0;
		this.currentZoom = CONSTANTS.INIT_APP_ZOOM;

		this.beforeMap = new MapboxMap(CONSTANTS.MAPBOX_ACCESS_TOKEN, {
			style: CONSTANTS.MAPSTYLE_HISTORIC,
			zoom: CONSTANTS.INIT_APP_ZOOM,
			center: CONSTANTS.INIT_APP_CENTER,
			hash:true,
			attributionControl:false,
			container: this.beforeMapContainer
		});


		this.afterMap = new MapboxMap(CONSTANTS.MAPBOX_ACCESS_TOKEN, {
			style: CONSTANTS.MAPSTYLE_HISTORIC,
			zoom: CONSTANTS.INIT_APP_ZOOM,
			center: CONSTANTS.INIT_APP_CENTER,
			hash:true,
			attributionControl:false,
			container: this.afterMapContainer
		});

		await this.afterMap.create();
		await this.beforeMap.create();

		this.initMapData();

		this.map = new Compare(this.beforeMap.getMap(), this.afterMap.getMap(), {
			// Set this to enable comparing two maps by mouse movement:
			// mousemove: true
		});

		this.map._setPosition(0);

		this.initMapEvents();

		this.props.initURLParams();

	}

	componentDidUpdate(prevProps) {

		console.log("componentDidUpdate");

		if (prevProps.anyIncendi !== this.props.anyIncendi) {
			this.updateFilterByYear();
		}

		if (prevProps.beforeMapLayer.value !== this.props.beforeMapLayer.value) {

			this.beforeMap.removeLayer(prevProps.beforeMapLayer.key);
			this.beforeMap.addLayer({"id": this.props.beforeMapLayer.key, "type": "raster", "source": this.props.beforeMapLayer.key}, CONSTANTS.CUT_LAYER);

		}

		if (prevProps.afterMapLayer.value !== this.props.afterMapLayer.value) {

			this.afterMap.removeLayer(prevProps.afterMapLayer.key);
			this.afterMap.addLayer({"id": this.props.afterMapLayer.key, "type": "raster", "source": this.props.afterMapLayer.key}, CONSTANTS.CUT_LAYER);

		}

		const pitch = this.props.modeComparador ? 45 : 0;

		

		if (!Utils.isEmpty(this.props.currentIncendi) && (prevProps.currentIncendi.value === {} ||  prevProps.currentIncendi.value !== this.props.currentIncendi.value)) {

			const bboxList = this.props.currentIncendi.bbox.split(",");
			this.map._setPosition(this.props.modeComparador ? (this.state.width / 2) : 0);
			//console.log("Abans fitBBOX", this.props.currentIncendi.bbox);
			this.afterMap.fitBBOX(bboxList, pitch);
			this.beforeMap.fitBBOX(bboxList, pitch);

		} else if (prevProps.modeComparador !== this.props.modeComparador) {


			this.map._setPosition(this.props.modeComparador ? (this.state.width / 2) : 0);
			this.afterMap.easeTo({pitch: pitch});
			this.beforeMap.easeTo({pitch: pitch});
		}

	}

	initMapData() {

		const defaultInit = {
			layers: [CONSTANTS.INCENDISCAT_POL_LAYER, CONSTANTS.INCENDISCAT_LINE_LAYER, CONSTANTS.INCENDISCAT_CIRCLE_LAYER],
			sources: [CONSTANTS.INCENDISCAT_SOURCE]
		};
		this.afterMap.addMapData(defaultInit);
		this.beforeMap.addMapData(defaultInit);

		this.updateFilterByYear();

		this.initMapEvents();

	}

	initMapEvents() {

		this.afterMap.subscribe("click", CONSTANTS.LAYER_CIRCLE, (e) => {
			const feature = e.features[0];
			this.setActionOnClick(feature);

		});

		this.afterMap.subscribe("click", CONSTANTS.LAYER_LIN, (e) => {
			const feature = e.features[0];
			this.setActionOnClick(feature);

		});

		this.afterMap.subscribe("mousemove", CONSTANTS.LAYER_POL, (e) => {
			this.afterMap.setCursorPointer("pointer");
			const feature = e.features[0];

			/* this.timestamp = Date.now(); */

			this.setState({
				MUNICIPI_MOV: feature.properties.MUNICIPI,
				DATAINCENT_MOV: feature.properties.DATA_INCEN,
				showPanelPopup: false
			});

		});

		this.afterMap.subscribe("mouseleave", CONSTANTS.LAYER_POL, () => this.afterMap.setCursorPointer(""));

		this.afterMap.subscribe("mousemove", CONSTANTS.LAYER_CIRCLE, (e) => {

			this.afterMap.setCursorPointer("pointer");
			const feature = e.features[0];

			/* this.timestamp = Date.now(); */

			this.setState({
				MUNICIPI_MOV: feature.properties.MUNICIPI,
				DATAINCENT_MOV: feature.properties.DATA_INCEN,
				showPanelPopup: true
			});

		});


		this.afterMap.subscribe("mouseleave", CONSTANTS.LAYER_CIRCLE, (e) => {

			this.afterMap.setCursorPointer("");

			this.setState({
				showPanelPopup: false
			});

		});

		//this.afterMap.subscribe("zoomend", "", this.props.onZoomChange(this.afterMap.getZoom()));

		this.afterMap.subscribe("zoomend", "", (e) =>  {

			console.log("zoomend");
			const zoom = this.afterMap.getZoom();

			if (zoom >= CONSTANTS.LIMIT_ZOOM && this.currentZoom < CONSTANTS.LIMIT_ZOOM && this.isYearToCompare(this.props.anyIncendi)) {

				this.currentZoom = zoom;
				console.log("Show comparador", zoom);
				this.props.onZoomChange(zoom, true);

			} else if (zoom < CONSTANTS.LIMIT_ZOOM && this.currentZoom >= CONSTANTS.LIMIT_ZOOM) {

				this.currentZoom = zoom;
				console.log("hide comparador", zoom);
				this.props.onZoomChange(zoom, false);
			}

		});

	}



	isYearToCompare(year) {
		return (year >= CONSTANTS.ANY_COMPARADOR && year <= CONSTANTS.ANY_COMPARADOR_MAX);
	}

	updateFilterByYear() {

		if (this.props.anyIncendi === CONSTANTS.ANY_FINAL) {

			this.afterMap.setFilter(CONSTANTS.LAYER_POL, ["any", ["!=", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
			this.afterMap.setFilter(CONSTANTS.LAYER_LIN, ["any", ["!=", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
			this.afterMap.setFilter(CONSTANTS.LAYER_CIRCLE, ["any", ["!=", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);

			this.beforeMap.setFilter(CONSTANTS.LAYER_POL, ["any", ["!=", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
			this.beforeMap.setFilter(CONSTANTS.LAYER_LIN, ["any", ["!=", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
			this.beforeMap.setFilter(CONSTANTS.LAYER_CIRCLE, ["any", ["!=", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);

		} else {

			this.afterMap.setFilter(CONSTANTS.LAYER_POL, ["any", ["==", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
			this.afterMap.setFilter(CONSTANTS.LAYER_LIN, ["any", ["==", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
			this.afterMap.setFilter(CONSTANTS.LAYER_CIRCLE, ["any", ["==", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);

			this.beforeMap.setFilter(CONSTANTS.LAYER_POL, ["any", ["==", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
			this.beforeMap.setFilter(CONSTANTS.LAYER_LIN, ["any", ["==", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
			this.beforeMap.setFilter(CONSTANTS.LAYER_CIRCLE, ["any", ["==", CONSTANTS.FILTER_FIELD, this.props.anyIncendi]]);
		}

	}

	setActionOnClick(feature) {

		console.log("setActionOnClick", feature);
		this.closePanel();
		this.props.onSelectIncendi(feature.properties.CODI_FINAL);

	}

	closePanel() {

		this.setState({
			showPanelPopup: false
		});
	}

	resetMap () {


		this.props.onResetMap();

		//const bboxList =  [3.3360, 40.4700, 0.1087, 42.8840];

		/* this.afterMap.setCenter(CONSTANTS.INIT_APP_CENTER);
		this.beforeMap.setCenter(CONSTANTS.INIT_APP_CENTER); */

		const cameraOptions = {
			center: CONSTANTS.INIT_APP_CENTER,
			zoom: CONSTANTS.INIT_APP_ZOOM
		};
		this.afterMap.easeTo(cameraOptions);
		this.beforeMap.easeTo(cameraOptions);

	}

	renderButtonResetComparador() {

		return (
			<div className={styles.containerButtonReset}>
				<Button onClick={this.resetMap.bind(this)} size="small" className={styles.myButtonReset} animated='vertical'>
					<Button.Content visible><Image src="./cat_white.svg"></Image></Button.Content>
					<Button.Content hidden>
						<Icon size="large" name='arrow left' />
					</Button.Content>
				</Button>
			</div>

		);

	}

	getStyleComparador() {
		if (!this.props.modeComparador) return `${styles.map} ${styles.noComparator}`;

		return `${styles.map}`;
	}

	render() {

		const { MUNICIPI, DATAINCENT, MUNICIPI_MOV, DATAINCENT_MOV, ANY, AREAKM, CODIFINAL } = this.state;

		return (
			<div className={styles.containerMap}>

				<div style={{display: this.state.showPanelPopup ? "block" : "none" }} className={styles.panelinfoPopup}>
					<div><h4>{MUNICIPI_MOV}</h4></div>
					<div>{DATAINCENT_MOV}</div>
				</div>

				<div id="beforeMap" ref={el => (this.beforeMapContainer = el)} className={this.getStyleComparador()}/>
				<div id="afterMap" ref={el => (this.afterMapContainer = el)} className={styles.map}/>

				{this.renderButtonResetComparador()}

			</div>
		);
	}

}

MapCompare.propTypes = {
	afterMapLayer: PropTypes.object,
	beforeMapLayer: PropTypes.object,
	currentIncendi: PropTypes.object,
	onZoomChange: PropTypes.func,
	onSelectIncendi: PropTypes.func,
	onResetMap: PropTypes.func,
	modeComparador: PropTypes.bool,
	anyIncendi: PropTypes.number,
	initURLParams: PropTypes.func
};
