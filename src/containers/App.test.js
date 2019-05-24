// @flow
import React from "react";
import App from "./App";
import Visor from "./Visor/Visor";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import  { shallow } from "enzyme";

describe("App component ", ()=>{

	const component = shallow(<App />);


	it("renders one Header Component", () => {

		expect(component.find(Header)).toHaveLength(1);

	});

	it("renders one Footer Component", () => {

		expect(component.find(Footer)).toHaveLength(1);

	});

	it("renders one Visor Component", () => {

		expect(component.find(Visor)).toHaveLength(1);

	});

});


