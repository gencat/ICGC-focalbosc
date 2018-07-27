// @flow

import React from "react";
import Visor from "./Visor/Visor";
import styles from "./App.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default class App extends React.Component {

	render() {
		return (
			<div className={styles.myApp}>
				<Header title="Foc al Bosc" showModalInfo={true}/>
				<Visor/>
				<Footer/>
			</div>
		);
	}

}
