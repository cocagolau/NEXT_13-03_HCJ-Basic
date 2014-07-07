function pageResize() {
	var container = document.querySelector('#container');
	var max = 640;
	var min = 400;
	var num = 0;

	var columns = getColumns(max, min);

	for (var colName in columns) {
		if (colName != 'extra') {
			num += columns[colName];	
		}
		else {
			var extra = columns[colName];  // undefined
			num++;
		}
	}
	console.log('colNum: ' + num + ',  extra: ' + extra);

	for (var i=num; i>0; i--) {
		var div = document.createElement('div');
		var p = document.createElement('p');
		var text = 'i: ' + i;
		var textNode = document.createTextNode(text);
		p.appendChild(text);
		div.appendChild(p);
		container.appendChild(div);
	}
}


function getColumns(maxColumnSize, minColumnSize) {
	var availScreenWidth = document.body.clientWidth;
	var columns = {};
	columns.max = 0;
	columns.min = 0;

	// 1280 이상시
	if (availScreenWidth >= (maxColumnSize*2)) {
		var numOfMaxCol = Math.floor(availScreenWidth / maxColumnSize);
		columns.max = numOfMaxCol-1;
		availScreenWidth -= (maxColumnSize * columns.max);
	}


	// 1280 미만시
	// 800 미만시
	if (availScreenWidth < (minColumnSize*2)) {
		if (availScreenWidth >= maxColumnSize) {
			columns.max++;
			availScreenWidth -= maxColumnSize;
		}
	}
	// 800이상 1040미만
	else if (availScreenWidth >= (minColumnSize*2) && availScreenWidth < (maxColumnSize+minColumnSize)) {
		columns.min ++;
		availScreenWidth -= minColumnSize;
	}
	else {
		columns.max++;
		availScreenWidth -= maxColumnSize;
	}

	// 나머지 400 이상시
	if (availScreenWidth >= 400) {
		columns.extra = availScreenWidth;
	}

	return columns;
}