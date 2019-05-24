//@flow

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

function noOp () { }

if (typeof window.URL.createObjectURL === "undefined") {

	Object.defineProperty(window.URL, "createObjectURL", { value: noOp});

}
