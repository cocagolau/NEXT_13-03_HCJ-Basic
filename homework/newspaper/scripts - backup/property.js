
function NaturalProperty () {
	// this.type = 'naturalProperty';
}
NaturalProperty.prototype = {
	getType : function () {
		return this.type;
	},

	get : function (key) {
		try {
			return this[key];
		}
		catch (error) {
			return null;
		}
	},
	add : function (key, value) {
		this[key] = value;
	},
	set : function (propObj, overwrite) {
		try {
			var count = 0;
			if (typeof overwrite === 'undefined')
				overwrite = false;

			if (overwrite) {
				for (var key in propObj) {
					this[key] = propObj[key];
				}
			} else {
				for (var key in propObj) {
					if (!this[key]) // 없는 경우만 포함
						this[key] = propObj[key];
				}
			}
		}
		catch (error) {
			return null;
		}
	},
	has : function (key) {
		var keys = this.keys();
		for (var i in keys) {
			if (keys[i] === key)
				return true;
		}
		return false;
	},
	keys : function () {
		return Object.keys(this);
	},
	size : function () {
		return this.keys().length;
	},
	delete : function (key) {
		return delete this[key];
	},
	update : function (key, value) {
		try {
			this[key] = value;
		}
		catch (error) {
			return null;
		}
	}
};

function FormProperty () {
	// this.type = 'formProperty';
}
FormProperty.prototype = new NaturalProperty();

function ObjectProperty () {

}
ObjectProperty.prototype = new NaturalProperty();


function InfoProperty () {
	// this.type = 'infoProperty';
}
InfoProperty.prototype = new NaturalProperty();

function StyleProperty () {
	// this.type = 'styleProperty';
}
StyleProperty.prototype = new NaturalProperty();




var IOEngine = function(propertyObj) {
	return (function () {

		var methods = {
			create : function () {

			},
			read : function () {

			},
			delete : function () {

			},
			update : function () {

			}
		};

		return methods;

	}());

};