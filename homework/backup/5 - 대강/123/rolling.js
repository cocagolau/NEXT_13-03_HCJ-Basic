window.addEventListener('load', initPage, false);

function initPage() {
	var btnSec = document.getElementById('controller');
	
	btnSec.addEventListener('click', function(e) { move(e, e.target.id); }, false);
}

function move(e, id) {
	var list = document.getElementById('list');
	var num = 502;
	var px = 'px';

	if (id === 'left') {
		num = -num;
	}

	if (list.style.left) {
		list.style.left = parseInt(list.style.left) + num + px;

	} else {
		list.style.left = num + px;
	}
}