window.onload = initPage;
var articleClassRatio = {'a1':1.5, 'a2':1.2, 'a3':1};
var articlesPerLine = 3;


function initPage() {
	// available width of body;
	var midJournal = document.querySelector('#journals > .middle');
	availWidth = midJournal.clientWidth-10;
	console.log(availWidth);
	window.onresize = (function() {
		availWidth = midJournal.clientWidth-10;
		realignArticles (getTagsObj('#journals>.middle', 'section', ':nth-of-type(1)', 'article'));
	});

	journalKeys = getRandomKeys(journalJson);
	visibleKeys = [];
	middleKey = 1;
	valueOfMovement = {'left':-1, 'right':1};
	
	setVisibleKeys();
	setJournalInfo(journalJson[visibleKeys[1]]);
	setController();

 	for (var i=0; i<3; i++) {
 		var journals = document.querySelector('#journals > div:nth-of-type('+(i+2)+')');
 		var currentJournal = visibleKeys[i];
 		
 		setContents(journals, journalJson[currentJournal].contents);
 	}
 	realignArticles (getTagsObj('#journals>.middle', 'section', ':nth-of-type(1)', 'article'));
}

function realignArticles (tagsObj) {
	var keys = Object.keys(tagsObj);
	var keysLength = keys.length;
	var lineNumber = 1;
	var availWidth = 0;

	// journal별
	for (var i=0; i<keysLength; i++) {
		var section = keys[i];
		var articleArr = tagsObj[section];
		var articleArrLength = articleArr.length;
		var px = 'px';

		if (availWidth) { availWidth = width; }
		var articleRatioObj = {};
		// articleArr
		for (var j=0; j<articleArrLength; j++) {
			var article =articleArr[j];
			var h1Span = article.querySelector('h1 > span');
			var h1SpanWidth = parseInt(h1Span.offsetWidth);
			var h2 = article.querySelector('h2').style.width = (h1SpanWidth*0.94)+px;
			var artiWidth = parseInt(window.getComputedStyle(article,null).getPropertyValue('width'));
			var artiHeight = parseInt(window.getComputedStyle(article,null).getPropertyValue('height'));

			var ratio = (artiHeight*/artiWidth) * articleClassRatio[article.className];
			articleRatioObj[ratio] = article;
		}
		console.log(articleRatioObj);
	}
}


function setContents(elem, contents) {
	var sections = Object.keys(contents);
	var sectionsLength = sections.length;
	for (var i=0; i<sectionsLength; i++) {
		var sectionObj = contents[sections[i]];
		var section = createElement('section', null, null);
		section.appendChild(createElement('h1', sections[i], null));

		// article 생성
		var articles = Object.keys(sectionObj);
		var articlesLength = articles.length;

		for (var j=0; j<articlesLength; j++) {
			var articleObj = sectionObj[articles[j]];
			var classname = (function(num) {
				if (num >= 35)
					return 'a1';
				else if (num >= 22)
					return 'a2';
				else
					return 'a3';
			})(parseInt(articleObj.ratio));
			var attributeObj = {'class':classname};
			var article = createElement('article', null, attributeObj);
			var h1 = createElement('h1', null, null);
			var h1Span = createElement('span', articleObj.title, null);
			h1.appendChild(h1Span);
			article.appendChild(h1);
			article.appendChild(createElement('h2', articleObj.strapline, null));
			article.appendChild(createElement('address', articleObj.author, null));

			section.appendChild(article);
		}
		elem.appendChild(section);
	}
}

function setController() {
	var controller = document.querySelectorAll('#controller > a');
	
	for (var i = controller.length; i>0; i--) {
		controller[i-1].addEventListener('click', moveJournal);
	}
}

function setVisibleKeys () {
	visibleKeys = [];
	var maxKey = journalKeys.length-1;

	if (middleKey == 0) {
		visibleKeys.push(journalKeys[maxKey]);
		visibleKeys.push(journalKeys[0]);
		visibleKeys.push(journalKeys[1]);
	}
	else if (middleKey == maxKey) {
		visibleKeys.push(journalKeys[maxKey-1]);
		visibleKeys.push(journalKeys[maxKey]);
		visibleKeys.push(journalKeys[0]);
	}
	else {
		visibleKeys = journalKeys.slice((middleKey-1), (middleKey+2));
	}
}


function setMiddleKey(gap) {
	middleKey = getCirculatedKey(journalKeys.length, middleKey, gap);
}


function moveJournal () {
	var value = valueOfMovement[this.className];
	var tempMiddleKey = 2;
	var relativeKey = tempMiddleKey + (value*2);
	var basicClass = 'journal ';
	var positionClass = ['newleft', 'left', 'middle', 'right', 'newright'];

	// 화면에 출력할 3개 신문사를 담은 리스트 셋팅
	setMiddleKey(value);
	setVisibleKeys();
	setJournalInfo(journalJson[visibleKeys[1]]);

	// 수정할 div 검색 후 내용 추가
	var div = document.querySelector('#journals > .' + positionClass[relativeKey]);
	var contents = journalJson[visibleKeys[value+1]].contents;
 	setContents(div, contents);

	// 추가할 div 생성
	var journals = document.querySelector('#journals');
	var journal = document.querySelectorAll('#journals > div');
	if (value == -1) {
		journals.insertBefore(journal[4], journal[0]);
	}
	else {
		journals.appendChild(journal[0]);
	}

	// class 변경, .new* 내용 삭제
	journal = document.querySelectorAll('#journals > div');
	var regex = /\w+\snew\w+/
	for (var i=journal.length; i>0; i--) {
		if (regex.test(journal[i-1].className = basicClass + positionClass[i-1])) {
			journal[i-1].innerHTML = "";
		}
	}

	// 재배열
	realignArticles (getTagsObj('#journals>.middle', 'section', ':nth-of-type(1)', 'article'));
}

function setJournalInfo(obj) {
	// logo
	var logoParent = removeChild(document.querySelector('#journalLogo > a'));
	var logo = document.createTextNode(obj.title);
	logoParent.appendChild(logo);

	// version
	var versionParent = removeChild(document.querySelector('#version > a'));
	var version = document.createTextNode(obj.info.version);
	versionParent.appendChild(version);

	// issue
	var issueParent = removeChild(document.querySelector('#issue > a'));
	var issue = document.createTextNode(obj.info.issue);
	issueParent.appendChild(issue);
}