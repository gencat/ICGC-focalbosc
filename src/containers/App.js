// @flow

import React from "react";
import Visor from "./Visor/Visor";
import styles from "./App.module.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import dotenv from "dotenv";


const App = () => {

	dotenv.config();
	return (<div className={styles.myApp}>
		<Header title="Foc al Bosc" showModalInfo={true}/>
		<Visor/>
		<Footer/>
	</div>);

}

export default App;
