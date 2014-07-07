

var Monitor = function() {
	var rootElement = null;
	var modeStyle = 'normal';
	var callbackFunc = {};  // data - {event : {callbackfun, captureing}, event:{}}
	// var eventList = {}; // eventtype, data
};

Monitor.prototype = {
	init : function(element) {
		this.rootElement = element;
		element.addEventListener('click',
			function(e) { 
				var target = e.target || e.srcElement || e.eventElement;
				eventHandler(this, target);
				



			}, false);


		var eventHandler = function (rootNode, target) {
			var currentElement = target;
			var classes = currentElement.className.split(' ');

			// debugger;
			while (classes.indexOf('btn') === -1) {
				var parentNode = currentElement.parentNode;
				if (parentNode === rootNode) break;
				currentElement = currentElement.parentNode;
				classes = currentElement.className.split(' ');
			}
			console.log(target);
			console.log(currentElement);
			console.log(classes);
			console.log('---------- \n');
		}


		
	},
	mode : function(m) {
		var modeStyle = ['normal', 'log'];
		if (typeof m === 'undefined') {
			return modeStyle;
		}
		if (modeStyle.indexOf(m) === -1) {
			return false;
		}
		modeStyle = m;
		return modeStyle;
	},
}
















