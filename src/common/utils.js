// @flow
"use strict";

/**
 * Utils functions
 */
class Utils {

	/**
	 * Check if an object is empty
	 *
	 * @param {Object} obj
	 */
	static isEmpty(obj: Object) {

		for (let key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;

	}

}

module.exports = Utils;
