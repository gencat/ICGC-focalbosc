//@flow

import React from "react";
import { shallow, mount } from "enzyme";
import toJSON from "enzyme-to-json";
import Footer from "./Footer";
import {  Button } from "semantic-ui-react";

describe("Footer component", () => {

	it("renders correct properties ", ()=> {

		const mockProps = {
			width: 1000
		};

		const component = shallow(<Footer {...mockProps}></Footer>);
		expect(toJSON(component)).toMatchSnapshot();

	});

	it("renders correctly for mobile", ()=> {

		const mockProps = {
			width: 400
		};

		const component = mount(<Footer {...mockProps}></Footer>);
		expect(component.find(".containerLeft")).toHaveLength(0);
		expect(component.find(".containerRight")).toHaveLength(1);
		expect(component.find(Button)).toHaveLength(3);

		component.unmount();

	});


});
