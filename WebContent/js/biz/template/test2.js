var Main = function() {

	var handleMain = function() {

		$('.menu-btn').on("click", function(e) {

		});
	};

	return {
		// main function to initiate the module
		init : function() {
			handleMain();
		}
	};
}();

jQuery(document).ready(function() {
	// init
	Main.init();
});
