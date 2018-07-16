//@flow

import React, { Component } from "react";
import { MAPBOX_ACCESS_TOKEN } from "../../constants";
import { 
	MAPSTYLE_HISTORIC,
	URL_COMPARADOR,
	FILTER_FIELD,
	ANY_COMPARADOR,
	INCENDISCAT_POL_LAYER,
	INCENDISCAT_CIRCLE_LAYER,
	INCENDISCAT_LINE_LAYER,
	LAYER_CIRCLE, LAYER_LIN, LAYER_POL,
	INCENDISCAT_SOURCE

} from "../../constants";
import PropTypes from "prop-types";
import MapboxMap from "../../common/mapboxMap";
import styles from "./Map.css";
import { Icon } from "semantic-ui-react";


export default class Map extends Component {

	map;

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


		this.map = new MapboxMap(MAPBOX_ACCESS_TOKEN, {
			"style": MAPSTYLE_HISTORIC,
			"zoom":7.85,
			"center":[1.434, 41.491],
			"container": this.mapContainer,
			"pitch": 0,
			"hash": true,
			"maxZoom": 18.90,
			"attributionControl": false
		});

		await this.map.create();

		this.setData();
		this.map.addControlMap("attribution");

	}


	componentWillUnmount() {
		this.map.remove();
	}


	componentDidUpdate() {
		this.addFilterByYear();

	}

	initMapEvents() {

		this.map.subscribe("click", LAYER_CIRCLE, (e) => {
			const feature = e.features[0];
			this.setActionOnClick(feature);

		});

		this.map.subscribe("click", LAYER_LIN, (e) => {
			const feature = e.features[0];
			this.setActionOnClick(feature);

		});


		this.map.subscribe("mousemove", LAYER_POL, (e) => {
			this.map.setCursorPointer("pointer");
			const feature = e.features[0];

			this.setState({
				MUNICIPI_MOV: feature.properties.MUNICIPI,
				DATAINCENT_MOV: feature.properties.DATA_INCEN,
				showPanelPopup: false
			});

		});

		this.map.subscribe("zoomend", LAYER_POL, (e) => {

			const easeTo = this.map.getZoom() > 12 ? 45 : 0;

			this.map.easeTo({
				"pitch": easeTo
			});

		});


		this.map.subscribe("mouseleave", LAYER_POL, (e) => {
			this.map.setCursorPointer("");
		});

		this.map.subscribe("mousemove", LAYER_CIRCLE, (e) => {
			this.map.setCursorPointer("pointer");
			const feature = e.features[0];

			this.setState({
				MUNICIPI_MOV: feature.properties.MUNICIPI,
				DATAINCENT_MOV: feature.properties.DATA_INCEN,
				showPanelPopup: true
			});

		});


		this.map.subscribe("mouseleave", LAYER_CIRCLE, (e) => {
			this.map.setCursorPointer("");

			this.setState({
				showPanelPopup: false
			});

		});
	}

	setData() {

		if (this.map.isLoaded) {

			this.map.setData({
				layers: [INCENDISCAT_POL_LAYER, INCENDISCAT_LINE_LAYER, INCENDISCAT_CIRCLE_LAYER],
				sources: [INCENDISCAT_SOURCE]
			});

			this.addFilterByYear();

			this.initMapEvents();

		} else {

			this.mapData = {};

		}

	}


	closePanel() {

		this.setState({
			showPanelPopup: false,
			showPanel: false
		});
	}

	setActionOnClick(feature) {

		const bbox = [[parseFloat(feature.properties.XMIN),
			parseFloat(feature.properties.YMIN)],
		[parseFloat(feature.properties.XMAX),
			parseFloat(feature.properties.YMAX)]];

		this.map.fitBounds(bbox);

		const AREAKM = (parseFloat(feature.properties.AREA) / 1000000);
		let showLinkYear = false;

		if (parseInt(feature.properties.ANY) >= ANY_COMPARADOR) {
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

	addFilterByYear() {


		if (this.map.isLoaded) {

			if (parseInt(this.props.anyIncendi) === 2018) {
				this.map.setFilter(LAYER_POL, ["any", ["!=", FILTER_FIELD, parseInt(this.props.anyIncendi)]]);
				this.map.setFilter(LAYER_LIN, ["any", ["!=", FILTER_FIELD, parseInt(this.props.anyIncendi)]]);
				this.map.setFilter(LAYER_CIRCLE, ["any", ["!=", FILTER_FIELD, parseInt(this.props.anyIncendi)]]);
			} else {

				this.map.setFilter(LAYER_POL, ["any", ["==", FILTER_FIELD, parseInt(this.props.anyIncendi)]]);
				this.map.setFilter(LAYER_LIN, ["any", ["==", FILTER_FIELD, parseInt(this.props.anyIncendi)]]);
				this.map.setFilter(LAYER_CIRCLE, ["any", ["==", FILTER_FIELD, parseInt(this.props.anyIncendi)]]);
			}
		}
	}

	render() {

		const { MUNICIPI, DATAINCENT, MUNICIPI_MOV, DATAINCENT_MOV, ANY, AREAKM, CODIFINAL } = this.state;

		return (
			<div >
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
							<a className={styles.infolink} target="blank" href={`${URL_COMPARADOR}${CODIFINAL}`}>
						Veure l'àrea abans i després de l'incendi <Icon size="large" name="external square" /></a>
						</div>
					</div>
				</div>
				<div className={styles.map} ref={el => this.mapContainer = el} />
			</div>
		);

	}

}


Map.propTypes = {
	anyIncendi: PropTypes.number,
	onZoomChange: PropTypes.func
};
