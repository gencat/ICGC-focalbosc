// @flow

import React from "react";
import {  Button, Divider, Form, Icon } from "semantic-ui-react";
import { ResizeComponent } from "@geostarters/react-components";

import ModalInfo from "../ModalInfo/ModalInfo";
import styles from "./Footer.module.css";
import {
	URLMAIL,
	URLTWITTER,
	URLFACEBOOK,
	URL_GITHUB,
	URL_PROTOTIPS
} from "../../constants";


const Footer = (props) => {

	const isMobile = props.width <= 500;

	const openLink = (url, mode = "_blank") => window.open(url, mode);

	const getUrlApp = () => window.location.href;

	const getEncodedUrlApp = () => encodeURI(window.location.href);

	const getEmbedUrlApp = () => `<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="${getUrlApp()}" ></iframe>`;

	const renderBTLink = () => (
		<ModalInfo modalSize="tiny" modalTrigger={<Button className={styles.myInvertedButton}><Icon name='linkify' /> Enllaça</Button>}>
			<h3>Enllaça la vista</h3>
			<Divider />
			<Form inline="true" >
				<Form.Field >
					<label>Per enllaçar amb aquest mapa, copieu i enganxeu el següent text:</label>
					<input readOnly value={getUrlApp()} />
				</Form.Field>
				<Form.Field>
					<label>Per inserir aquest mapa al vostre web, copieu i enganxeu el següent text:</label>
					<textarea readOnly value={getEmbedUrlApp()} />
				</Form.Field>
			</Form>
		</ModalInfo>
	);

	const renderContainerLeft = () => (
		<div className={styles.containerLeft}>
			<Button className={styles.myInvertedButton} onClick={() => openLink(URL_PROTOTIPS)}>
				<Icon name='external alternate' /> +Prototips
			</Button>
			<Button  className={styles.myInvertedButton} onClick={() => openLink(URL_GITHUB)}>
				<Icon name='github' /> Github
			</Button>
			{renderBTLink()}
		</div>
	);

	const renderContainerRight = () => (
		<div className={styles.containerRight}>
			<Button onClick={()=>openLink(`${URLMAIL}${getEncodedUrlApp()}`, "_self")} circular inverted icon='mail' />
			<Button onClick={()=>openLink(`${URLTWITTER}${getEncodedUrlApp()}`)} circular inverted icon='twitter' />
			<Button onClick={()=>openLink(`${URLFACEBOOK}${getEncodedUrlApp()}`)} circular inverted icon='facebook' />
		</div>
	);

	return (
		<div className={props.width <= 500 ? styles.containerFooterMobile : styles.containerFooter}>
			{!isMobile && renderContainerLeft()}
			{renderContainerRight() }
		</div>
	);

};

Footer.DefaultProperties = {
	width: 800
};

// eslint-disable-next-line new-cap
export default React.memo(ResizeComponent(Footer));
