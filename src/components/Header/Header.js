// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image, Modal, Button, Container, Divider, Header as sHeader } from "semantic-ui-react";

import styles from "./Header.css";

export default class Header extends Component {

	constructor() {
		super();
		this.state = {
			width: window.innerWidth,
		};

		window.addEventListener('resize', this.handleWindowSizeChange);
	}

	
	// make sure to remove the listener
	// when the component is not mounted anymore
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleWindowSizeChange);
	}
	
	handleWindowSizeChange = () => {
		this.setState({ width: window.innerWidth });
	};	

	renderModalInfo() {

		if (this.props.showModalInfo) {
			return (
				<div className={styles.containeritemRight}>
					<Modal size="small" trigger={<Button inverted circular icon='info' className={styles.buttonModalInfoMobile} ></Button>} closeIcon>
						<Header title=" " showModalInfo={false}></Header>
						<Modal.Content image>
							<Modal.Description>

								<Container textAlign='justified'>

									<h1>Foc al bosc</h1>
									<h3>Comparador d'incendis</h3>
									
									<Divider />
									
									<p>Aquesta aplicació permet <b>prendre consciència</b> de la magnitud i conseqüències dels incendis i de la lenta recuperació del bosc.</p>
									
									<p>A <b>nivell general</b> de Catalunya, l’eina permet <b>visualitzar la distribució i abast</b> territorial de cada incendi. 
									Podem veure tots els del període 1986-2017 o focalitzar-nos només en un any determinat, clicant sobre les fletxes. 
									En passar el cursor sobre un incendi l’eina ens mostra la data i el nom del municipi on es va originar, també la superfície afectada.</p>

									<p>En fer clic en un incendi entrem en <b>mode detall</b> que permet <b>comparar i analitzar l’àrea afectada</b> abans i després del foc. 
									L’eina mostra la pantalla dividida en dues meitats. Una amb la imatge de l’any previ a l’incendi, i l’altra de l’any posterior. 
									Amb els desplegables superiors podem canviar a altres anys, per veure l’evolució de la vegetació. 
									Aquesta funcionalitat només està disponible en els incendis a partir del 2004.</p>

									<p>Recordeu que a l’aplicació <a href="https://betaportal.icgc.cat/comparador-gificador/#16/41.4359/2.2403" target="_blank">Comparador històric del territori</a> podeu generar imatges animades d’aquestes àrees.</p>
									
									<p>Feu-nos arribar les vostres aportacions i propostes a <a href="mailto:betaportal@icgc.cat">betaportal@icgc.cat</a></p>

								</Container>

							</Modal.Description>
						</Modal.Content>
					</Modal>
				</div>
			);
		}

	}

	render() {

		const title = (this.props.title ? this.props.title : "Nou prototip");
		const pathLogo = (this.props.pathLogo ? this.props.pathLogo : "./ICGC_white.svg");

		const { width } = this.state;
  	const isMobile = width <= 500;

		if (isMobile) {
			return (
				<div className={styles.containerHeader}>
	
					<div className={styles.containertitle}>
						<h2 className={styles.title}>{title}</h2>
					</div>
	
					{this.renderModalInfo()}
	
				</div>
			);
		}

		return (
			<div className={styles.containerHeader}>

				<div className={styles.containerlogo}>
					<Image
						only="mobile"
						className={styles.logo}
						src={pathLogo}/>
				</div>

				<div className={styles.containertitle}>
					<h2 className={styles.title}>{title}</h2>
				</div>

				{this.renderModalInfo()}

			</div>
		);

	}

}

Header.propTypes = {
	title: PropTypes.string,
	pathLogo: PropTypes.string,
	showModalInfo: PropTypes.bool,
	logoPath: PropTypes.string,
	infoURL: PropTypes.string,
	fontColor: PropTypes.string,
	backgroundColor: PropTypes.string
};
