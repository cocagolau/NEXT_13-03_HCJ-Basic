window.addEventListener('load', initPage, false);

function initPage() {
	var server = new Server({date:'2013-10-10'});   // var server = Server(init)
	var data = server.getInit();
	var style = server.getStyle();
	
	TemplateEngine.init(server.getTemplate());

	var offsetHeight = 30;
	var headerHeight = 45;
	var windowHeight = window.innerHeight;
	var px = 'px';
	
	(function() {

		// input html data
		var journals = document.getElementById('journals');
		journals.innerHTML = TemplateEngine.getHTML(data, style);

		var myNews = new News (data, style, journals);

		// event setting
		// var eventMonitor = new Monitor();
		// eventMonitor.init(document.getElementById('wrap'));

		// eventMonitor.A();
		// eventMonitor.set('#controller > .outer', 'click', {});
		// eventMonitor.set('mouseover', function(target){ console.log(target); }, false);


		// midJournal height coodination


		
		var midJournal = document.querySelector('#journals > .middle');
		var height = parseInt(window.getComputedStyle(midJournal, null).getPropertyValue('height')) + offsetHeight;
		if (height < windowHeight) {
			height = windowHeight-headerHeight;
		}
		var container = document.getElementById('container').style.height = height+px;

	}());


	
}
