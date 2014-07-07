window.addEventListener('load', initPage, false);

function initPage() {
	var btnSec = document.getElementById('controller');
	var list = document.getElementById('list');
	list.style.left = 0 + 'px';
	
	btnSec.addEventListener('click', function(e) { move(e, e.target.id); }, false);
}

function move(e, id) {
	var list = document.getElementById('list');
	var initLeft = parseInt(list.style.left);

	interval = window.setInterval(function(){
		plus1px(initLeft, id);
	}, 30);

}

function plus1px (initLeft, id) {
	var list = document.getElementById('list');
	var px = 'px';
	var limitPoint = 502;

	var left = parseInt(list.style.left);

	//left
	if (id == 'left') {
		list.style.left = (left-8) + px;
	}
	//right
	else {
		list.style.left = (left+8) + px;
	}

	if (Math.abs(parseInt(list.style.left) - initLeft) >= limitPoint) {
		list.style.left = initLeft + limitPoint
		clearInterval(interval)
	}

}










