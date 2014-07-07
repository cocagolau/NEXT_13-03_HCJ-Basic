/*
	journal
	position 값을 갖는다 newRight, right, middle, left, newLeft
	journal의 값을 삭제, 추가 기능이 있음

	json형식으로 출력 --> 이후 tag 랜더링 진행
*/

// jounal 객체
function Natural () {
	this.type = 'natural';
}

Natural.prototype = {
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
			return null;
		}
	},
	

	getValues : function () {
		return this.values;
	},
	getValue : function (index) {
		try {
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
	getProperty : function () {
		try {
			return this.property;
		} catch (error) {
			return null;
		}
	},

	setProperty : function (obj) {
		this.property = obj;
	},

	set : function (obj) {
		this.info
			= (function () {
				var tempObj = {};
				for (var key in obj) {
					if (typeof obj[key] === 'string')
						tempObj[key] = obj[key];
				}
				return tempObj;
			}());

		this.values
			= (function () {
				var tempArray = [];
				for (var key in obj) {
					if (typeof obj[key] === 'object') {

						// obj의 key값 중 뒤 숫자를 제거
						var type = key;  //key값 설정
						for (var i=key.length; i>0; i--) {
							var letter = key.charAt(i-1);
							if (!isNaN(parseInt(letter))) {
								type = type.substring(0,type.length-1);
							}
							else {
								// instance 생성
								// 숫자를 제거한 type값이 instance를 생성할 수 있는지 확인 후 가능하다면 생성
								if (Create.possible(type)) {
									var instance = Create.instance(type);
									instance.set(obj[key]);
									tempArray.push(instance);
								}
								break;
							}
						}
					}
				}
				return tempArray;
			}());
	}
};



function JournalSet () {
	this.type = 'journalSet';
}
JournalSet.prototype = new Natural();


function Journal () {
	this.type = 'journal';
}
Journal.prototype = new Natural();



function Section () {
	this.type = 'section';
}
Section.prototype = new Natural();



function Article () {
	this.type = 'article';
}
Article.prototype = new Natural();