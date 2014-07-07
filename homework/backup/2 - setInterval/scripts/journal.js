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
			// event 등록
			h1Span.addEventListener('click', changeBackColor, false);

			h1.appendChild(h1Span);
			article.appendChild(h1);
			article.appendChild(createElement('h2', articleObj.strapline, null));
			article.appendChild(createElement('address', articleObj.author, null));

			section.appendChild(article);
		}
		elem.appendChild(section);
	}
}

function setMiddleKey(gap) {
	middleKey = getCirculatedKey(journalKeys.length, middleKey, gap);
}


function loadJournal (direction) {
	// debugger;
	// console.log(this)
	var value = valueOfMovement[direction];
	var tempMiddleKey = 2;
	var relativeKey = tempMiddleKey + (value*2);
	var positionClass = ['newleft', 'left', 'middle', 'right', 'newright'];

	// 화면에 출력할 3개 신문사를 담은 리스트 셋팅
	setMiddleKey(value);
	setVisibleKeys();
	setJournalInfo(journalJson[visibleKeys[1]]);

	// 수정할 div 검색 후 내용 추가
	var div = document.querySelector('#journals > .' + positionClass[relativeKey] + ' > .journal');
	console.log(div);
	var contents = journalJson[visibleKeys[value+1]].contents;
 	setContents(div, contents);
 	// debugger;

	// 추가할 div 생성
	var journals = document.querySelector('#journals');
	var journal = document.querySelectorAll('#journals > div');
	if (value == -1) {
		journals.insertBefore(journal[4], journal[0]);
	}
	else {
		journals.appendChild(journal[0]);
	}
}

function realignJournal() {
	// class 변경, .new* 내용 삭제
	var journal = document.querySelectorAll('#journals > div');
	var positionClass = ['newleft', 'left', 'middle', 'right', 'newright'];
	var basicClass = 'jourForm ';
	var regex = /\w+\snew\w+/
	for (var i=journal.length; i>0; i--) {
		if (regex.test(journal[i-1].className = basicClass + positionClass[i-1])) {
			getRealFirstChild(journal[i-1]).innerHTML = "";
		}
	}
	// 재배열
	// realignArticles (getTagsObj('#journals>.middle', 'section', ':nth-of-type(1)', 'article'));
}

function setJournalInfo(obj) {
	// logo
	// debugger;
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