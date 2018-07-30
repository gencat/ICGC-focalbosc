// @flow

import React from "react";
import MapCompare from "../../components/MapCompare/MapCompare";
import * as CONSTANTS from "../../constants";

import ReactQueryParams from "react-query-params";
import { Icon, Grid, Dropdown, Button, Image } from "semantic-ui-react";

import styles from "./Visor.css";


//export default class Visor extends React.Component {
export default class PanelContainer extends ReactQueryParams {

	constructor(props) {

		super(props);

		const codifinal = this.queryParams.codifinal;

		/* if (codifinal !== undefined) {


			console.log(codifinal);

			const incendiVal = this.getIncendiByCodi(codifinal);

			const beforeAny = Number(CONSTANTS.incendisList[incendiVal].any) - 1;
			const afterAny = Number(CONSTANTS.incendisList[incendiVal].any) + 1;

			this.state = {

				year: CONSTANTS.incendisList[incendiVal].any,

				currentBBOX: [],
				currentCenter: [],

				currentIncendi: CONSTANTS.incendisList[incendiVal],
				beforeMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[beforeAny]],
				afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[afterAny]],

				modeComparador: this.isYearToCompare(CONSTANTS.incendisList[incendiVal].any)
			};

		} else { */

			this.state = {

				year: CONSTANTS.MAX_YEAR,

				currentBBOX: [],
				currentCenter: [],

				currentIncendi: {},
				beforeMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]],
				afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]],

				modeComparador: false
			};

		//}

		this.changeYear = this.changeYear.bind(this);

	}

	componentDidUpdate(prevProps, prevState) {

		console.log("visor component didupdate");

	}

	resetComparador() {

		this.setState({

			year:CONSTANTS.MAX_YEAR,

			currentBBOX: [],
			currentCenter: [],

			currentIncendi: {},
			beforeMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]],
			afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]],

			modeComparador: false
		});

	}


	updateYear(year) {


		if (year > CONSTANTS.ANY_COMPARADOR_MAX || year < CONSTANTS.ANY_COMPARADOR) {

			this.setState({
				year: year,
				modeComparador: false,
				beforeMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]],
				afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]]
				/* beforeMapLayer: {},
				afterMapLayer: {} */
			});

		} else if (this.state.modeComparador) {

			this.setState({
				year: year,
				beforeMapLayer:CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[year - 1]],
				afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[year + 1]]
			});

		} else {

			this.setState({
				year: year
			});
		}

	}


	changeYear(event) {

		this.updateYear(event.target.value);
	}

	changeMaxYear() {

		this.updateYear(CONSTANTS.ANY_FINAL);
	}

	changeMinYear() {

		this.updateYear(CONSTANTS.ANY_INIT);
	}

	changeAddStepYear(e) {

		const currentYear = Number(this.state.year);

		if (currentYear < CONSTANTS.MAX_YEAR) {

			this.updateYear(currentYear + 1);

		}

	}

	changeSubstractStepYear(e) {

		const currentYear = Number(this.state.year);

		if (currentYear > CONSTANTS.ANY_INIT) {

			this.updateYear(currentYear - 1);

		}

	}

	handleZoomChange(newZoom, showComparador) {


		if (showComparador) {

			this.setState({
				modeComparador: showComparador,
				beforeMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[this.state.year - 1]],
				afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[this.state.year + 1]]
			});

		} else {

			this.setState({
				modeComparador: showComparador,
				beforeMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]],
				afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]]
			});

		}

	}

	handleIncendiChange(newVal) {

		console.log("handleIncendiChange: ", newVal);

		/* const beforeAny = Number(CONSTANTS.incendisList[newVal].any) - 1;
		const afterAny = Number(CONSTANTS.incendisList[newVal].any) + 1; */
		const newCurrentIncendi = CONSTANTS.incendisList[newVal];
		const any = Number(newCurrentIncendi.any);

		if (this.isYearToCompare(any)) {

			this.setState({
				currentIncendi: newCurrentIncendi,
				year: any,
				modeComparador: true,
				beforeMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[any - 1]],
				afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[any + 1]]
			});

		} else {

			this.setState({
				currentIncendi: newCurrentIncendi,
				year: any,
				modeComparador: false,
				beforeMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]],
				afterMapLayer: CONSTANTS.ortoLayersOptions[CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]]
			});

		}



		this.setQueryParams({
			codifinal: `${newCurrentIncendi.key}&`
		});

	}


	initURLParams() {

		console.log("initURLParams");
		const codifinal = this.queryParams.codifinal;

		if (codifinal !== undefined) {

			console.log(codifinal);
			this.handleIncendiChange(this.getIncendiByCodi(codifinal));

		}

	}

	handleSelectIncendi (codi) {
		console.log("handleSelectIncendi", codi);
		this.handleIncendiChange(this.getIncendiByCodi(codi));
	}

	isYearToCompare(year) {
		return (year >= CONSTANTS.ANY_COMPARADOR && year <= CONSTANTS.ANY_COMPARADOR_MAX);
	}

	getIncendiByCodi(codifinal) {

		for (const incendi of CONSTANTS.incendisList) {
			if (incendi.key === codifinal) {
				return incendi.value;
			}
		}

	}

	renderMap() {

		return (
			<MapCompare
				afterMapLayer={this.state.afterMapLayer}
				beforeMapLayer={this.state.beforeMapLayer}
				modeComparador={this.state.modeComparador}
				anyIncendi={this.state.year}
				currentIncendi={this.state.currentIncendi}
				onSelectIncendi={this.handleSelectIncendi.bind(this)}
				onZoomChange={this.handleZoomChange.bind(this)}
				onResetMap={this.resetComparador.bind(this)}
				initURLParams={this.initURLParams.bind(this)}
			/>
		);

	}

	renderSelectorAnys () {

		if (!this.state.modeComparador) {

			const any = this.state.year >= CONSTANTS.MAX_YEAR ? "Tots" : this.state.year;

			const anyUp = this.state.year === CONSTANTS.MAX_YEAR ? "Tots" : this.state.year + 1;
			const anyDown = this.state.year === CONSTANTS.ANY_INIT ? CONSTANTS.ANY_INIT : this.state.year - 1;
			/* 	const tagUp */

			return (
				<div className={styles.controls} id="controls" >
					<div className={styles.anysControls}>
						<div className={styles.anySelecionat}>{any}</div>
					</div>
					<div className={styles.anysButtons}>
						<Icon className={styles.anysIcones} size="large" onClick={this.changeAddStepYear.bind(this)} name="chevron circle up" />{anyUp}
						<br />
						<Icon  className={styles.anysIcones} size="large" onClick={this.changeSubstractStepYear.bind(this)} name="chevron circle down" />{anyDown}
						<br />
					</div>
				</div>
			);
		} else {

			return (
				<div>
					{this.renderSelectorAnysOrto(this.state.beforeMapLayer.value, this.updateBeforeMapLayer.bind(this), styles.containerSelectOrtoLeft)}
					{this.renderSelectorAnysOrto(this.state.afterMapLayer.value, this.updateAfterMapLayer.bind(this), styles.containerSelectOrtoRight)}
				</div>
			);

		}

	}

	updateAfterMapLayer(newVal) {
		this.setState({afterMapLayer: CONSTANTS.ortoLayersOptions[newVal]});
	}

	updateBeforeMapLayer(newVal) {
		this.setState({beforeMapLayer: CONSTANTS.ortoLayersOptions[newVal]});
	}




	renderSelectorAnysOrto(initValue, funcLayerChanged, styleName) {

		//pointing="left"

		return (

			<div className={styleName}>
				<Dropdown
					button
					className={styles.mySelectAnysOrto}
					placeholder="Selecciona l'any"
					fluid
					search
					selection
					value={initValue}
					options={CONSTANTS.ortoLayersOptions}
					onChange={(e, data) => funcLayerChanged(data.value)}
				/>
			</div>

		);

	}

	renderSelectorIncendis(initValue) {

		return (
			<Dropdown
				button
				fluid
				className={styles.mySelect}
				placeholder="Selecciona l'incendi"
				selection
				value={initValue}
				onChange={(e, data) => this.handleIncendiChange(data.value)}
				options={CONSTANTS.incendisList}
			/>
		);

	}

	renderMenuSelectors() {

		return (

			<Grid centered  className={styles.containerMenuSelectors}>

				<Grid.Row only='tablet mobile'>
					<Grid.Column >
						{this.renderSelectorIncendis(this.state.currentIncendi.value)}
					</Grid.Column>
				</Grid.Row>

				<Grid.Row columns={2} only='computer'>
					<Grid.Column >
						{this.renderSelectorIncendis(this.state.currentIncendi.value)}
					</Grid.Column>
				</Grid.Row>

			</Grid>
		);


	}

	/* 	renderButtonResetComparador() {

		return (
			<div className={styles.containerButtonReset}>
				<Button onClick={this.resetComparador.bind(this)} size="small" className={styles.myButtonReset} animated='vertical'>
					<Button.Content visible><Image src="./cat_white.svg"></Image></Button.Content>
					<Button.Content hidden>
						<Icon size="large" name='arrow left' />
					</Button.Content>
				</Button>
			</div>

		);

	} */


	render() {

		return (

			<div className={styles.containerVisor}>
				{this.renderMenuSelectors()}
				{this.renderSelectorAnys()}
				{this.renderMap()}

			</div>


		);

	}

}
