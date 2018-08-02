// @flow

import React, { Component } from "react";
import {  Modal, Button, Container, Divider, Form, Icon } from "semantic-ui-react";
import Header from "../Header/Header";
import styles from "./Footer.css";
import {
	URLMAIL,
	URLTWITTER,
	URLFACEBOOK,
	URL_GITHUB,
	URL_PROTOTIPS
} from "../../constants";

/* const styles = {

	logo: {
		marginRight: "1em",
		marginLeft: "1em"
	},
	myMenu: {
		height: "3.8em",
		borderBottom: "2px solid #C21126"
	}

}; */

export default class Footer extends Component {

	constructor() {
		super();
		this.state = {
			width: window.innerWidth
		};

		window.addEventListener("resize", this.handleWindowSizeChange);
	}


	componentWillUnmount() {
		window.removeEventListener("resize", this.handleWindowSizeChange);
	}

	handleWindowSizeChange = () => {
		this.setState({ width: window.innerWidth });
	};

	openLink(url, mode = "_blank") {

		console.log("url", url);

		window.open(url, mode);

	}

	handleOpenModal() {

		this.setState({ url: window.location.href });

	}

	getUrlApp() {

		return this.state.url;

	}

	getEncodedUrlApp() {

		return encodeURI(window.location.href);

		return  encodeURI(window.location.href);

	}

	getEmbedUrlApp() {

		const text = `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${this.getUrlApp()}" ></iframe>`;

		return text;

	}

	renderBTLink() {

		return (
			<Modal size="tiny" trigger={<Button  onClick={this.handleOpenModal.bind(this)} className={styles.myInvertedButton}><Icon name='linkify' /> Enllaça</Button>} closeIcon>
				<Header title=" " showModalInfo={false}></Header>
				<Modal.Content image>
					<Modal.Description className={styles.description}>
						<Container textAlign='justified'>
							<h3>Enllaça la vista</h3>
							<Divider />
							<Form inline>
								<Form.Field >
									<label>Per enllaçar amb aquest mapa, copieu i enganxeu el següent text:</label>
									<input value={this.getUrlApp()} />
								</Form.Field>
								<Form.Field>
									<label>Per inserir aquest mapa al vostre web, copieu i enganxeu el següent text:</label>
									<textarea value={this.getEmbedUrlApp()} />
								</Form.Field>
							</Form>
						</Container>
					</Modal.Description>
				</Modal.Content>
			</Modal>

		);

	}

	renderContainerLeft() {

		const { width } = this.state;
		const isMobile = width <= 500;

		if (!isMobile) {
			return (

				<div className={styles.containerLeft}>
					<Button className={styles.myInvertedButton} onClick={() => this.openLink(URL_PROTOTIPS)}>
						<Icon name='external alternate' /> +Prototips
					</Button>
					<Button  className={styles.myInvertedButton} onClick={() => this.openLink(URL_GITHUB)}>
						<Icon name='github' /> Github
					</Button>
					{this.renderBTLink()}
				</div>
			);
		}

	}

	renderContainerRight() {

		return (
			<div  className={styles.containerRight}>

				<a target="blank" onClick={()=>this.openLink(`${URLMAIL}${this.getEncodedUrlApp()}`, "_self")} >
					<Button circular inverted icon='mail' />
				</a>

				<a target="blank" onClick={()=>this.openLink(`${URLTWITTER}${this.getEncodedUrlApp()}`)}>
				 <Button circular inverted icon='twitter' />
				</a>

				<a target="blank" onClick={()=>this.openLink(`${URLFACEBOOK}${this.getEncodedUrlApp()}`)} >
					<Button circular inverted icon='facebook' />
				</a>

			</div>
		);

	}

	render() {

		const { width } = this.state;
		//const isMobile = width <= 500;

		const footerStyle = (width <= 500 ? styles.containerFooterMobile : styles.containerFooter);

		return (

			<div className={footerStyle}>

				{this.renderContainerLeft()}

				{this.renderContainerRight() }

			</div>
		);
	}

}
