function realignArticles(elem, clientWidth) {
	// do something
	var section = elem.querySelectorAll('section');
	var sectionLength = section.length;
	var maxWidthOfArticle = clientWidth * maxWidthRatio;
	var line = {};
	var px = 'px';

	// section 존재시 실행
	if (sectionLength) {
		for (var i=0; i<sectionLength; i++) {
			var article = section[i].childNodes;
			var articleLength = article.length;

			// article 존재, 그리고 line obj에 해당 section이 key가 아닌 경우
			if (articleLength && line.hasOwnProperty(section[i])) {
				var lineAtSection = {};
				var articlesAtLine = [];
				var lineNumber = 1;
				var availClientWidth = 0;

				for (var j=1; j<articleLength; j++) { //section firstChild<h1> 제외
					// 이용가능한 clientWidth가 0인 경우 기본값을 재지정
					if (availClientWidth == 0) {
						availClientWidth = clientWidth;
					}

					var presentWidth = parseInt(window.getComputedStyle(article[j],null).getPropertyValue('width'));
					// presentWidth가 최대width를 넘는지 확인 후 넘으면 최대width로 고정
					if (presentWidth >= maxWidthOfArticle) {
						article[j].style.width = maxWidthOfArticle + px;
						presentWidth = maxWidthOfArticle;
					}

					// 이용가능한 clientWidth 확인
					if (availClientWidth < presentWidth) {
						// 남은 공간이 presnetWidth의 60% 이상인 경우 출력
						if (availClientWidth >= presentWidth * remainWidthRatio) {
							article[j].style.width = availClientWidth + px;
							availClientWidth = 0;
						}
						// 미만인경우 해당라인의 부족분에 우선적 배분
						else {
							// for (var k=1; k<lineNumber; k++) {
							// }
							availClientWidth = 0;
						}
					}

					// line배열에 추가
					articlesAtLine.push(article[j]);
					// 이용가능한 clientWidth가 0인 경우
					// lineAtSection obj에 lineNumber를 key로 articlesAtLine배열을 value로 등록 후 lineNubmer 증가
					if (availClientWidth == 0) {
						lineAtSection[lineNumber++] = articlesAtLine;
						// 배열 초기화 및 lineNumber 증가
						articlesAtLine = [];
					}
				}
			}
		}
	}
}