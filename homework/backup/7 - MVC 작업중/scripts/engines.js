var TemplateEngine = (function () {
	var templateObj = {};

	function setEngine(template) {
		if (typeof template !== 'object')
			return null;

		var regExp = /\{\s{1}\w+\s{1}\}/g;
		for (var type in template) {
			var value = template[type];
			var tags = value.split(regExp);
			var attriIndex = value.match(regExp);
			var valueObj = { html:[], attriIndex:[], attributes:{} };  // attriIndex를 기준으로 html과 attributes를 연결

			// refactoring 필요
			for (var j = attriIndex.length; j>0; j--) {
				var attriKey = attriIndex[j-1].slice(2,-2);  // { title } 중 title을 key로 설정
				valueObj['attriIndex'].unshift(attriKey);
				valueObj['attributes'][attriKey] = '';
				valueObj['html'].unshift(tags[j]);
			}
			valueObj['html'].unshift(tags[0]) // tags의 마지막을 입력
			templateObj[type] = valueObj;
		}
	}

	return (function () {
		var methods = {
			getHTML : function(dataObj, propObj) {
				var divided = this.divideProperty(dataObj, propObj);
				return this.toString(divided);
			},
			// create : function(dataObj, propObj, conditionObj) {
			divideProperty : function(dataObj, propObj) {
				var tempArray = [];
				var regExp = /\d+$/;
				var result = function(dataObj, propObj, here) {
					var keys = Object.keys(dataObj);
					var length = keys.length;
					
					for (var i=0; i<length; i++) {
						var key = keys[i];
						var value = dataObj[key];
						var type = key.replace(regExp, '');  //type: journal, section, article

						var classifiedKeys = Utils.classify(value);

						// property
						var infoProp = Utils.extract(value, classifiedKeys['string']);
						var unionProp = Utils.union(propObj[type], infoProp);

						// 조건에 맞는 property 적용 후 Array로 변환
						var form = here.byArray(type, unionProp, {}, i);
						tempArray.push(form);
					
						var children = Utils.extract(value, classifiedKeys['object']);

						if (typeof children !== 'undefined') {
							result(children, propObj, here);
						}
					}
				};
				result(dataObj, propObj, this);
				return tempArray;
			},

			toString : function (dividedArr) {
				var tempArr = [];
				var flag = false;
				var sequentialNum = 0;
				var result = null;
				var tempString = '';

				for (var i=dividedArr.length; i>0; i--) {
					var currArr = dividedArr[i-1];
					var index = currArr.lastIndexOf(null);

					if (index === -1) { // null이 없는 경우
						sequentialNum = 0;
						tempString += currArr.join('');
					}
					else {
						if (!flag) { flag=true; }  // recursive flag
						if (++sequentialNum < 2) { // array 속 null에 데이터 저장	
							currArr[index] = tempString;
							tempString = '';
						}
						tempArr.unshift(currArr);
					}
					delete dividedArr[i-1];
				}
				  // null이 연속나오지 않은 경우 하위 null이 없다는 의미 결과값 반환
				if (!sequentialNum)	{
					return tempString;
				}
				if (flag) {
					dividedArr = tempArr;
					tempArr = [];
					tempString = '';
					result = this.toString(dividedArr);
				}
				return result;
			},

			byArray : function (type, propObj, conditionObj, input) {
				var type = templateObj[type];
				
				var html = type['html'];
				var attriIndex = type['attriIndex'];
				var attriKey = null;

				var htmlLength = html.length;
				var resultArr = [];

				// 조건에 맞는 property 선택 후 template생성
				var attriObj
					= (function(here) {
						var tempObj = {};
						for (var key in propObj) {
							var property = propObj[key];

							// object인 경우, selection in property Array
							if (property instanceof Object) {
								for (var condition in property) {
									property = property[condition];  // 위 property obj에 덮어씀

									var func = here.selectFunc(condition);
									// custom or default일 경우
									if (!func && conditionObj && conditionObj.hasOwnProperty(key)) {
										func = conditionObj[key];
									}
									var index = func(input, property.length);

									property = property[index];  // 위 property array에 덮어씀
								}
							}
							tempObj[key] = property;
						}
						return tempObj;
					}(this));

			
				for (var i=0; i<htmlLength; i++) {
					resultArr.push(html[i]);
					
					if (attriKey = attriIndex[i]) { 
						// attriObj와 할당받은 attriKey가 존재할 경우만 실행
						if (attriObj.hasOwnProperty(attriKey)) {
							resultArr.push(attriObj[attriKey]);
						}
						else {
							resultArr.push(null);
						}
					}
				}
				return resultArr;
			},

			// condition: forward, backward, random, custom
			selectFunc : function (condition) {
				switch (condition) {
					case 'forward' :
						return function (input, range) {
							return input%range;
						};
					case 'backward' :
						return;
					case 'random' :
						return function (input, limit) {
							return Utils.getRandom(limit);
						};
					default :
						return false;  // 어떻게 처리하지??
				}
			},
			
			init : function (template) {
				templateObj = {};
				this.add(template);
			},

			add : function (template) {
				setEngine(template);
			},

			get : function (key) {
				if (typeof key === 'undefined')
					return templateObj;
				else
					return templateObj[key];
			}
		};

		return methods;
	}());	
}());