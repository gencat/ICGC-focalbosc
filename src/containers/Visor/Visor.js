// @flow

import React from "react";
import Map from "../../components/Map/Map";
import styles from "./Visor.css";
import { Icon } from "semantic-ui-react";
import { ANY_INIT, ANY_FINAL, ANY_COMPARADOR, COLOR_INIT, COLOR_FINAL} from "../../constants";
import {Colorizator} from "../../mapstylergl/mapstylergl";



export default class Visor extends React.Component {



	constructor(props) {
		super(props);

		this.state = {
			year:ANY_FINAL,
			yearFake:ANY_FINAL,
			maxYear:ANY_FINAL + 1,
			minYear:ANY_INIT,
			initColor:COLOR_INIT,
			endColor:COLOR_FINAL,
			mainColor:"#EE0508",
			currentColor:COLOR_FINAL,
			arrayColors:[],
			arrayAnys:[]
		};

		this.changeYear = this.changeYear.bind(this);
		this.currentYear = this.state.year;
	  }


	  componentDidMount() {
		console.info("mount");
		const colorizator = new Colorizator();

		const arrayAnys = [];

		for (let i  = ANY_INIT; i < ANY_FINAL + 1; i++) {

			arrayAnys.push(i);

		}

		   const arrayColors = colorizator.getColorsScaleRanges(arrayAnys.length, COLOR_INIT, COLOR_FINAL);
		this.setState({arrayAnys: arrayAnys});
		this.setState({arrayColors: arrayColors});


	  }

	  updateYear(year) {
	

		if (typeof (year) === "number") {
		//	year = String(year);
		}
		const currentColor = this.setColorFromYear(year);

		this.currentYear = year;

		if (year === 2018) {
			this.setState({yearFake: "Tots",
				year: year,
				currentColor: currentColor
			});
		} else {
			this.setState({yearFake: year,
				year: year,
				currentColor: currentColor
			});
		}

	  }

	  setColorFromYear(year) {

		const index = parseInt(year) - ANY_INIT;
		
		const color = this.state.arrayColors[index] || COLOR_FINAL;

		return color;






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

						<div style={{color: this.state.currentColor}} className={styles.anySelecionat}>{this.state.yearFake}</div>
					</div>
					<div className={styles.anysButtons}>
						<Icon style={{color: this.state.endColor}} className={styles.anysIcones} size="large" onClick={this.changeAddStepYear.bind(this)} name="chevron circle up" />
						<br />
						<Icon style={{color: this.state.initColor}} className={styles.anysIcones} size="large" onClick={this.changeSubstractStepYear.bind(this)} name="chevron circle down" />
					</div>

				</div>
				<div className={styles.containerMap}>
					<Map anyIncendi={this.state.year}
					 mainColor={this.state.mainColor}
					currentColor={this.state.currentColor}
					arrayColors={this.state.arrayColors}
					arrayAnys={this.state.arrayAnys}
					
					/>
				</div>
			</div>
		);
	}

}
