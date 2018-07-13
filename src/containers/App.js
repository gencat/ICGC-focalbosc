// @flow

import React from "react";
import Visor from "./Visor/Visor";
import styles from "./App.css";

export default class App extends React.Component {

	render() {
		return (
			<div className={styles.myApp}>
				<Visor/>
			</div>
		);
	}

}
