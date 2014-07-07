var Template = (function () {
	var templateObj = {};
	var tempArray = [];
	var tempString = '';
	var resultHTML = null;

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
				this.create(dataObj, propObj);
				this.createString();

				var result = resultHTML;
				resultHTML = null;

				return result;
			},
			createString : function () {
				var tempArr = [];
				var flag = false;
				var sequentialNum = 0;

				for (var i=tempArray.length; i>0; i--) {
					var currArr = tempArray[i-1];
					var index = currArr.lastIndexOf(null);

					if (index === -1) { // null이 없는 경우
						sequentialNum = 0;
						tempString += currArr.join('');
					}
					else {
						if (!flag) { flag=true; }
						if (++sequentialNum < 2) {
							currArr[index] = tempString;
							tempString = '';
						}
						tempArr.unshift(currArr);
					}
					delete tempArray[i-1];
				}
				if (!sequentialNum) {
					resultHTML = tempString;
					tempString = '';
				}
				tempArray = tempArr;
				tempArr = [];
				
				if (flag) { this.createString(); }
			},

			// create : function(dataObj, propObj, conditionObj) {
			create : function(dataObj, propObj) {
				var regExp = /\d+$/;
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
					var form = this.apply(type, unionProp, {}, i);
					tempArray.push(form);
				
					var children = Utils.extract(value, classifiedKeys['object']);
					this.create(children, propObj);
				}
			},
			// 속성적용 
			apply : function (type, propObj, conditionObj, input) {
				var templateHTML = templateObj[type]['html'];

				// 조건에 맞는 property 선택 후 template생성
				var attriObj = {};
				for (var key in propObj) {
					var property = propObj[key];

					// object인 경우, selection in property Array
					if (property instanceof Object) {
						for (var condition in property) {
							property = property[condition];  // 위 property obj에 덮어씀

							var func = this.select(condition);
							// custom or default일 경우
							if (!func && conditionObj && conditionObj.hasOwnProperty(key)) {
								func = conditionObj[key];
							}
							var index = func(input);
							property = property[index];  // 위 property array에 덮어씀
						}
					}
					attriObj[key] = property;
				}
				return this.toArray(type, attriObj);
			},

			toArray : function (type, attriObj) {

				// init function이 실행되지 않은 경우
				// 'need to excute \'Template.init(template)\' function';
				if (!Object.keys(templateObj).length || typeof type === 'undefined' || !attriObj)
					return null; 

				var formArr = [];
				var type = templateObj[type];
				
				var html = type['html'];
				var htmlLength = html.length;
				var attriIndex = type['attriIndex'];

				for (var i=0; i<htmlLength; i++) {
					formArr.push(html[i]);

					if (attriObj) {
						var attriKey = null;
						if (attriKey = attriIndex[i]) {  // attriObj와 할당받은 attriKey가 존재할 경우만 실행
							if (attriObj.hasOwnProperty(attriKey)) {
								formArr.push(attriObj[attriKey]);
							}
							else { // attriKey가 없는 경우
								formArr.push(null);
							}
						}
					}
				}
				return formArr;
			},

			// condition: forward, backward, random, custom
			select : function (condition) {
				switch (condition) {
					case 'forward' :
						return function (input) {
							return input;
						};
					case 'backward' :
						return;
					case 'random' :
						return;
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

			get : function () {
				return templateObj;
			}
		};

		return methods;
	}());	
}());