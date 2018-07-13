//@flow

import React, { Component } from "react";
import { MAPBOX_ACCESS_TOKEN } from "../../constants";
import { STYLE_URL, PBF_INCENDIS, VECTOR_LAYER_POL, VECTOR_LAYER_POINT, URL_COMPARADOR, TEMATIC_FIELD} from "../../constants";
import PropTypes from "prop-types";
import MapboxMap from "../../common/mapboxMap";
import styles from "./Map.css";
import { Icon } from "semantic-ui-react";



const sourceMain = "incendis-cat";
const layerPol = "indencis_pol";
const layerLin = "indencis_lin";
const layerCircle = "indencis_circle";

export default class Map extends Component {

	map;

	state = {

		styleUrl:STYLE_URL,
		pbfIncendis:PBF_INCENDIS,
		lng:2.949501,
		lat:42.023761,
		zoom:15.85,
		index: null,
		mainColor: this.props.mainColor,
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

	/*

ANY
AREA
CODI_FINAL
DATA_INCEN
MUNICIPI
XMAX
XMIN
YMAX
YMIN


	*/


	componentDidMount() {


		this.map = new MapboxMap(MAPBOX_ACCESS_TOKEN, {
			"style": STYLE_URL,
			"zoom":7.85,
			"center":[1.434, 41.491],
			"container": this.mapContainer,
			"pitch": 0,
			"hash": true,
			"maxZoom": 18.90,
			"attributionControl": false
		});
		this.mapData = {};

		this.map.create().then(() => {
			if (this.mapData !== null) {

				this.setData(this.mapData);
				this.map.addControlMap("attribution");

			}
		});


	}



	componentWillUnmount() {
		this.map.remove();
	}



	componentDidUpdate() {
	this.addFilterByYear();
	
	

	}





	render() {

		const { MUNICIPI, DATAINCENT, MUNICIPI_MOV, DATAINCENT_MOV, ANY, AREA, AREAKM, CODIFINAL, XMAX, XMIN, YMAX, YMIN} = this.state;

		return (
			<div style={{color: this.props.mainColor }}>
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
					<div style={{color: this.props.mainColor }} className={styles.panelinfobody}>
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




	generateThematicStyle() {

		const paintStyle = ["match", ["get", TEMATIC_FIELD]];


		this.props.arrayAnys.forEach((_break, i) => {

			paintStyle.push(_break, this.props.arrayColors[i]);

		});
		paintStyle.push("rgba(0,0,0,0)");

		return paintStyle;


	}



	setData(data) {


		if (this.map.isLoaded) {

			this.map.setData({
				layers: [{
					"id": layerPol,
					"source": sourceMain,
					"source-layer": VECTOR_LAYER_POL,
					"interactive": true,
					"type": "fill",
					"maxzoom": 18,
					"minzoom": 10.5,
					"layout": {
						"visibility": "visible"
					},
					"paint": {
						"fill-opacity": .5,
						"fill-color": this.generateThematicStyle(),
					}
				},
				{
					"id": layerLin,
					"source": sourceMain,
					"source-layer": VECTOR_LAYER_POL,
					"interactive": true,
					"type": "line",
					"maxzoom": 11,
					"minzoom": 9.5,
					"layout": {
						"visibility": "visible"
					},
					"paint": {
						"line-opacity": .8,
						"line-color": this.generateThematicStyle(),
					}
				},
				{
					"id": layerCircle,
					"source": sourceMain,
					"source-layer": VECTOR_LAYER_POINT,
					"interactive": true,
					"type": "circle",
					"maxzoom": 10.4,
					"minzoom": 6,
					"layout": {
						"visibility": "visible"
					},
					"paint": {
						"circle-color": this.generateThematicStyle(),
						"circle-opacity": 0.8,
						"circle-stroke-color": "#9E3333",
						"circle-stroke-width":2,
						"circle-stroke-opacity": 0.5,
						"circle-radius": ["interpolate", ["exponential", 1],
							["number", ["get", "AREA"]],
							100, 3,
							20000, 4,
							4150588.97, 9,
							32525993.45, 15,
							65174371.37, 20,
							104980900.53, 28,
							163017313.02, 35

						]

					}
				}
				],
				sources: [{
					name: sourceMain,
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
				}]
			});

			this.addFilterByYear();

			this.map.subscribe("click", layerCircle, (e) => {

				const feature = e.features[0];
				this.setActionOnClick(feature);

			});

			this.map.subscribe("click", layerPol, (e) => {

				const feature = e.features[0];
				this.setActionOnClick(feature);

			});

			this.map.subscribe("mousemove", layerPol, (e) => {
				this.map.setCursorPointer("pointer");
				const feature = e.features[0];

				this.setState({
					MUNICIPI_MOV: feature.properties.MUNICIPI,
					DATAINCENT_MOV: feature.properties.DATA_INCEN,
					showPanelPopup: false
				  });

			});


			this.map.subscribe("zoomend", layerPol, (e) => {

				this.map.getZoom() > 12 ? this.map.easeTo({
					"pitch": 45
				}) : this.map.easeTo({
					"pitch": 0
				});

			});


			this.map.subscribe("mouseleave", layerPol, (e) => {
				this.map.setCursorPointer("");



			});

			this.map.subscribe("mousemove", layerCircle, (e) => {
				this.map.setCursorPointer("pointer");
				const feature = e.features[0];
				
				this.setState({
					MUNICIPI_MOV: feature.properties.MUNICIPI,
					DATAINCENT_MOV: feature.properties.DATA_INCEN,
					showPanelPopup: true
				  });

			});


			this.map.subscribe("mouseleave", layerCircle, (e) => {
				this.map.setCursorPointer("");

				this.setState({
					showPanelPopup: false
				  });

			});



		} else {

			this.mapData = data;

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

		const AREAKM = (parseFloat(feature.properties.AREA) / 10000);
		let showLinkYear = false;

		if (parseInt(feature.properties.ANY) > 2003) {
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
			this.map.setFilter(layerPol, ["any", ["!=", TEMATIC_FIELD, parseInt(this.props.anyIncendi)]]);
			this.map.setFilter(layerLin, ["any", ["!=", TEMATIC_FIELD, parseInt(this.props.anyIncendi)]]);
			this.map.setFilter(layerCircle, ["any", ["!=", TEMATIC_FIELD, parseInt(this.props.anyIncendi)]]);
		} else {

			this.map.setFilter(layerPol, ["any", ["==", TEMATIC_FIELD, parseInt(this.props.anyIncendi)]]);
			this.map.setFilter(layerLin, ["any", ["==", TEMATIC_FIELD, parseInt(this.props.anyIncendi)]]);
			this.map.setFilter(layerCircle, ["any", ["==", TEMATIC_FIELD, parseInt(this.props.anyIncendi)]]);
		}
	}
	}





}


Map.propTypes = {
	anyIncendi: PropTypes.number,
	mainColor: PropTypes.string,
	currentColor: PropTypes.string,
	arrayColors: PropTypes.array,
	arrayAnys: PropTypes.array

};
