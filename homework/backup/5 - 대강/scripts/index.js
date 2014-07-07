window.addEventListener('load', initPage, false);

function initPage() {
	var server = new Server({date:'2013-10-10'});   // var server = Server(init)
	var data = server.getInit();
	var style = server.getStyle();
	
	Template.init(server.getTemplate());

	(function() {

		var journals = document.getElementById('journals');
		
		var tempArr = Template.getHTML(data, style);

		journals.innerHTML = tempArr;



	}());


	
}
