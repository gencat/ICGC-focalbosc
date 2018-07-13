// @flow

import React from "react";
import Map from "../../components/Map/Map";
import styles from "./Visor.css";
import { Icon } from "semantic-ui-react";
import { ANY_INIT, ANY_FINAL} from "../../constants";




export default class Visor extends React.Component {



	constructor(props) {
		super(props);

		this.state = {
			year:ANY_FINAL,
			yearFake:ANY_FINAL,
			maxYear:ANY_FINAL + 1,
			minYear:ANY_INIT
				
		};

		this.changeYear = this.changeYear.bind(this);
	  }


	

	  updateYear(year) {
	

		if (year === 2018) {
			this.setState({yearFake: "Tots",
				year: year
			});
		} else {
			this.setState({yearFake: year,
				year: year
			});
		}

	  }

	 
	changeYear(event) {

		this.updateYear(event.target.value);
	}

	changeAddStepYear(e) {

		const currentYear = this.state.year;

		if (parseInt(currentYear) < parseInt(this.state.maxYear)) {

			this.updateYear(parseInt(currentYear) + 1);

		}

	}

	changeSubstractStepYear(e) {

		const currentYear = this.state.year;

		if (parseInt(currentYear) > parseInt(this.state.minYear)) {

			this.updateYear(parseInt(currentYear) - 1);

		}

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
					<Map anyIncendi={this.state.year}/>
				</div>
			</div>
		);
	}

}
