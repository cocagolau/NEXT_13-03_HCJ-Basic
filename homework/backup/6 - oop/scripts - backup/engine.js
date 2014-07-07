var RenderingEngine = function () {

	var tEngine = new TemplateEngine();
	var temporary = [];

	return (function () {
		var methods = {
			setTemplate : function (template) {
				tEngine.add(template);
			},
			getHTML : function (obj) {
				try {
					return tEngine.getHTML(obj.getType(), obj.getProperty());
				}
				catch (error) {
					return null;
				}
			},
			addTemp : function (html) {
				return temporary.push(html);
			},
			addTempHTML : function (obj) {
				try {
					return this.addTemp(this.getHTML(obj));
				} catch (error) {
					return null;
				}
			},
			bindHTML : function () {
				var html = '';
				for (var i=temporary.length; i>0; i--) {
					html = html + temporary.pop();
				}
				return html;
			},
			getTemporary : function () {
				return temporary;
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
			var key = types[i-1];
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
			templateObj[key+'Form'] = valueObj;
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
			getHTML : function (type, propObj) {
				var templateHTML = templateObj[type]['html'];
				var indexObj = templateObj[type]['attribute'];

				for (var key in propObj) {
					templateHTML[indexObj[key]] = propObj[key];
				}
				var result = toString(templateHTML);
				
				// 초기화
				for (var key in propObj) {
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