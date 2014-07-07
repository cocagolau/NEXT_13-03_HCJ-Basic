window.addEventListener('load', initPage, false);

function initPage() {
	var server = new Server({date:'2013-10-10'});   // var server = Server(init);
	// debugger;
	var rEngine = new RenderingEngine ();

	rEngine.setTemplate (server.getTemplate());

	(function() {

		var initData = server.getInit();
		var initFPropObj = {
			'journal' : {form:'jourForm', position:['newleft', 'left', 'middle', 'right', 'newright']},
			'article' : {importance:'a1'}
		};

		var journalSetForm = new JournalSetForm();
		journalSetForm.push(new JournalForm());  //newRight
		journalSetForm.unshift(new JournalForm()); //newLeft

		journalSetForm.set(initData, initFPropObj);
		console.log(journalSetForm);
		// var initValues = journalSet.getValues();
		// debugger;
		

		

		// journalSetForm.setProperty(initFPropObj);
		// var propObj = { form: 'jourForm', position: ['newleft', 'left', 'middle', 'right', 'newright'] }
		// var jourFormPos = ['newleft', 'left', 'middle', 'right', 'newright'];
		// var values = journalSetForm.getValue();
		// for (var i in values) {
		// 	var value = values[i];
		// 	value.setProperty();
		// 	rEngine.addTempHTML(value);
		// console.log(rEngine.getTemporary());
		// console.log(rEngine.bindHTML());
		// console.log(rEngine.getTemporary());


	}());


	
}