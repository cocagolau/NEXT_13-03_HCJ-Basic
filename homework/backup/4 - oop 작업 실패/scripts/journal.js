/*
	journal
	position 값을 갖는다 newRight, right, middle, left, newLeft
	journal의 값을 삭제, 추가 기능이 있음

	json형식으로 출력 --> 이후 tag 랜더링 진행
*/

// jounal 객체
function NaturalForm () {
	this.type = 'naturalForm';
	// this.values = [];
}
NaturalForm.prototype = {
	AmI : function (type) {
		return (this.type === type);
	},
	getType : function () {
		return this.type;
	},
	hasType : function () {
		try {
			return this.values[0].getType();
		} catch (error) {
			return null;
		}
	},


	push : function (obj) {
		if (this.hasType() !== obj.getType())
			return null;
		return this.values.push(obj);
	},
	pop : function () {
		try {
			return this.values.pop();
		} catch (error) {
			return null;
		}
	},
	unshift : function (obj) {
		if (this.hasType() !== obj.getType())
			return null;
		return this.values.unshift(obj);
	},
	shift : function () {
		try {
			return this.values.shift();
		} catch (error) {
			return null;
		}
	},
	size : function () {
		try {
			return this.values.length;
		} catch (error) {
			return -1;
		}
	},
	

	getValue : function (index) {
		try {
			if (typeof index === 'undefined') {
				return this.values;
			}
			return this.values[index];
		} catch (error) {
			return null;
		}
	},
	getInfo : function () {
		try {
			return this.info;
		} catch (error) {
			return null;
		}
	},

	setProperty : function (propObj) {
		this.property.set(propObj, false);
	},
	getProperty : function (key) {
		if (typeof key === 'undefined') {
			return this.property;
		}
		return this.property.get(key);
	},

	set : function (obj, propObj) {
		var regExp = /\d+$/;
		for (var key in obj) {
			var type = key.replace(regExp, '');
			if (Create.possible(type)) {
				var instance = Create.instance(type);

				var curTypes = Utils.classify(obj[key]);

				// info
				var infoObj = Utils.pickOut(obj, curTypes['string']);
				instance.info = new InfoProperty();
				instance.info.set(infoObj, true);


				// property
				var propObj = Utils.classify(propObj[type]);
				var propObj
				// instance.property = new FormProperty();
				// instance.property.set(propObj[type])

				

				// values
				// var valuesObj = Utils.pickOut(obj, curTypes['object']);

			}



		}



		// init
		// this.info = new InfoProperty();
		// this.values = [];

		// // info
		// var types = Utils.classify(obj);
		// var infoObj = Utils.pickOut(obj, types['string']);
		// this.info.set(infoObj, true);

		// // values
		// var valuesObj = Utils.pickOut(obj, types['object']);
		// var regExp = /\d+$/;
		// for (var key in valuesObj) {
		// 	var type = key.replace(regExp, '');
		// 	if (Create.possible(type)) {
		// 		var instance = Create.instance(type);
		// 		instance.setProperty(propObj[type]);
		// 		instance.set(obj[key], propObj);
		// 		this.values.push(instance);
		// 	}
		// }
	}
};



function JournalSetForm () {
	this.type = 'journalSetForm';
	// this.property = new FormProperty();
}
JournalSetForm.prototype = new NaturalForm();


function JournalForm () {
	this.type = 'journalForm';
	// this.property = new FormProperty();
}
JournalForm.prototype = new NaturalForm();



function SectionForm () {
	this.type = 'sectionForm';
	// this.property = new FormProperty();
}
SectionForm.prototype = new NaturalForm();



function ArticleForm () {
	this.type = 'articleForm';
	// this.property = new FormProperty();
}
ArticleForm.prototype = new NaturalForm();