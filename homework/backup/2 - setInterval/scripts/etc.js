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

			var ratio = (artiHeight/artiWidth) * articleClassRatio[article.className];
			articleRatioObj[ratio] = article;
		}
		console.log(articleRatioObj);
	}
}

function changeBackColor(e) {
	var cur = e.currentTarget;
	var display = window.getComputedStyle(cur, null).getPropertyValue('display');
	console.log(display);
	if (display == 'inline') {
		cur.parent.nextSibling.style.display = 'none';
		cur.parent.nextSibling.nextSibling.style.display = 'none';
	} else if (display == 'none') {
		cur.nextSibling.style.display = 'inline';
		cur.nextSibling.nextSibling.style.display = 'inline';
	}
}