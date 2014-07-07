var ratio = 0;
function addRoller (e) {
	var clickedBtn = e.target.parentNode;
	var className = clickedBtn.className;
	// console.log(className + 'Btn clicked');

	roll = setInterval(function() {
		// debugger;
		var journal = document.querySelector('#journals > .'+className);
		var headerWidth = parseInt(window.getComputedStyle(document.querySelector('header'), null).getPropertyValue('width'));
		// console.log(headerWidth);
		var journals = journal.parentNode;
		var limitLine = Math.abs(parseInt(window.getComputedStyle(journal, null).getPropertyValue('left')) * 2 - headerWidth) / 2;

		ratio += 2;
		if (className == 'left') {
			journals.style.left = ratio + '%';
		}
		else {
			journals.style.left = (-ratio) + '%';	
		}
		
		var journalPosition = Math.abs(parseInt(window.getComputedStyle(journals, null).getPropertyValue('left')));

		if (journalPosition >= limitLine) {
			clearInterval(roll);
			loadJournal(className);
			realignJournal();
			ratio=0;
			journals.style.left = '0%';
			
		}
		// console.log('limitLine: ' + limitLine + 'px,   ' + 'journalsPos: ' + pos + 'px');
	}, 15);

	
}