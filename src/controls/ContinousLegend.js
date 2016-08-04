/**
 * @external {Coverage} https://github.com/Reading-eScience-Centre/coverage-jsapi/blob/master/Coverage.md
 */

/**
 * @param {String} id
 * @param {String} text
 *  Dynamically changes the text in an HTML
 *  div given by the id.
 */
function changeHTMLText (id, text) {

	var span = document.getElementById(id);
	var	txt = document.createTextNode(text);
	span.innerText = txt.textContent;	
}

/**
 * @param {Coverage} cov
 * @param {Array} minMax
 * Takes in the maximum and minimum values from the   
 * continous data set and adds them to the legend.
 */
function changeLegendScale(cov, minMax) {

	changeHTMLText("start", minMax[0])
	changeHTMLText("finish", minMax[1])
	
}

/**
 * @param {Coverage} cov
 * @param {CoverageJSONLayer} layer
 * Creates a continous legend with a colour gradient for continous data types
 * like temperature by extracting the colours from the layer and the key information 
 * of the cateogry from the Coverage object.
 */
function ContinousLegend (cov, layer) {

	var paramKey = cov.parameters.keys().next().value
	var palette = layer.palette
	var legend = document.getElementById("my-legend")
	var minMax = CovUtils.minMaxOfRange(layer.range) 

	changeTitleAndUnits(cov,paramKey)

	changeLegendScale(cov, minMax)

	legend.display = "inline"

	var legendBar = document.getElementById("legend-bar")

	var colourString = ""

	for (var i = 0; i < palette.length; i++) {
		if (i !== palette.length - 1) {
			colourString += createRGBString(palette[i]) + ","
		} else {
			colourString += createRGBString(palette[i])
		}
	}

	legendBar.style.background = "linear-gradient(to top," + colourString + ")"
}