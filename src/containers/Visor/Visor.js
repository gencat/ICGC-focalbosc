// @flow

import React from "react";

//import ResizeComponent from "../components/ResizeComponent";
//import { ResizeComponent } from "@geostarters/react-components";

import MapCompare from "../../components/MapCompare/MapCompare";
import * as CONSTANTS from "../../constants";

import ReactQueryParams from "react-query-params";
import { Icon, Grid, Dropdown } from "semantic-ui-react";
import {isMobile} from "react-device-detect";

import styles from "./Visor.module.css";

export default class PanelContainer extends ReactQueryParams {

	constructor(props) {

		super(props);

		this.state = {

			year: CONSTANTS.MAX_YEAR,

			currentBBOX: [],
			currentCenter: [],

			currentIncendi: {},
			beforeMapLayer: this.getBeforeMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]),
			afterMapLayer: this.getAfterMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]),

			modeComparador: false
		};

	}


	resetComparador = () => {

		this.setQueryParams({
			codifinal: ""
		});

		this.setState({

			year:CONSTANTS.MAX_YEAR,

			currentBBOX: [],
			currentCenter: [],

			currentIncendi: {},
			beforeMapLayer: this.getBeforeMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]),
			afterMapLayer: this.getAfterMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]),

			modeComparador: false
		});

	}

	updateYear(year) {

		if ((year > CONSTANTS.ANY_COMPARADOR_MAX || year < CONSTANTS.ANY_COMPARADOR) && (year !== CONSTANTS.ANY_ESPECIAL)) {

			this.setState({
				year: year,
				modeComparador: false,
				beforeMapLayer: this.getBeforeMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]),
				afterMapLayer: this.getAfterMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL])
			});

		} else if (this.state.modeComparador) {

			this.setState({
				year: year,
				beforeMapLayer: this.getBeforeMapLayer(CONSTANTS.mappingAnyLayer[year - 1]),
				afterMapLayer: this.getAfterMapLayer(CONSTANTS.mappingAnyLayer[year + 1])
			});

		} else {

			this.setState({year: year});

		}

	}

	changeYear = (event) => this.updateYear(event.target.value);

	changeMaxYear() {

		this.updateYear(CONSTANTS.ANY_FINAL);

	}

	changeMinYear() {

		this.updateYear(CONSTANTS.ANY_INIT);

	}

	changeAddStepYear = () => {

		const currentYear = Number(this.state.year);

		if (currentYear < CONSTANTS.MAX_YEAR) {

			this.updateYear(currentYear + 1);

		}

	}

	changeSubstractStepYear = () => {

		const currentYear = Number(this.state.year);

		if (currentYear > CONSTANTS.ANY_INIT) {

			this.updateYear(currentYear - 1);

		}

	}

	handleZoomChange = (newZoom, showComparador) => {

		if (showComparador) {

			this.setState({
				modeComparador: showComparador,
				beforeMapLayer: this.getBeforeMapLayer(CONSTANTS.mappingAnyLayer[this.state.year - 1]),
				afterMapLayer: this.getAfterMapLayer(CONSTANTS.mappingAnyLayer[this.state.year + 1])
			});

		} else {

			this.setState({
				modeComparador: showComparador,
				beforeMapLayer: this.getBeforeMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]),
				afterMapLayer: this.getAfterMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL])
			});

		}

	}

	handleIncendiChange(newVal) {

		const newCurrentIncendi = CONSTANTS.incendisList[newVal];
		const any = Number(newCurrentIncendi.any);

		if (this.isYearToCompare(any)) {

			this.setState({
				currentIncendi: newCurrentIncendi,
				year: any,
				modeComparador: true,
				beforeMapLayer: this.getBeforeMapLayer(CONSTANTS.mappingAnyLayer[any - 1]),
				afterMapLayer: this.getAfterMapLayer(CONSTANTS.mappingAnyLayer[any + 1])
			});

		} else {

			this.setState({
				currentIncendi: newCurrentIncendi,
				year: any,
				modeComparador: false,
				beforeMapLayer: this.getBeforeMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL]),
				afterMapLayer: this.getAfterMapLayer(CONSTANTS.mappingAnyLayer[CONSTANTS.ANY_FINAL])
			});

		}


		this.setQueryParams({
			codifinal: `${newCurrentIncendi.key}&`
		});

	}


	initURLParams = () => {

		const { codifinal } = this.queryParams;

		if (codifinal !== undefined && codifinal !== "") {

			this.handleIncendiChange(this.getIncendiByCodi(codifinal));

		}

	}

	handleSelectIncendi = (codi) => this.handleIncendiChange(this.getIncendiByCodi(codi));

	isYearToCompare = (year) => ((year >= CONSTANTS.ANY_COMPARADOR && year <= CONSTANTS.ANY_COMPARADOR_MAX) || year === CONSTANTS.ANY_ESPECIAL);

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
				onSelectIncendi={this.handleSelectIncendi}
				onZoomChange={this.handleZoomChange}
				onResetMap={this.resetComparador}
				initURLParams={this.initURLParams}
			/>
		);

	}

	renderSelectorAnys () {

		if (!this.state.modeComparador) {

			const any = this.state.year >= CONSTANTS.MAX_YEAR ? "Tots" : this.state.year;
			const anyUp = this.state.year === CONSTANTS.MAX_YEAR ? "Tots" : this.state.year + 1;
			const anyDown = this.state.year === CONSTANTS.ANY_INIT ? CONSTANTS.ANY_INIT : this.state.year - 1;

			return (
				<div className={styles.controls} id="controls" >
					<div className={styles.anysControls}>
						<div className={styles.anySelecionat}>{any}</div>
					</div>
					<div className={styles.anysButtons}>
						<Icon className={styles.anysIcones} size="large" onClick={this.changeAddStepYear} name="chevron circle up" />{anyUp}
						<br />
						<Icon  className={styles.anysIcones} size="large" onClick={this.changeSubstractStepYear} name="chevron circle down" />{anyDown}
						<br />
					</div>
				</div>
			);

		} else {

			return (
				<div>
					{this.renderSelectorAnysOrto(this.state.beforeMapLayer.value, this.updateBeforeMapLayer, styles.containerSelectOrtoLeft)}
					{this.renderSelectorAnysOrto(this.state.afterMapLayer.value, this.updateAfterMapLayer, styles.containerSelectOrtoRight)}
				</div>
			);

		}

	}

	getBeforeMapLayer = (newVal) => {
		return CONSTANTS.ortoLayersOptions[newVal] || CONSTANTS.ortoLayersOptions[CONSTANTS.ortoLayersOptions.length - 1];
	}

	getAfterMapLayer = (newVal) => {
		return CONSTANTS.ortoLayersOptions[newVal] || CONSTANTS.ortoLayersOptions[CONSTANTS.ortoLayersOptions.length - 1];
	}

	updateAfterMapLayer = (newVal) => {
		
		this.setState({afterMapLayer: this.getAfterMapLayer(newVal)});
	
	}
	
	updateBeforeMapLayer = (newVal) => {
		
		this.setState({beforeMapLayer: this.getBeforeMapLayer(newVal)});

	}

	renderSelectorAnysOrto(initValue, funcLayerChanged, styleName) {

		return (

			<div className={styleName}>
				<Dropdown
					button
					className={styles.mySelectAnysOrto}
					placeholder="Selecciona l'any"
					fluid
					search={!isMobile}
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
				search={!isMobile}
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

				<Grid.Row className={styles.containerMenuSelectorsRow} only='tablet mobile'>
					<Grid.Column >
						{this.renderSelectorIncendis(this.state.currentIncendi.value)}
					</Grid.Column>
				</Grid.Row>

				<Grid.Row className={styles.containerMenuSelectorsRow} columns={2} only='computer'>
					<Grid.Column >
						{this.renderSelectorIncendis(this.state.currentIncendi.value)}
					</Grid.Column>
				</Grid.Row>

			</Grid>
		);


	}

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
