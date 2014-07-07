function createRequest() {
	try {
		request = new XMLHttpRequest();
	} catch (tryMS) {
		try {
			request = new ActiveXObject('Msxml2.XMLHTTP');
		} catch (otherMS) {
			try {
				request = new ActiveXObject('Microsoft.XMLHTTP');
			} catch (failed) {
				request = null;
			}
		}
	}
	return request;
}
function getTagsObj(selector, key, keyTitle, value) {
	var tagsObj = {};
	var selectorTag = document.querySelector(selector);
	var keyTags = selectorTag.querySelectorAll(key);
	var keyTagsLength = keyTags.length;

	for (var i=0; i<keyTagsLength; i++) {
		var keyTag = keyTags[i];
		var keyTagTitle = keyTag.querySelector(keyTitle).firstChild.nodeValue;
		var valueTagsArray = Array.prototype.slice.call(keyTag.querySelectorAll(value));
		tagsObj[keyTagTitle] = valueTagsArray;
	}
	return tagsObj;
}


function createElement(tag, textValue, attributeObj) {
	var elem = document.createElement(tag);

	if (textValue) {
		var text = document.createTextNode(textValue);
		elem.appendChild(text);
	}

	if (attributeObj) {
		var attriKeys = Object.keys(attributeObj);
		var attriKeysLength = attriKeys.length;
		if (attriKeysLength) {
			for (var i=0; i<attriKeysLength; i++) {
				var attribute = attriKeys[i];
				if (attribute && (typeof(attribute) != 'undefined')) {
					//  IE error
					elem.setAttribute(attribute, attributeObj[attribute]);
				}
			}
		}
	}

	return elem;
}

function removeChild(parent) {
	var num = parent.childNodes.length;
	if (num) {
		for (var i=num; i>0; i--) {
			parent.removeChild(parent.childNodes[i-1]);
		}
	}
	return parent;
}


function getCirculatedKey(maxValue, init, gap) {
	var circulatedKey;

	if (init+gap < 0) {
		circulatedKey = maxValue+init+gap;
	}
	else if (init+gap >= maxValue) {
		circulatedKey = gap-1;
	}
	else {
		circulatedKey = init + gap;
	}
	return circulatedKey;
}


function getRandomNumber (range) {
	return Math.round(Math.random() * (range-1));
}

function getRandomKeys(obj) {
	var randomKeys = [];
	var keys = Object.keys(obj);
	var range = keys.length;
	var index = 0;

	do {
		var randomNumber = getRandomNumber(range);
		if (typeof(randomKeys[randomNumber]) === "undefined") {
			randomKeys[randomNumber] = keys[index++];
		}
	} while(index < range);
	
	return randomKeys;
}

