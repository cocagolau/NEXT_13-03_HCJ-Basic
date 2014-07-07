window.addEventListener('load', initPage, false);


var articleClassRatio = {'a1':1.5, 'a2':1.2, 'a3':1};
var articlesPerLine = 3;


function initPage() {
	// available width of body;
	var midJournal = document.querySelector('#journals > .middle');
	availWidth = midJournal.clientWidth-10;

	// resize test
	// console.log(availWidth);
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
 		var journals = document.querySelector('#journals > div:nth-of-type('+(i+2)+') > div');
 		var currentJournal = visibleKeys[i];
 		
 		setContents(journals, journalJson[currentJournal].contents);
 	}
 	// realignArticles (getTagsObj('#journals>.middle', 'section', ':nth-of-type(1)', 'article'));
}





function setController() {
	var controller = document.querySelectorAll('#controller > div');
	
	for (var i = controller.length; i>0; i--) {
		// controller[i-1].addEventListener('click', loadJournal, false);
		controller[i-1].addEventListener('click', addRoller, false);
	}
}




