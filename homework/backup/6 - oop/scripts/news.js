var News = (function () {








	var myNews = function () {

		this.model = new NewsModel();
		this.newsView = new NewsView();

	};
	return myNews;

}());