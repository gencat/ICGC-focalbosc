//@flow

import React from "react";
import PropTypes from "prop-types";
import { ResizeComponent } from "@geostarters/react-components";
import { Utils, MapboxMap } from "@geostarters/common";
import Compare from "mapbox-gl-compare";
import mapboxgl from "mapbox-gl";
import { Icon, Button, Image } from "semantic-ui-react";
import { isMobile } from "react-device-detect";

import * as CONSTANTS from "../../constants";
import IMAGES from "../../resources/images";
import styles from "./MapCompare.module.css";

class MapCompare extends React.PureComponent {

	map;
	beforeMap;
	afterMap;
	timestamp;
	doReset;
	currentZoom;

	constructor(props) {

		super(props);
		this.state = {
			showPanelPopup: false,
			MUNICIPI_MOV:"",
			DATAINCENT_MOV:""
		};

		this.beforeMapContainer = React.createRef();
		this.afterMapContainer = React.createRef();

	}

	async componentDidMount() {

		this.doReset = 0;
		this.currentZoom = CONSTANTS.INIT_APP_ZOOM;
		const API_KEY = `${process.env.REACT_APP_MAPBOX_API_KEY}`;

		this.beforeMap = new MapboxMap(mapboxgl, API_KEY, {
			style: CONSTANTS.MAPSTYLE_HISTORIC,
			zoom: CONSTANTS.INIT_APP_ZOOM,
			center: CONSTANTS.INIT_APP_CENTER,
			maxZoom: CONSTANTS.MAX_ZOOM,
			hash:true,
			attributionControl:false,
			container: this.beforeMapContainer.current
		});

		this.afterMap = new MapboxMap(mapboxgl, API_KEY, {
			style: CONSTANTS.MAPSTYLE_HISTORIC,
			zoom: CONSTANTS.INIT_APP_ZOOM,
			center: CONSTANTS.INIT_APP_CENTER,
			maxZoom: CONSTANTS.MAX_ZOOM,
			hash:true,
			attributionControl:false,
			container: this.afterMapContainer.current
		});

		await this.afterMap.create();
		await this.beforeMap.create();

		this.initMapData();

		this.map = new Compare(this.beforeMap.getMap(), this.afterMap.getMap(), {
			// Set this to enable comparing two maps by mouse movement:
			// mousemove: true
		});

		this.map._setPosition(0);

		if (isMobile) {

			this.initMapEventsMobile();

		} else {

			this.initMapEvents();

		}

		this.props.initURLParams();

	}

	componentDidUpdate(prevProps) {

		//if (prevProps.beforeMapLayer.value !== this.props.beforeMapLayer.value) {
		if (prevProps.anyIncendi !== this.props.anyIncendi) {

			this.updateFilterByYear();

		}

		
		if(prevProps.beforeMapLayer && this.props.beforeMapLayer){
			
			if (prevProps.beforeMapLayer.value !== this.props.beforeMapLayer.value) {

				try{
					this.beforeMap.removeLayer(prevProps.beforeMapLayer.key);
					if(this.props.beforeMapLayer.text == CONSTANTS.ANY_ESPECIAL){
						this.beforeMap.addLayer({"id": this.props.beforeMapLayer.key, "type": "raster", "source": this.props.beforeMapLayer.key, "paint": {"raster-saturation": 0.4}}, CONSTANTS.CUT_LAYER);
					}else{
						this.beforeMap.addLayer({"id": this.props.beforeMapLayer.key, "type": "raster", "source": this.props.beforeMapLayer.key}, CONSTANTS.CUT_LAYER);
					}
				}catch(error){
					console.log("Error", error);
					console.log("Error", this.props.beforeMapLayer);
				}
			}

		}
		
		if(prevProps.afterMapLayer && this.props.afterMapLayer){
			
			if ((prevProps.afterMapLayer.value !== this.props.afterMapLayer.value) || (this.props.afterMapLayer.text == CONSTANTS.ANY_ESPECIAL)) {
	
				try{
					this.afterMap.removeLayer(prevProps.afterMapLayer.key);
					if(this.props.afterMapLayer.text == CONSTANTS.ANY_ESPECIAL){
						this.afterMap.addLayer({"id": this.props.afterMapLayer.key, "type": "raster", "source": this.props.afterMapLayer.key, "paint": {"raster-saturation": 0.4}}, CONSTANTS.CUT_LAYER);
					}else{
						this.afterMap.addLayer({"id": this.props.afterMapLayer.key, "type": "raster", "source": this.props.afterMapLayer.key}, CONSTANTS.CUT_LAYER);
					}
				}catch(error){
					console.log("Error", error);
					console.log("Error", this.props.afterMapLayer);
				}
			}

		}
		
		const pitch = this.props.modeComparador ? 45 : 0;


		if (!Utils.isEmptyObject(this.props.currentIncendi) && (prevProps.currentIncendi.value === {} ||  prevProps.currentIncendi.value !== this.props.currentIncendi.value)) {

			const bboxList = this.props.currentIncendi.bbox.split(",");
			this.map._setPosition(this.props.modeComparador ? (this.props.width / 2) : 0);
			this.afterMap.fitBBOX(bboxList, pitch);
			this.beforeMap.fitBBOX(bboxList, pitch);

		} else if (prevProps.modeComparador !== this.props.modeComparador) {

			this.map._setPosition(this.props.modeComparador ? (this.props.width / 2) : 0);
			this.afterMap.easeTo({pitch: pitch});
			this.beforeMap.easeTo({pitch: pitch});

		}

	}

