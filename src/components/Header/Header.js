// @flow

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Image, Icon } from "semantic-ui-react";

import styles from "./Header.css";

export default class Header extends Component {

	render() {


		const title = (this.props.title ? this.props.title : "Nou prototip");

		return (
			<div className={styles.containerHeader}>

				<div className={styles.containerlogo}>
					<Image
						className={styles.logo}
						src='./ICGC2.svg'/>
				</div>

				<div className={styles.containertitle}>
					<h2 className={styles.title}>{title}</h2>
				</div>

				<div className={styles.containeritemRight}>
					<Icon size="large" name="info circle"></Icon>
				</div>

			</div>
		);

		/* return (
			<Menu stackable fixed='top' style={styles.myMenu} >
				<Menu.Item as='a' header >
					<Image
						size='mini'
						src='./ICGC.svg'
						className={styles.logo}
					/>
						Comparador d'incendis
				</Menu.Item>
			</Menu>
		); */

	}

}

Header.propTypes = {
	title: PropTypes.string,
	logoPath: PropTypes.string,
	infoURL: PropTypes.string,
	fontColor: PropTypes.string,
	backgroundColor: PropTypes.string
};
