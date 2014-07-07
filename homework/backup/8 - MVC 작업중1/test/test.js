window.addEventListener('load', initPage, false);

function initPage() {
	var rollingBtn = document.querySelectorAll('#controller > a');

	rollingBtn[0].addEventListener('click', addRoller, false);
	rollingBtn[1].addEventListener('click', addRoller, false);
	console.log('loading success');
}

var ratio = 0;
function addRoller (e) {
	var clickedBtn = e.target;
	var className = clickedBtn.className
	console.log(className + 'Btn clicked');

	roll = setInterval(function() {
		
		var journal = rollingBar.querySelector('.'+className);
		var limitLine = window.getComputedStyle(journal, null).getPropertyValue('left');

		if (ratio >= 100) {
			clearInterval(roll);
		}

		ratio += 1;
		if (className == 'left') {
			rollingBar.style.left = ratio + '%';
		}
		else {
			rollingBar.style.left = (-ratio) + '%';	
		}
		
		var pos = window.getComputedStyle(rollingBar, null).getPropertyValue('left');
	}, 15);		
}

