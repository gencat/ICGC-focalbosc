//@flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import MapboxMap from "../../common/mapboxMap";
import * as CONSTANTS from "../../constants";
import Compare  from "mapbox-gl-compare";

import styles from "./MapCompare.css";

export default class MapCompare extends Component {

	map;
	beforeMap;
	afterMap;

	async componentDidMount() {

		console.log("componentDidMount");

		this.beforeMap = new MapboxMap(CONSTANTS.MAPBOX_ACCESS_TOKEN, {
			style: CONSTANTS.MAPSTYLE_HISTORIC,
			center: [this.props.currentCenter.lng, this.props.currentCenter.lat],
			zoom: 12,
			container: this.beforeMapContainer
		});


		this.afterMap = new MapboxMap(CONSTANTS.MAPBOX_ACCESS_TOKEN, {
			"style": CONSTANTS.MAPSTYLE_HISTORIC,
			center: [this.props.currentCenter.lng, this.props.currentCenter.lat],
			zoom: 12,
			container: this.afterMapContainer
		});

		await this.afterMap.create();
		await this.beforeMap.create();

		this.beforeMap.easeTo({pitch: 45});
		this.afterMap.easeTo({pitch: 45});

		/* this.afterMap.fitBounds(this.props.currentBBOX);
		this.beforeMap.fitBounds(this.props.currentBBOX); */

		this.afterMap.addMapData({sources: [CONSTANTS.INCENDISCAT_SOURCE], layers:[CONSTANTS.INCENDISCAT_LINE_LAYER]});
		this.beforeMap.addMapData({sources: [CONSTANTS.INCENDISCAT_SOURCE], layers:[CONSTANTS.INCENDISCAT_LINE_LAYER]});

		

		this.map = new Compare(this.beforeMap.getMap(), this.afterMap.getMap(), {
			// Set this to enable comparing two maps by mouse movement:
			// mousemove: true
		});

		this.map._setPosition(0);




		this.initMapEvents();

		/* console.log("ComponentDidMount MapComponent", this.props.currentIncendi);
		const bboxList = this.props.currentIncendi.bbox.split(",");
		console.log(this.props.currentIncendi.bbox);
		this.afterMap.fitBBOX(bboxList);
		this.beforeMap.fitBBOX(bboxList); */

	}

	initMapEvents() {

		this.beforeMap.subscribe("zoomend", "", (e) => {

			console.log("subscribe zoomend");
			this.props.onZoomChange(this.beforeMap.getZoom(), this.beforeMap.getBounds(), this.beforeMap.getCenter());

		});

	}


	render() {

		return (
			<div className={styles.containerMap}>

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
	currentBBOX: PropTypes.object,
	currentCenter: PropTypes.object
};
