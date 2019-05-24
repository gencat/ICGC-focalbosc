// @flow
const csv = require("fast-csv");
const fs = require("fs");
const path = require("path");
const proj4 = require("proj4");
const moment = require("moment");

proj4.defs("EPSG:25831", "+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:23031", "+proj=utm +zone=31 +ellps=intl +towgs84=-136.65549,-141.46580,-167.29848,-2.09308759,-0.00140548839,-0.107708594,1.000011546110 +units=m +no_defs");
/* const epsg23031 = new proj4.Proj("EPSG:23031");
const epsg25831 = new proj4.Proj("EPSG:25831");
const epsg4326 = new proj4.Proj("EPSG:4326");
const epsg3857 = new proj4.Proj("EPSG:3857"); */

let content = [];
let index = 0;

//Update every year
const anyfinal = 2018;
const filename = path.join(__dirname, "data/incendis_1996_2018.csv");

csv
	.fromPath(filename, {headers : true})
	.on("data", (data) => {

		const anyInc = moment(data.DATA_INCEN, "DD/MM/YYYY");
		const any = anyInc.year();

		if (any < anyfinal) {

			const municipi = toTitleCase(data.MUNICIPI);
			content.push({
				key: data.CODI_FINAL,
				value: index,
				area: data.AREA,
				any: any,
				municipi: data.MUNICIPI,
				bbox: `${data.XMIN},${data.YMIN},${data.XMAX},${data.YMAX}`,
				text: `${municipi} - ${anyInc.format("DD/MM/YYYY")} - ${parseFloat(data.AREA).toFixed(2)} km²`
			});
			index = index + 1;

		}

	})
	.on("end", () => {

		console.log("done");

		content = content.sort(compare);

		content = content.map((element, index) => {

			element.value = index;
			return element;

		});

		const contentTxt = JSON.stringify(content);

		fs.writeFile(path.join(__dirname, "results/incendis.json"), contentTxt, "utf8", (err) => {

			if (err) {

				return console.log(err);

			}

			console.log("The file was saved!");

		});

	});

function compare(a, b) {

	return a.municipi.localeCompare(b.municipi);

}

function toTitleCase(str) {

	str = str.toUpperCase();
	str = str.replace(/\S*/g, (txt) => {

		if (!["DEL", "LES", "LA", "DE", "EL", "I"].includes(txt)) {

			const re = /(.*)([L|D]')(.*)/i;
			if (txt.match(re)) {

				if (txt.match(re)[1] !== "") {

					return toTitleCase(txt.match(re)[1]) + txt.match(re)[2].toLowerCase() + toTitleCase(txt.match(re)[3]);

				} else {

					return txt.match(re)[2].toLowerCase() + toTitleCase(txt.match(re)[3]);

				}

			} else {

				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();

			}

		} else {

			return txt.toLowerCase();

		}

	});
	return str.charAt(0).toUpperCase() + str.substr(1);

}
