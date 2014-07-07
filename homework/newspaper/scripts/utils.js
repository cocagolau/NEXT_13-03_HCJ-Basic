var Utils = (function() {

	return {
		temporary : {
			$temp: {},
			has : function(key) {
				return this.$temp.hasOwnProperty(key);
			},
			set : function(key, value) {
				// console.log(value);

				if (this.has(key)) {
					this.$temp[key] = this.$temp[key].concat(value[1]);
				} else {
					this.$temp[key] = value[1];
				}
			},
			get : function (key) {
				if (typeof key === 'undefined') {
					return this.$temp;
				}
				else {
					return this.$temp[key];
				}
			},
			toString : function (key) {
				if (typeof key !== 'undefined') {
					return this.get(key).join('');
				}
			},
			indexOf  : function (key) {
				if (typeof key !== 'undefined') {
					return this.get(key).indexOf(null);
				}
			},
			get keys() {
				return Object.keys(this.$temp);
			},
			get length() {
				return this.keys.length;
			}


			// $temp:[],
			// set in(arr) {
			// 	this.$temp.push(arr);
			// },
			// get in() {
			// 	var newArr = [];
			// 	var length = this.$temp.length;

			// 	for (var i=0; i<length; i++) {
			// 		newArr.push(this.$temp.shift());
			// 	}
			// 	return newArr;
			// },
			// get length() {
			// 	return this.$temp.length;
			// }
		},
		getRandom : function (range) {
			return Math.round(Math.random() * (range-1));
		},
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
		}
	}

}());