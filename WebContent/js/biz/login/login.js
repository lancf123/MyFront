var login = {


    // git merge testing good job!!
	// 定义属性
	initBind : function() {
		
		//初始化img view控件
		var $images = $('.docs-pictures');
		var $buttons = $('.docs-buttons');
		
		$buttons.on('click', 'button', function () {
			  
			var options ={
			        build: function (e) {
			          console.log(e.type);
			        },
			        built: function (e) {
			          console.log(e.type);
			        },
			        show: function (e) {
			          console.log(e.type);
			        },
			        shown: function (e) {
			          console.log(e.type);
			        },
			        hide: function (e) {
			          console.log(e.type);
			        },
			        hidden: function (e) {
			          console.log(e.type);
			        },
			        view: function (e) {
			          console.log(e.type);
			        },
			        viewed: function (e) {
			          console.log(e.type);
			        }
			      };
			
			$images.on({
			    'build.viewer': function (e) {
			      console.log(e.type);
			    },
			    'built.viewer':  function (e) {
			      console.log(e.type);
			    },
			    'show.viewer':  function (e) {
			      console.log(e.type);
			    },
			    'shown.viewer':  function (e) {
			      console.log(e.type);
			    },
			    'hide.viewer':  function (e) {
			      console.log(e.type);
			    },
			    'hidden.viewer': function (e) {
			      console.log(e.type);
			    },
			    'view.viewer':  function (e) {
			      console.log(e.type);
			    },
			    'viewed.viewer': function (e) {
			      console.log(e.type);
			    }
			  }).viewer(this.options);
			
			
			
			 //$("#imgid").show();	  
			options["button"] = true;
			options["toolbar"] = false;
		    $images.viewer('destroy').viewer(options);
			    
		    var data = $(this).data();
		    var args = data.arguments || [];

		    if (data.method) {
		      if (data.target) {
		        $images.viewer(data.method, $(data.target).val());
		      } else {
		        $images.viewer(data.method, args[0], args[1]);
		      }

		      switch (data.method) {
		        case 'scaleX':
		        case 'scaleY':
		          args[0] = -args[0];
		          break;

		        case 'destroy':
		          toggleButtons('none');
		          break;
		      }
		    }
		  });
//		var that = this;
//		 //校验输入项
//        $('#loginForm').bootstrapValidator({
//            fields: {
//            	userName: {
//            		validators: {  
//                        notEmpty: {  
//                        message: '用户名不能为空'  
//                        }  
//                    }  
//                },
//                passWord: {
//            		validators: {  
//                        notEmpty: {  
//                        message: '密码不能为空'  
//                        }  
//                    }  
//                }
//            },
//            submitHandler: function (validator, form, submitButton) {
//            	 $('#loginForm').bootstrapValidator('disableSubmitButtons', false);
//            	that.login();
//            }
//        });
	}, 

	/**
	 * 手机号绑定表单提交事件处理
	 * 
	 * @event
	 */
	login : function() {
		
		 //$("#imgid").show();	  
		this.options["button"] = true;
		this.options["toolbar"] = false;
		this.$images.viewer('destroy').viewer(this.options);
		    
	    var data = $(this).data();
	    var args = data.arguments || [];

	    if (data.method) {
	      if (data.target) {
	        $images.viewer(data.method, $(data.target).val());
	      } else {
	        $images.viewer(data.method, args[0], args[1]);
	      }

	      switch (data.method) {
	        case 'scaleX':
	        case 'scaleY':
	          args[0] = -args[0];
	          break;

	        case 'destroy':
	          toggleButtons('none');
	          break;
	      }
	    }
		
		
		
		
		//_ui.alert("OK","请求成功");    
		
		
//		_ui.showDialog("确定", "取消",
//				"blue",
//				"blue",
//				"你确认要删除吗？", function() {
//					alert("success");
//				}, function() {
//					alert("error");
//		});

		
		// 取得Form表单内控件的值
		//var mobile = _html.getValue("username");
		//alert(mobile);
		//_globalParam.set("name", "lancf");
		//var json = this.getJsonData();
//		alert(json);
		// ajax请求
		//_service.invoke("/login/loginToMenu", json, function(resultData) {
			//_ui.alert("OK","请求成功，返回的名字是"+ resultData.userName);
		
		//})
		 //_url.redirectTo("html/test.html?a=1&b=2", true);
		 //_url.redirectTo("templateList.html", true);
	},
	
	
	getJsonData:function()  {
		var json = {
		"userId":"U001",
		"userName":"2",
		"password":"123456"
		 };
		    return json;
		}
	
	
}

$(document).ready(function() {
	login.initBind();
});
