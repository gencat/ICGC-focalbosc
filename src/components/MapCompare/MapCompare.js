//@flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import MapboxMap from "../../common/mapboxMap";
import * as CONSTANTS from "../../constants";

import Compare  from "mapbox-gl-compare";
import { Icon } from "semantic-ui-react";

import styles from "./MapCompare.css";

export default class MapCompare extends Component {

	map;
	beforeMap;
	afterMap;
	//currentZoom;

	state = {

		showPanel: false,
		showPanelPopup: false,
		showLinkYear:false,
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

	async componentDidMount() {

		console.log("componentDidMount");

		this.currentZoom = CONSTANTS.INIT_APP_ZOOM;

		this.beforeMap = new MapboxMap(CONSTANTS.MAPBOX_ACCESS_TOKEN, {
			style: CONSTANTS.MAPSTYLE_HISTORIC,
			zoom: CONSTANTS.INIT_APP_ZOOM,
			center: [1.434, 41.491],
			container: this.beforeMapContainer
		});


		this.afterMap = new MapboxMap(CONSTANTS.MAPBOX_ACCESS_TOKEN, {
			style: CONSTANTS.MAPSTYLE_HISTORIC,
			zoom: CONSTANTS.INIT_APP_ZOOM,
			center: [1.434, 41.491],
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

	}

	componentDidUpdate(prevProps) {

		if (prevProps.anyIncendi !== this.props.anyIncendi) {
			this.updateFilterByYear();
		}

		if (prevProps.beforeMapLayer.value !== this.props.beforeMapLayer.value) {
			this.beforeMap.setLayoutProperty(prevProps.beforeMapLayer.key, "visibility", "none");
			this.beforeMap.setLayoutProperty(this.props.beforeMapLayer.key, "visibility", "visible");
		}

		if (prevProps.afterMapLayer.value !== this.props.afterMapLayer.value) {
			this.afterMap.setLayoutProperty(prevProps.afterMapLayer.key, "visibility", "none");
			this.afterMap.setLayoutProperty(this.props.afterMapLayer.key, "visibility", "visible");
		}

		if (prevProps.modeComparador !== this.props.modeComparador) {

			this.map._setPosition(this.props.modeComparador ? 500 : 0);
			const pitch = this.props.modeComparador ? 45 : 0;
			this.afterMap.easeTo({pitch: pitch});
			this.beforeMap.easeTo({pitch: pitch});
		}

		if (this.props.currentIncendi !== {} && (prevProps.currentIncendi.value === {} ||  prevProps.currentIncendi.value !== this.props.currentIncendi.value)) {

			const bboxList = this.props.currentIncendi.bbox.split(",");
			console.log(this.props.currentIncendi.bbox);
			this.afterMap.fitBBOX(bboxList);
			this.beforeMap.fitBBOX(bboxList);
			/* const pitch = this.props.modeComparador ? 45 : 0;
			this.afterMap.easeTo({pitch: pitch});
			this.beforeMap.easeTo({pitch: pitch}); */

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

		if (this.isYearToCompare(feature.properties.ANY)) {

			this.props.onSelectIncendi(feature.properties.CODI_FINAL);

		} else {

			const bbox = [
				[parseFloat(feature.properties.XMIN), parseFloat(feature.properties.YMIN)],
				[parseFloat(feature.properties.XMAX), parseFloat(feature.properties.YMAX)]
			];

			this.afterMap.fitBounds(bbox);
			this.beforeMap.fitBounds(bbox);

		}

		/* const bbox = [
			[parseFloat(feature.properties.XMIN), parseFloat(feature.properties.YMIN)],
			[parseFloat(feature.properties.XMAX), parseFloat(feature.properties.YMAX)]
		];

		this.afterMap.fitBounds(bbox);
		this.beforeMap.fitBounds(bbox); */

		const AREAKM = (parseFloat(feature.properties.AREA) / 1000000);
		let showLinkYear = false;

		if (parseInt(feature.properties.ANY) >= CONSTANTS.ANY_COMPARADOR) {
			showLinkYear = true;

		}

		this.setState({
			MUNICIPI: feature.properties.MUNICIPI,
			DATAINCENT: feature.properties.DATA_INCEN,
			ANY: feature.properties.ANY,
			AREA: feature.properties.AREA,
			AREAKM: AREAKM.toFixed(2),
			CODIFINAL: feature.properties.CODI_FINAL,
			XMAX: feature.properties.XMAX,
			XMIN: feature.properties.XMIN,
			YMAX: feature.properties.YMAX,
			YMIN: feature.properties.YMIN,
			showPanelPopup: false,
			showLinkYear: showLinkYear,
			showPanel: true,
		});

	}

	closePanel() {

		this.setState({
			showPanelPopup: false,
			showPanel: false
		});
	}


	render() {

		const { MUNICIPI, DATAINCENT, MUNICIPI_MOV, DATAINCENT_MOV, ANY, AREAKM, CODIFINAL } = this.state;

		return (
			<div className={styles.containerMap}>

				<div style={{display: this.state.showPanelPopup ? "block" : "none" }} className={styles.panelinfoPopup}>
					<div><h4>{MUNICIPI_MOV}</h4></div>
					<div>{DATAINCENT_MOV}</div>
				</div>

				<div style={{display: this.state.showPanel ? "block" : "none" }} className={styles.panelinfo}>
					<div className={styles.panelinfoheader}>
						<div className={styles.panelinfoheaderdetail}>
							<Icon className={styles.panelinfoheaderclose} size="large" onClick={this.closePanel.bind(this)} name="window close" />
							<div  className={styles.panelinfoheadertext}>
								<h3>{MUNICIPI}</h3>
							</div>
						</div>
					</div>
					<div  className={styles.panelinfobody}>
						<div className={styles.panelinfobody}>{`Any: ${ANY}`}</div>
						<div className={styles.panelinfobody}>{`Data: ${DATAINCENT}`}</div>
						<div className={styles.panelinfobody}>{`Àrea: ${AREAKM} km2`}</div>
						<div  style={{display: this.state.showLinkYear ? "block" : "none" }} className={styles.panelinfolink}>
							<a className={styles.infolink} target="blank" href={`${CONSTANTS.URL_COMPARADOR}${CODIFINAL}`}>
						Veure l'àrea abans i després de l'incendi <Icon size="large" name="external square" /></a>
						</div>
					</div>
				</div>

				<div id="beforeMap" ref={el => (this.beforeMapContainer = el)} className={styles.map}/>

				<div id="afterMap" ref={el => (this.afterMapContainer = el)} className={styles.map}/>

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
	modeComparador: PropTypes.bool,
	anyIncendi: PropTypes.number
};
