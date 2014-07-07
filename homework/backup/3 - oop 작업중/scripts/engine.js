var RenderingEngine = function () {

	var tEngine = new TemplateEngine();

	function classifyProp (property) {
		var properties = {
			normal : [],
			variable : {},
			recursive : [],
			casesNum : 1
		};
		for (var key in property) {
			var value = property[key];

			if (value instanceof Array) {
				casesNum *= value.length;
				properties[variable][key] = value;
				// delete property[key];
			}
			else if (value instanceof Object) {
				properties[recursive].push(key);
				// delete property[key];
			}
			else {
				properties[normal].push(key);
			}
		}
		return properties;
	}

	function setCases(properties) {
		var cases = [];
		var variKeys = Object.keys(properties[variable]);
		for (var i=0; i<properties[casesNum]; i++) {
			var tempProperty = {};

			for (var j=variKeys.length; j>0; j--) {
				var key = variKeys[j-1];
				var length = properties[variable][key].length;
				tempProperty[key] = properties[variable][key][i%length];
			}

			// 나머지 복사
			for (var index in properties[normal]) {
				var key = properties[normal][index];
				tempProperty[key] = property[key];
			}
			cases.push(tempProperty);
		}
		return cases;
	}

	return (function () {
		var methods = {
			setTemplate : function (template) {
				tEngine.add(template);
			},
			getHTML : function (obj, property) {
				try {
					debugger;
					var cases = getCases(obj, property);

					function getCases() {
						var objKeys = Object.keys(obj);
						var propKeys = Object.keys(property);

						// 조건에 맞게 분류
						var propObj = classifyProp(property);
						// var normal = [];  properties[normal]
						// var variable = {}; properties[variable]
						// var recursive = []; properties[recursive]
						// var casesNum = 1; properties[casesNum]
						
						// 만약 property의 array형식 value를 대상으로 각각의 array.length의 곱이 objKeys.length와 다른경우 종료
						if (casesNum !== objKeys.length)
							return null;

						// 이제 시작
						var caseArr = setCases(propObj);


						return caseArr;
					}
					console.log(cases);


					// function getCases() {
					// 	var objKeys = Object.keys(obj);
					// 	var propKeys = Object.keys(property);

					// 	var normal = [];
					// 	var variable = {};
					// 	var recursive = [];
					// 	var casesNum = 1;
						
					// 	// 조건에 맞게 분류
					// 	classify();
					// 	function classify () {
					// 		for (var key in property) {
					// 			var value = property[key];

					// 			if (value instanceof Array) {
					// 				casesNum *= value.length;
					// 				variable[key] = value;
					// 				delete property[key];
					// 			}
					// 			else if (value instanceof Object) {
					// 				recursive.push(key);
					// 				delete property[key];
					// 			}
					// 			else {
					// 				normal.push(key);
					// 			}
					// 		}
					// 	}
					// 	// 만약 property의 array형식 value를 대상으로 각각의 array.length의 곱이 objKeys.length와 다른경우 종료
					// 	if (casesNum !== objKeys.length)
					// 		return null;

					// 	// 이제 시작
					// 	var cases = [];
					// 	setCases();
					// 	function setCases() {
					// 		var variKeys = Object.keys(variable);
					// 		for (var i=0; i<casesNum; i++) {
					// 			var tempProperty = {};

					// 			for (var j=variKeys.length; j>0; j--) {
					// 				var key = variKeys[j-1];
					// 				var length = variable[key].length;
					// 				tempProperty[key] = variable[key][i%length];
					// 			}

					// 			// 나머지 복사
					// 			for (var index in normal) {
					// 				var key = normal[index];
					// 				tempProperty[key] = property[key];
					// 			}
					// 			cases.push(tempProperty);
					// 		}
					// 	}

					// 	return cases;
					// }
					// console.log(cases);

					//템플릿 엔진 돌림

					var html = '';
					for (var i in cases) {
						html += tEngine.getHTML(obj[i].getType(), cases[i]);
					}
					
					return html;
				} catch (error) {
					return null;
				}
			}

		};

		return methods;
	}());
}



var TemplateEngine = function (template) {
	var templateObj = {};

	if (typeof template !== 'undefined')
		setEngine(template);

	function setEngine(template) {
		if (typeof template !== 'object')
			return null;

		var types = Object.keys(template);
		var regExp = /\{\s{1}\w+\s{1}\}/g;

		for (var i = types.length; i>0; i--) {
			var key = types[i-1]
			var value = template[key];

			var tags = value.split(regExp);
			var attribute = value.match(regExp);

			var valueObj = {
				html : [],
				attribute : {}
			};

			for (var j = attribute.length; j>0; j--) {
				var attributeKey = attribute[j-1].slice(2,-2);  // { title } 중 title을 key로 설정
				valueObj['attribute'][attributeKey] = (j*2)-1;

				valueObj['html'].unshift(tags[j]);
				valueObj['html'].unshift('');
			}
			valueObj['html'].unshift(tags[0]) // tags의 마지막을 입력
			templateObj[key] = valueObj;
		}
	}

	function toString (array) {
		var string = '';
		for (var i=array.length; i>0; i--) {
			string = array[i-1] + string;
		}
		return string;
	}

	return (function () {
		var methods = {
			getHTML : function (type, materials) {
				var templateHTML = templateObj[type]['html'];
				var indexObj = templateObj[type]['attribute'];

				for (var key in materials) {
					templateHTML[indexObj[key]] = materials[key];
				}

				var result = toString(templateHTML);
				
				// 초기화
				for (var key in materials) {
					templateHTML[indexObj[key]] = '';
				}
				return result;
			},

			add : function (template) {
				setEngine(template);
			},

			get : function () {
				return templateObj;
			}
		};

		return methods;
	}());	
};


var LogEngine = function () {

};


var AnimationEngine = function () {

};