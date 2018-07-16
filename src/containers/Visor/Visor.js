// @flow

import React from "react";
import Map from "../../components/Map/Map";
import styles from "./Visor.css";
import { Icon } from "semantic-ui-react";
import { ANY_INIT, ANY_FINAL, MAX_YEAR} from "../../constants";


export default class Visor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			year:ANY_FINAL,
			yearFake:ANY_FINAL,
			currentZoom: 
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

	renderMap() {

		return (
			<Map anyIncendi={this.state.year}/>
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
