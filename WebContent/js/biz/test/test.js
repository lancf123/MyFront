var test = {

	// 定义属性

	initBind : function() {

		var name = _globalParam.get("name");
		alert(name);
		var a = _url.getUrlParameter("a");
		alert(a);
		
		
		
	}


};

$(document).ready(function() {
	test.initBind();
});
