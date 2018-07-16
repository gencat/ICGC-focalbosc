// @flow

import React from "react";
import Map from "../../components/Map/Map";
import MapCompare from "../../components/MapCompare/MapCompare";
import styles from "./Visor.css";
import { Icon } from "semantic-ui-react";
import * as CONSTANTS from "../../constants";


export default class Visor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			year:CONSTANTS.ANY_FINAL,
			yearFake:CONSTANTS.ANY_FINAL,
			currentZoom: CONSTANTS.INIT_APP_ZOOM,
			currentBBOX: [],
			currentCenter: [],
			currentIncendi: {},
			beforeMapLayer: {}, //CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]],
			afterMapLayer: {}, //CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]]
		};

		this.changeYear = this.changeYear.bind(this);
	}


	updateYear(year) {


		if (year > CONSTANTS.ANY_COMPARADOR_MAX) {

			this.setState({
				yearFake: "Tots",
				year: year,
				beforeMapLayer: {},
				afterMapLayer: {}
			});

		} else {
			this.setState({
				yearFake: year,
				year: year,
				beforeMapLayer: (year < CONSTANTS.ANY_COMPARADOR ?  {} : CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[year - 1]]),
				afterMapLayer: (year < CONSTANTS.ANY_COMPARADOR ? {} : CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[year + 1]])
			});
		}

	}


	changeYear(event) {

		this.updateYear(event.target.value);
	}

	changeAddStepYear(e) {

		const currentYear = Number(this.state.year);

		if (currentYear < CONSTANTS.MAX_YEAR) {

			this.updateYear(currentYear + 1);

		}

	}

	changeSubstractStepYear(e) {

		const currentYear = Number(this.state.year);

		if (currentYear < CONSTANTS.MAX_YEAR) {

			this.updateYear(currentYear - 1);

		}

	}

	handleZoomChange(newZoom, currentBBOX, currentCenter) {

		console.log(newZoom);
		console.log(currentCenter);
		this.setState({currentZoom: newZoom, currentBBOX: currentBBOX, currentCenter: currentCenter});

	}

	renderMap() {

		const { currentZoom, year } = this.state;

		if (currentZoom >= CONSTANTS.LIMIT_ZOOM && year >= CONSTANTS.ANY_COMPARADOR && year <= CONSTANTS.ANY_COMPARADOR_MAX) {

			return (
				<MapCompare
					afterMapLayer={this.state.afterMapLayer}
					beforeMapLayer={this.state.beforeMapLayer}
					currentIncendi={this.state.currentIncendi}
					currentBBOX={this.state.currentBBOX}
					currentCenter={this.state.currentCenter}
					onZoomChange={this.handleZoomChange.bind(this)}
				/>
			);

		}

		return (
			<Map anyIncendi={this.state.year} onZoomChange={this.handleZoomChange.bind(this)}/>
		);

	}


	render() {

		return (

			<div>

				<div className={styles.controls} id="controls" >
					<div className={styles.anysControls}>
						<div className={styles.anySelecionat}>{this.state.yearFake}</div>
					</div>
					<div className={styles.anysButtons}>
						<Icon className={styles.anysIcones} size="large" onClick={this.changeAddStepYear.bind(this)} name="chevron circle up" />
						<br />
						<Icon  className={styles.anysIcones} size="large" onClick={this.changeSubstractStepYear.bind(this)} name="chevron circle down" />
					</div>
				</div>

				<div className={styles.containerMap}>
					{this.renderMap()}
				</div>

			</div>
		);

	}

}
