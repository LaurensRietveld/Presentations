function getConfigFromUrl() {
	var vars = {};
	var queryString = window.location.href.slice(window.location.href
			.indexOf('?') + 1);
	return $.parseJSON(decodeURIComponent(queryString));
}
var config = getConfigFromUrl();

//debug stuff

if (!config.value) {
	$("#warning").show().html(
			"No value found in config. unable to draw anything");
}

if (!config.mode)
	config.mode = "javascript";
if (!config.theme)
	config.theme = "monokai";
if (!config.lineNumbers)
	config.lineNumbers = true;
if (!config.viewportMargin) 
	config.viewportMargin = Infinity;
var myCodeMirror = CodeMirror(document.body, config);

//myCodeMirror.refresh();
//myCodeMirror.setSize("100%", "100px");