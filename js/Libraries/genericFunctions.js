// PROTOTYPES

Array.prototype.size = function(){
	return this.filter(function(a){return a !== undefined;}).length
};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$.fn.refresh = function() {
    return $(this.selector);
};

var getRandomProperty = function (obj) {
    var keys = Object.keys(obj)
    return obj[keys[ keys.length * Math.random() << 0]];
};

var getRandomKey = function (obj) {
    var keys = Object.keys(obj);
    return keys[ keys.length * Math.random() << 0];
};

function getKeyFromNumber (obj, key){
    var keys = Object.keys(obj);
    return keys[key];
}

Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
};


// FUNCTIONS

function formatNumberLength(num, length) {
	var r = "" + num;
	while (r.length < length) {
		r = "0" + r;
	}
	return r;
}
function isAppening(prob) {
	return getRandomInt(0, 100) <= prob;

}

function getDocumentRot (keyWord) {
	var  baseUrl = document.location.href.split("/");
	do {
		baseUrl.splice(-1,1);
	} while (baseUrl[baseUrl.length-1] != keyWord);
	return baseUrl.join('/');
}

function loadjsfile( filename)
{
	var rnd = Math.floor(Math.random()*80000);
	var fileref = document.createElement( 'script' );
	fileref.setAttribute( "type", "text/javascript" );
	fileref.setAttribute( "src", filename + "?r=" + rnd ); // note this line
}

function getRandomInt (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom (min, max) {
	return Math.random() * (max - min + 1) + min;
}

function getRandomCitizenName(sex) {
	if (sex == 'male') {
		return maleNames[getRandomInt(0,maleNames.length-1)];
	} else if (sex == 'female') {
		return femaleNames[getRandomInt(0,femaleNames.length-1)];
	}
	return 'Bernt';
}
function getRandomCitizenSurname() {
	return surnames[getRandomInt(0,surnames.length-1)];
}
function getRandomTownName() {
	if(isAppening(33)) return townNames[getRandomInt(0,townNames.length-1)];
	return townFirstNames[getRandomInt(0,townFirstNames.length-1)]+townSecondNames[getRandomInt(0,townSecondNames.length-1)];
}
function getDateFromTime(time) {
	var year, month, day;

	year = time/(daysInAMonth*monthsInAYear);
	month = time%(daysInAMonth*monthsInAYear);
	day = month%daysInAMonth;
	month /= daysInAMonth;

	return formatNumberLength(Math.floor(day+1), 2) + "-" + formatNumberLength(Math.floor(month+1), 2) + "-"
			+ formatNumberLength(Math.floor(year),4);
}
function getAgeFromTime(time) {
	var age = world.getActualTime() - time;
	age = age/(daysInAMonth*monthsInAYear);

	return Math.floor(age);
}






// meh
function createCORSRequest(method, url){
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr){
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined"){
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		xhr = null;
	}
	return xhr;
}

function readFile (fileName) {
	if (FileReader)
	{
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			var url = 'http://ivy-corp.com/src/data/'+fileName;

			var request = createCORSRequest('GET', url);
			if (request){
				request.onload = function(){
					surnames = request.response;
					//console.log(surnames);
					return ('pedrinn');
				};
				request.send();
			}

		} else {
			alert('The File APIs are not fully supported by your browser.');
		}
	} else {
		console.log ('Your browser doesn\'t support the FileReader functionality of HTML5, you\'re not suited to be' +
			'part of the testing team, sorry');
	}
}