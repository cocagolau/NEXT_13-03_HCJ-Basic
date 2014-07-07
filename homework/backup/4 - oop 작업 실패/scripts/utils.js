var Create = (function () {
	var objects = ['journal', 'section', 'article'];
	return {
		possible : function (type) {
			for (var index in objects) {
				if (type === objects[index])
					return true;
			}
			return false;
		},
		instance : function (type) {
			var tempIns = null;

			return (function() {
				switch (type) {
				case objects[0] :
					return new JournalForm();
				case objects[1] :
					return new SectionForm();
				case objects[2] :
					return new ArticleForm();
				}
			}());
		}
	};
}());


var Utils = (function () {


	var methods = {
		getValue : function (obj, index) {
			var keys = Object.keys(obj);
			return obj[keys[index]];
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

		pickOut : function (obj, keyArray) {
			var tempObj = {};
			for (var index in keyArray) {
				var key = keyArray[index];
				tempObj[key] = obj[key];
			}
			return tempObj;
		}
	};

	return methods;

}());