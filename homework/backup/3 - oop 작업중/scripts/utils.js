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
					return new Journal();
				case objects[1] :
					return new Section();
				case objects[2] :
					return new Article();
				}
			}());
		}
	};
}());


var Utils = (function () {

	return {
		getValue : function (obj, index) {
			var keys = Object.keys(obj);
			return obj[keys[index]];
		}
	}

}());