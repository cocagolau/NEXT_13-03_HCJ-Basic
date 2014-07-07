window.addEventListener('load', initPage, false);

function initPage() {
	var server = new Server({date:'2013-10-10'});   // var server = Server(init)	

	var offsetHeight = 30;
	var headerHeight = 45;
	var windowHeight = window.innerHeight;
	var px = 'px';
	
	(function() {
		var Utils = (function() {
			return {
				classify : function (obj) {
					var types = {
						string : [], // number, string
						object : [],
						array : []
					};
					for (var key in obj) {
						var value = obj[key];
						
						if (value instanceof Array) {
							types['array'].push(key);
						}
						else if (value instanceof Object) {
							types['object'].push(key);
						}
						else if (typeof value === 'number' || typeof value === 'string'){
							types['string'].push(key);
						}
					}
					return types;
				},
				getRandom : function (range) {
					return Math.round(Math.random() * (range-1));
				},
				extract : function (obj, keys) {
					return (function() {
								var tempObj = {};
								for (var i=keys.length; i>0; i--) {
									var key = keys[i-1];
								 	if (obj.hasOwnProperty(key))
										tempObj[key] = obj[key];	
								}
								return tempObj;
							}());
				},
				extend : function (thisObj, thatObj) {
					for (var prop in thatObj) {
						thisObj[prop] = thatObj[prop];
					}
					return thisObj;
				},
				union : function (thisObj, thatObj) {
					return this.extend(this.extend({},thisObj), thatObj);
				},
				merge : function (thisObj, thatObj) {
					for (var prop in thatObj) {
						if (thisObj.hasOwnProperty[prop]) continue;
						thisObj[prop] = thatObj[prop];
					}
					return thisObj;
				}
			}
		}());


		// event monitor
		var EventMonitor = (function() {
			var mvcObjArr = [];
			var methods = {
				set mvcObject(obj) {
					mvcObjArr.push(obj);
				},
				doClick : function(e) {
					var target = e.target;
					switch (target.getAttribute('data-direction')) {
						case 'right' :
							for (var i=0; i<mvcObjArr.length; i++) {
								var currentObj = mvcObjArr[i];
								currentObj.moveTo('right', server.next('journal'+currentObj.getId('right')));
							}
							break;
						case 'left' :
							for (var i=0; i<mvcObjArr.length; i++) {
								var currentObj = mvcObjArr[i];
								currentObj.moveTo('left', server.previous('journal'+currentObj.getId('left')));
							}
							break;
						default :
							console.log('Event Error');
					}
				},
				setEvent : function(varName, eventType, query) {
					this[varName] = (function() {
						return document.querySelectorAll(query);
					}());

					for (var i=0; i<this[varName].length; i++) {
						var newVar = this[varName][i];
						newVar.addEventListener(eventType, this.doClick, false);
					}

				}
			};
			return methods;
		}());




		var myNews = new News ('journals', server.getInit(), server.getTemplate(), server.getStyle());

		EventMonitor.mvcObject = myNews;
		EventMonitor.setEvent('outerBtns', 'click', '#container > button[data-position="outer"]');


	}());


	
}
