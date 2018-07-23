// @flow

import React, { Component } from "react";
import { Image,  Menu, Button, Icon } from "semantic-ui-react";

import styles from "./Footer.css";

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

	render() {
		return (

			<div className={styles.containerFooter}>

				<div className={styles.containerLeft}>

					<Button className={styles.myInvertedButton}>
						<Icon name='external alternate' /> +Prototips
					</Button>
					<Button  className={styles.myInvertedButton}>
						<Icon name='github' /> Github
					</Button>
					<Button  className={styles.myInvertedButton}>
						<Icon name='linkify' /> Enllaça
					</Button>
				</div>

				<div className={styles.containerRight}>

					<Button circular inverted icon='mail' />
					<Button circular color='twitter' icon='twitter' />
					<Button circular color='linkedin' icon='facebook' />
					<Button circular color='google plus' icon='google plus' />
					<Button circular color='red' icon='pinterest' />

				</div>

			</div>
		);
	}

}
