
function showNext(e) {
	var result;
	if (typeof(e) == "string") {
		if (e.charAt(0) == "$") {
			result = e.substring(1,e.length);
		}
		else if (e.toString() == "") {
			result = false;	
		}
		else {
			result = e.toString();
		}
	}
	else if (typeof(e) == "boolean"){
		result = e;
	}
	else {
		result = "false";
	}

	alert(result);
}

showNext("next");	//next
showNext("$next");  //next  
showNext("$apple"); //apple 
showNext(true);		//true
showNext(""); 		//false
showNext(null); 	//false
showNext([3,5,6,]) 	//false
showNext() 			//false


var servicesList = ["영화","쇼핑" , "검색" ,"책","자동차","쉼","뿜&톡"];
var show = function (list) {
	return function (logo) {

		var result = "";

		for (var i=0; i<list.length; i++) {
			var service = list[i];
			result += logo + " " + service + "\n";
		}
		alert(result);
	};
}

var newfunction = show(servicesList);
newfunction('DAUM');
newfunction('NAVER');   