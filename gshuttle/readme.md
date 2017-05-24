Google map of Gshuttle stops. The actual shuttle stops information is not public so you have to do the following to install:

log into your Noogler associated Google account in your browser and open your browser's network tab

access the shuttle information google sheet
https://docs.google.com/spreadsheets/d/1732H4YYkG0oDrmLsbm4VSvsm-Vaz1gjStFhL45D_MLI/edit#gid=1946293419

Find the POST request that loaded the stop descriptions sheet. The name begins with "fetchrows?id=". Look at the gid in your address bar to find which request it is.

parse this information into an 2d array in the following format and save to variable "locations". Put this in a file called "locations.js"

format:

var locations = [
	[
		"stopName1",
		37.123123,
		-121.123123,
		"stopDescription1"
	],
	[
		"stopName2",
		37.123123,
		-121.123123,
		"stopDescription2"
	],
	[
		"stopName3",
		37.123123,
		-121.123123,
		"stopDescription3"
	],
];