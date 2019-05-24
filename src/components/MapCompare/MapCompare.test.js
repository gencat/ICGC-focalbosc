// @flow

import React from "react";
import MapCompare from "./MapCompare";
import  { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

describe("MapCompare Component", () => {

	it("renders correct properties", ()=>{

		const component = shallow(<MapCompare></MapCompare>);

		expect(toJSON(component)).toMatchSnapshot();

	});

});
