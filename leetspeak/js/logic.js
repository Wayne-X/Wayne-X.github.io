window.onload = function() {
  document.getElementById("textarea").focus();
  document.getElementById("textarea").select();
};

function mySubmit(){
	var text = document.getElementById("textarea").value;
	text = l33tify(text);
	document.getElementById("posttextarea").value = text;
	document.getElementById("posttextarea").focus();
	//document.getElementById("posttextarea").select();
	return false;
}

function l33tify(text){
	text = replaceAll("i", "1", text);
	text = replaceAll("I", "1", text);
	text = replaceAll("e", "3", text);
	text = replaceAll("E", "3", text);
	text = replaceAll("a", "4", text);
	text = replaceAll("A", "4", text);
	text = replaceAll("o", "0", text);
	text = replaceAll("O", "0", text);
	return text;
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

/*
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
*/