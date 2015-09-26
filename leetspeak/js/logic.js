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
	text = text.replace("I", "1");
	text = text.replace("E", "3");
	text = text.replace("A", "4");
	text = text.replace("O", "0");
	text = text.replace("i", "1");
	text = text.replace("e", "3");
	text = text.replace("A", "4");
	text = text.replace("O", "0");
	return text;
}