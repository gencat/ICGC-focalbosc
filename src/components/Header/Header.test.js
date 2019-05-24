// @flow

import React from "react";
import Header from "./Header";
import  { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

describe("Header Component", () => {

	it("renders correct properties", ()=>{

		const mockProps = {
			title: "Title",
			width: 1000,
			showModalInfo: false

		};
		const component = shallow(<Header {...mockProps}></Header>);

		expect(toJSON(component)).toMatchSnapshot();

	});

	it("renders without image for mobile", ()=>{

		const mockProps = {
			title: "Title",
			width: 400,
			showModalInfo: false

		};
		const component = shallow(<Header {...mockProps}></Header>);

		expect((component.find("img"))).toHaveLength(0);

	});


});
