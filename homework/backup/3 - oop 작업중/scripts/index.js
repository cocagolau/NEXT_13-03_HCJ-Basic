window.addEventListener('load', initPage, false);

function initPage() {
	var server = new Server({date:'2013-10-10'});   // var server = Server(init);
	// debugger;
	var rEngine = new RenderingEngine ();

	rEngine.setTemplate (server.getTemplate());

	(function() {
		var initData = server.getInit();

		var journalSet = new JournalSet();
		journalSet.set(initData);

		var initValues = journalSet.getValues();
		initValues.push(new Journal());
		initValues.unshift(new Journal());

		var property = { form : 'jourForm', position : ['newleft', 'left', 'middle', 'right', 'newright'], contents:{} };

		var html = rEngine.getHTML (initValues, property);
		var journals = document.getElementById('journals');
		journals.innerHTML = html;

		// var html = '';
		// var journalPosition = ['newleft', 'left', 'middle', 'right', 'newright'];
		// for (var i=initValues.length; i>0; i--) {
		// 	var value = initValues[i-1];
		// 	var property = {form:'jourForm', position:journalPosition[i-1], contents:journalPosition[i-1]};
		// 	html = tEngine.getHTML(value.getType(), property) + html;
		// }	

		// var journals = document.getElementById('journals');
		// journals.innerHTML = html;
		


		

	}());


	
}