// @flow

import React from "react";
import Map from "../../components/Map/Map";
import styles from "./Visor.css";
import { Icon } from "semantic-ui-react";
import { ANY_FINAL, MAX_YEAR, MAX_INIT_ZOOM} from "../../constants";


export default class Visor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			year:ANY_FINAL,
			yearFake:ANY_FINAL,
			currentZoom: MAX_INIT_ZOOM
		};

		this.changeYear = this.changeYear.bind(this);
	}


	updateYear(year) {

		if (year === 2018) {
			this.setState({
				yearFake: "Tots",
				year: year
			});
		} else {
			this.setState({
				yearFake: year,
				year: year
			});
		}

	}


	changeYear(event) {

		this.updateYear(event.target.value);
	}

	changeAddStepYear(e) {

		const currentYear = Number(this.state.year);

		if (currentYear < MAX_YEAR) {

			this.updateYear(currentYear + 1);

		}

	}

	changeSubstractStepYear(e) {

		const currentYear = Number(this.state.year);

		if (currentYear < MAX_YEAR) {

			this.updateYear(currentYear - 1);

		}

	}

	handleZoomChange(newZoom) {

		console.log(newZoom);

	}

	renderMap() {

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
