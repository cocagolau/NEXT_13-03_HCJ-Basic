var News = (function () {

	// rendering Engine
	// templateModel
	var TemplateModel = function(templateName, htmlArr, attributeIndex) {
		this.templateName = templateName;
		this.htmlArr = htmlArr;
		this.attributeIndex = attributeIndex;
	};
	TemplateModel.prototype = {
		toHTML : function(newsModel) {
			if (!(newsModel instanceof NewsModel))
				return this.htmlArr.join('');

			var style = newsModel.style;
			var data = newsModel.data;
		
			var templateArr = this.htmlArr.slice(0);

			
			for (var key in style) {
				if (style.hasOwnProperty(key)) {
					var value = style[key];
					
					if (!value) {
						value = data[key];
					}
					var index = style.getIndex(key)+1;
					style.resetIndex(key);

					templateArr.splice(index,0,value);
				}
			}
			return templateArr.join('');
		},
		moldStyleModel : function() {
			var styleModel = new StyleModel();

			for (var key in this.attributeIndex) {
				styleModel.put(this.attributeIndex[key]);
			}

			return styleModel;
		}
	};

	var StyleModel = function () {
		Object.defineProperty(this, 'styleOrder', { value:[], writable:true, enumerable:false, configurable:true });
		Object.defineProperty(this, 'styleIndex', { value:{}, writable:true, enumerable:false, configurable:true });
	};
	StyleModel.prototype = {
		put : function(key) {
			this[key] = null;
			this.styleIndex[key] = this.styleOrder.push(key)-1;
		},
		canHaveProperty : function(key) {
			// styleOrder에 존재할 경우 가질 수 있는 property
			return (this.getIndex(key) === -1) ? false : true;
		},
		maxLength : function () {
			return this.styleOrder.length;
		},
		length : function () {
			return Object.keys(this).length;
		},
		getIndex : function(key) {
			return this.styleIndex[key];
		},
		getOrder : function(key) {
			return this.styleOrder.indexOf(key);
		},
		resetIndex : function(key) {
			var order = this.getOrder(key);
			for (var i = this.maxLength()-1; i>order; i--) {
				var key = this.styleOrder[i];
				this.styleIndex[key]++;
			}
		},
		set : function (styleObj) {
			for (var key in styleObj) {
				var style = styleObj[key];
				this.setStyle(key, style);
			}
		},
		setStyle : function(key, style) {
			// 해당 property에 저장 후 index 변화해주는 연산
			if (this.hasOwnProperty(key)) {
				this[key] = style;  // object의 key이름의 property에 style저장
			}
			
		}
	};


	var Templates = function(styleObj) {
		this.styleObj = styleObj;
		this.templates = null;
		this.relation = ['rootNews', 'journal', 'section', 'article']; // 추가 필요
	}
	Templates.prototype = {
		init : function(templateObj) {
			if (!templateObj instanceof Object) return null;

			var regExp = /\{\s{1}\w+\s{1}\}/g;
			var templates = {};

			for (var templateName in templateObj) {
				var value = templateObj[templateName];
				var tags = value.split(regExp);
				var attriIndex = value.match(regExp);

				var styleModel = new StyleModel();
				var htmlArr = [];
				var attributeIndex = [];

				// refactoring 필요
				for (var j = attriIndex.length; j>0; j--) {
					var attriKey = attriIndex[j-1].slice(2,-2);  // { title } 중 title을 key로 설정
					htmlArr.unshift(tags[j]);
					attributeIndex.unshift(attriKey);
				}
				htmlArr.unshift(tags[0]); // tags의 마지막을 입력

				// templateModel 생성
				templates[templateName] = new TemplateModel(templateName, htmlArr, attributeIndex);
			}
			this.templates = templates; // this.templates를 대체
		},
		getRelation : function(templateName) {
			if (typeof templateName === 'undefined') {
				return this.relation;
			}
			else {
				return this.relation.indexOf(templateName);
			}

		},


		get : function(templateName) {
			if (typeof templateName === 'undefined')
				return this.templates;
			else
				return this.templates[templateName];
		},

		render : function (newsModel, recursive) {
			var rootModel = newsModel;
			var rootTemplateModel = this.get(rootModel.newsName);

			// recursive에 필요한 template을 toHTML하여 rootNewsModel의 style에 저장
			// newsModel이 children을 가지고 있는가?
			if (recursive && rootModel.hasChild()) {
				var children = rootModel.getChild();
				var subHTMLArr = [];

				// newsModel의 childModel을 방문하여 toHTML값을 반환
				for (var child in children) {
					var childModel = children[child];

					var childName = childModel.newsName;
					var childTemplateModel = this.get(childName);

					//recursive
					var subHTML = this.render(childModel, recursive);
					subHTMLArr.push(subHTML);
				}
				// 반환된 값을 newModel.syle의 childModel의 key값에 value로 저장
				if (rootModel.newsName === 'rootNews')
					return subHTMLArr.join('');
				
				rootModel.style.setStyle(childName, subHTMLArr.join(''));
			}
			// return rootTemplateModel.toHTML(rootModel.style);
			return rootTemplateModel.toHTML(rootModel);
		}
	}

	var LayerModel = function(layerRelation) {
		this.layerRelation = layerRelation;
		this.layersByWeight = this.init(layerRelation);
		this.shortlyBefore = null;
	};
	LayerModel.prototype = {
		weightOf : function(layerName) {
			return this.layerRelation.indexOf(layerName);
		},
		init : function(weight) {
			// layer의 수만큼 초기화 값(0)을 반환
			if (weight instanceof Array) {
				var temp = weight.map(function() {
					return 0;
				});
				return temp;
			}
			this.layersByWeight[weight] = 0;
		},
		get length() {
			return this.layersByWeight.length;
		},

		put : function(layerName) {
			// 숫자 삽입
			var weight = this.weightOf(layerName);
			this.layersByWeight[weight] += 1;

			// shortlyBefore가 존재할 경우 이전에 삽입된 것과 비교
			if (this.shortlyBefore) {
				var compareResult = this.compareBefore(layerName);

				//// 이전보다 상위 모델일 경우, 하위 모델들을 모두 초기화
				if (compareResult == -1) {
					for (var i=this.length-1; i>weight; i--){
						this.init(i);
					}
				}
			}
			// 다음에 사용하기 위해 현재layer를 shortlyBefore에 등록
			this.shortlyBefore = layerName;

			return this.layersByWeight[weight];
		},
		compareBefore : function(currentLayerName) {
			var beforeWeight = this.weightOf(this.shortlyBefore);
			var currentWeight = this.weightOf(currentLayerName);

			// Weight값이 작을 수록 상위단계
			// current가 상위모델인 경우 -1, 같은 경우 0, 하위 모델인 경우 1;
			if (beforeWeight === currentWeight)
				return 0;

			return (beforeWeight > currentWeight) ? -1 : 1;
		}
	};

	// view
	// journal Model -> render
	// elementId: ScrollView의 결과가 출력될 부분,   styleObj: dataObj에 적용될 style이 담긴 객체
	var ScrollView = function(elementId, templateObj, styleObj) {
		this.templates = new Templates(styleObj);
		this.templates.init(templateObj);

		this.styleFunction = {
			forward : function (input, range) {
				return input%range;
			},
			backward : function (input, range){
				return (range - this.forward(input, range));
			},
			random : function (input, limit) {
				return Utils.getRandom(limit);
			}
		};

		this.elementId = elementId;
		this.scrollNews = null;

		this.leftBtn = null;
		this.rightBtn = null;
	};	
	ScrollView.prototype = {
		update : function() {

		},

		setEvent : function(btnQuery) {

		},

		move : function(direction) {

		},

		render : function() {
			try {
				var root = this.scrollNews.getModel();
				var container = document.getElementById(this.elementId);

				var traversal = root.traversal();
				var layer = new LayerModel(this.templates.getRelation());

				for (var j=traversal.length; j>0; j--){
					var node = traversal[j-1];

					if (node.newsName === 'rootNews') continue;

					var input = layer.put(node.newsName);
					this.dressStyle(node, input);
				}
				var HTMLOfRoot = this.templates.render(root, true);
				container.innerHTML = HTMLOfRoot;
			}
			catch(error) {
				console.log(error);
			}
		},

		dressStyle : function(newsModel, input) {			
			var newsName = newsModel.newsName;
			var style = this.templates.styleObj[newsName];
			var templateModel = this.templates.get(newsName);
			var styleModel = templateModel.moldStyleModel();
	
			// styleObj
			var classifiedKey = Utils.classify(style);
			var styleObj = Utils.extract(style, classifiedKey.string);
			var subStylesKey = classifiedKey.array;

			// callback Function
			if (classifiedKey.array.length) {
				var selectStyle = function(subStyles, input) {
					var funcName = subStyles[0];
					var func = this[funcName];
					var index = func(input, subStyles.length-1);

					return subStyles[index+1];
				};
				var selectStyle = selectStyle.bind(this.styleFunction);
				styleObj[subStylesKey] = selectStyle(style[subStylesKey[0]], input);
			}
			// styleObj ////////
			styleModel.set(styleObj);
			newsModel.style = styleModel;
		},

		setScrollNews : function (scrollNews) {
			this.scrollNews = scrollNews;
		}

	};




	// model
	// NewsChainModel
	var NewsChainModel = function (parentModel) {
		this.parentModel = parentModel;
		this.childModels = [];
	};
	NewsChainModel.prototype = {
		set pushChild(childModel) {
			this.childModels.push(childModel);
		},
		set unshiftChild(childModel) {
			this.childModels.unshift(childModel);
		},

		getChild : function (index) {
			if (typeof index !== 'number' || index >= this.childModels.length || index < 0)
				return this.childModels;

			return this.childModels[index];
		}
	};


	// NewsModel
	var NewsModel = function (newsId, newsName, parentModel) {
		this.listeners = new Array();

		this.newsId = newsId;
		this.newsName = newsName;
		this.newsChain = new NewsChainModel(parentModel);
		this.dataObj = null;
		this.styleModel = null;
	};
	NewsModel.prototype = {
		init : function(dataObj) {
			try {
				//id와 name을 구분함
				var regExpOfId = /\d+$/;
				var regExpOfName = /^\D+/;

				// 생성된 NewsModel 기준으로 childModel을 순회하며 생성
				for (var key in dataObj) {
					var value = dataObj[key];  // string:dataObj, object:NewsModel
					var classifiedKey = Utils.classify(value);

					// recursive create childModel
					if (classifiedKey.string.length || classifiedKey.object.length) {
						var childId = parseInt(key.match(regExpOfId)[0]);
						var childName = key.match(regExpOfName)[0];

						var childModel = new NewsModel (childId, childName, this);
						childModel.dataObj = Utils.extract(value, classifiedKey.string);

						// 현재 newsChain의 자식으로 등록
						this.newsChain.pushChild = childModel;

						var childDataObj = Utils.extract(value, classifiedKey.object);
						childModel.init(childDataObj);
					}
				}
			}
			catch(error) {
				console.log(error);
			}
		},

		hasChild : function() {
			return (this.getChild().length > 0);
		},
		getChild : function (index) {
			return this.newsChain.getChild(index);
		},

		traversal : function (inorderArr) {
			// debugger;
			if (typeof inorderArr === 'undefined' || !inorderArr instanceof Array) {
				var inorderArr = [];
			}
			return (function(curModel) {

				if (curModel.hasChild() || curModel.newsName === 'article') {
					inorderArr.push(curModel);
					var childLength = curModel.getChild().length;
					
					for (var i=0; i<childLength; i++) {
						var tempArr = curModel.getChild(i).traversal(inorderArr);
						inorderArr = tempArr;
					}
				}
				return inorderArr;
			}(this));

		},
		set style(styleModel) {
			this.styleModel = styleModel;
		},
		get style() {
			return this.styleModel;
		},
		get data() {
			return this.dataObj;
		},

		addListener : function(listener) {
			this.listeners[this.listeners.length] = listener;
		},
		removeListener : function(listener) {
			if (this.listeners.length == 0) return;

			var newListeners = new Array();
			for (var i=0; i<this.listeners.length; i++) {
				if (this.listeners[i] !== listener) {
					newListeners[newListeners.length] = this.listeners[i];
				}
			}
		},
		notify : function() {
			for (var i=0; i<this.listeners.length; i++) {
				this.listeners[i].changed(this);
			}
		}
	};
	
	//Event View
	var EventMonitor = function(controller) {
		this.controller = controller;
	};
	EventMonitor.prototype = {
		doClick : function(e) {
			var target = e.target;
			switch (target.getAttribute('data-direction')) {
				case 'right' :
					this.controller.setDirection('right');
					break;
				case 'left' :
					this.controller.setDirection('left');
					break;
				default :
					console.log('Event Error');
			}
		},
		setEvent : function(varName, eventType, query) {
			this[varName] = (function() {
				return document.querySelectorAll(query);
			}());

			for (var i=0; i<this[varName].length; i++) {
				var newVar = this[varName][i];
				newVar.addEventListener(eventType, this.doClick, false);
			}

		}
	}


	// controller
	// IO monitor, input:left, right btn    ,output:journals Div
	var ScrollNews = function(newsModel, scrollView) {
		this.model = newsModel;
		this.view = scrollView;

		this.model.addListener(this);
		this.view.setScrollNews(this);

		this.view.render();
	};
	ScrollNews.prototype = {
		getModel : function() {
			return this.model;
		},
		setDirection : function(direction) {
			
		},

		changed : function() {
			this.view.update();
		}
	};




	var myNews = function (server, elementId) {
		// server
		this.server = server;
		
		// model
		this.rootNews = new NewsModel('root', 'rootNews', null);
		this.rootNews.init(server.getInit());

		// view
		this.scrollView = new ScrollView(elementId, server.getTemplate(), server.getStyle());
		
		// controller
		this.scrollNews = new ScrollNews(this.rootNews, this.scrollView);

		// monitor
		this.eventMonitor = new EventMonitor(this.scrollNews);
		this.eventMonitor.setEvent('outerBtns', 'click', '#container > button[data-position="outer"]');

	};

	return myNews;

}());