// @flow

import React from "react";
import PropTypes from "prop-types";

import { Modal, Button, Container } from "semantic-ui-react";
import Header from "../Header/Header";
import styles from "./ModalInfo.module.css";


const ModalInfo = ({children, modalSize = "small", modalTrigger}) => (

	<Modal
		size={modalSize}
		trigger={modalTrigger ? modalTrigger : <Button icon='info' className={styles.buttonModalInfoMobile} ></Button> }
		closeIcon
	>
		<Header title=" " showModalInfo={false}></Header>
		<Modal.Content image>
			<Modal.Description  className={styles.description}>

				<Container textAlign='justified'>

					{ children }

				</Container>

			</Modal.Description>
		</Modal.Content>
	</Modal>

);

ModalInfo.propTypes = {
	modalSize: PropTypes.string,
	modalTrigger: PropTypes.object,
	children: PropTypes.array
};

export default ModalInfo;