	async initMapData() {

		const defaultInit = {
			layers: [CONSTANTS.INCENDISCAT_POL_LAYER, CONSTANTS.INCENDISCAT_LINE_LAYER, CONSTANTS.INCENDISCAT_CIRCLE_LAYER],
			sources: [CONSTANTS.INCENDISCAT_SOURCE]
		};

		await this.afterMap.addMapData(defaultInit);
		await this.beforeMap.addMapData(defaultInit);

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


		this.afterMap.subscribe("mouseleave", CONSTANTS.LAYER_CIRCLE, () => {

			this.afterMap.setCursorPointer("");

			this.setState({
				showPanelPopup: false
			});

		});

		this.initZoomEvents();

	}

	initMapEventsMobile() {

		this.afterMap.subscribe("click", CONSTANTS.LAYER_CIRCLE, (e) =>  this.setActionOnClick(e.features[0]));
		this.afterMap.subscribe("mousemove", CONSTANTS.LAYER_CIRCLE, (e) =>  this.setActionOnClick(e.features[0]));
		this.afterMap.subscribe("touchend", CONSTANTS.LAYER_CIRCLE, (e) =>  this.setActionOnClick(e.features[0]));

		this.afterMap.subscribe("click", CONSTANTS.LAYER_LIN, (e) =>  this.setActionOnClick(e.features[0]));
		this.afterMap.subscribe("mousemove", CONSTANTS.LAYER_LIN, (e) =>  this.setActionOnClick(e.features[0]));
		this.afterMap.subscribe("touchend", CONSTANTS.LAYER_LIN, (e) =>  this.setActionOnClick(e.features[0]));

		this.initZoomEvents();

	}

	initZoomEvents() {

		this.afterMap.subscribe("zoomend", "", () =>  {

			const zoom = this.afterMap.getZoom();

			if (zoom >= CONSTANTS.LIMIT_ZOOM && this.currentZoom < CONSTANTS.LIMIT_ZOOM && this.isYearToCompare(this.props.anyIncendi)) {

				this.currentZoom = zoom;
				this.props.onZoomChange(zoom, true);

			} else if (zoom < CONSTANTS.LIMIT_ZOOM && this.currentZoom >= CONSTANTS.LIMIT_ZOOM) {

				this.currentZoom = zoom;
				this.props.onZoomChange(zoom, false);

			}

		});

	}

	isYearToCompare = (year) => ((year >= CONSTANTS.ANY_COMPARADOR && year <= CONSTANTS.ANY_COMPARADOR_MAX) || year === CONSTANTS.ANY_ESPECIAL);

	updateFilterByYear() {

		if (this.props.anyIncendi === CONSTANTS.MAX_YEAR) {
			
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

		this.closePanel();
		this.props.onSelectIncendi(feature.properties.CODI_FINAL);

	}

	closePanel = () => this.setState({ showPanelPopup: false });

	resetMap = () => {

		this.props.onResetMap();

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
				<Button onClick={this.resetMap} size="small" className={styles.myButtonReset} animated='vertical'>
					<Button.Content visible><Image src={IMAGES.cat_white}></Image></Button.Content>
					<Button.Content hidden>
						<Icon size="large" name='arrow left' />
					</Button.Content>
				</Button>
			</div>

		);

	}

	getStyleComparador() {

		if (!this.props.modeComparador) {

			return `${styles.map} ${styles.noComparator}`;

		}

		return `${styles.map}`;

	}

	render() {

		const { MUNICIPI_MOV, DATAINCENT_MOV } = this.state;

		return (
			<div className={styles.containerMap}>

				<div style={{display: this.state.showPanelPopup ? "block" : "none" }} className={styles.panelinfoPopup}>
					<div><h4>{MUNICIPI_MOV}</h4></div>
					<div>{DATAINCENT_MOV}</div>
				</div>

				<div id="beforeMap" ref={this.beforeMapContainer} className={this.getStyleComparador()}/>
				<div id="afterMap" ref={this.afterMapContainer} className={styles.map}/>

				{this.renderButtonResetComparador()}

			</div>
		);

	}

}

// eslint-disable-next-line new-cap
export default ResizeComponent(MapCompare);


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
