var reportList = {
	rate :1,
	dragArea :{},
    loadReportListToTable : function(){
    	table = $('#reportsListTable').DataTable({
            //data: templatesInfo.templates,
            "createdRow": function(nRow, aData, iDisplayIndex) {
            	//$('td:eq(2)', nRow).html("<a href = '#' class='imgDisplay'>" + aData.imgName + "</a>"  );
            	$('td:eq(2)', nRow).html(
                        "<div class='tmpName' imgId='"+aData.imgId+"' tmpId='"+aData.tmpId+"'><a href = '#' class='imgDisplay'>" + aData.imgName + "</a></div>"
                );
                
                if (aData.recStatus == "01") {
                	$('td:eq(5)', nRow).html("<center><input class='toggle-one' type='checkbox' checked data-toggle='toggle' data-size='small' data-onstyle='primary' data-offstyle='default' data-on='<B>対象</B>' data-off='<B>対象外</B>'></center>");
                	$('td:eq(6)', nRow).html("<center>" +
                            "<button type='button' class='btn btn-primary btn-sma correctBtn disabled' " +
                            "img_id='" + aData.imgId + "' img_name='" + aData.imgName + "' tmp_id='" + aData.tmpId + "'>" +
                            "<i class='glyphicon glyphicon-pencil'></i>&nbsp;補正</button></center>");
                } else {
                	$('td:eq(5)', nRow).html("<center><input class='toggle-one' type='checkbox' disabled data-toggle='toggle' data-size='small' data-onstyle='primary' data-offstyle='default' data-on='<B>対象</B>' data-off='<B>対象外</B>'></center>");
                	$('td:eq(6)', nRow).html("<center>" +
                            "<button type='button' class='btn btn-primary btn-sma correctBtn' " +
                            "img_id='" + aData.imgId + "' img_name='" + aData.imgName + "' tmp_id='" + aData.tmpId + "'>" +
                            "<i class='glyphicon glyphicon-pencil'></i>&nbsp;補正</button></center>");
                }
                
            },
            "drawCallback": function() {
                 $('#reportsListTable .toggle-one').bootstrapToggle();
            },
            "aoColumns": [

                {  "title": "テンプレート名","sClass": "center", "mDataProp": "tmpName" },
                {  "title": "テンプレートステータス","sClass": "center", "mDataProp": "tmpStatusValue" },
                {  "title": "帳票名","sClass": "center", "mDataProp": "imgName" },
                {  "title": "帳票オーナー","sClass": "center", "mDataProp": "owner" },
                {  "title": "帳票ステータス","sClass": "center", "mDataProp": "recStatusValue" },
                {  "title": "認識対象","sClass": "center", "mDataProp": "recStatus" },
                {  "title": "Action", "sClass": "center" , "mDataProp": "recStatus"}
            ],
            "sServerMethod": "POST",
            "bLengthChange": true,
            "bPaginate": true,
            "bProcessing": true,
            "bSort": false,
            "bServerSide": true,
            "fnServerData": function ( sSource, aoData, fnCallback ) {
                $.ajax ( {
                    type : "POST",
                    url : "http://localhost:8088/report/getReportList",
                    data: aoData,
                    success: function (result_data) {
                        fnCallback(result_data.data);
                    },
                    error: function (responsedata) {

                    }
                });

            }
        });
        this.addOnClickEventListener();
    },
    
    addOnClickEventListener: function() {
        var self = this;
        //初始化img view控件
		var $images = $('.docs-pictures');	
        $(document).on('click', '.imgDisplay', function(e) {
        	
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
        	var img_id = $(this).parent().attr("imgid");
            var json = { "imgId": img_id };
            _service.invoke("/report/imgView", json, function(data) {
            	if(data.imgData != null) {
            		$("#reportImg").attr("src", "data:image/png;base64,"+ data.imgData);
                    $("#reportImg")[0].onload = function() {
        				var img = document.getElementById("reportImg");
        				var canvas = document.getElementById("myCanvas");
        				cxt = canvas.getContext("2d");
                        var imgWidth = $("#reportImg").css("width").split("px")[0]*1;
                        var imgHeight = $("#reportImg").css("height").split("px")[0]*1;
                        $("#imgDivId").hide();
                        $("#view_image").hide();
                        reportList.rate = 500/img.width;
                        //$("#reportImg").css("width", "500px");		
        				$("#myCanvas").attr("width", img.width*reportList.rate);
        				$("#myCanvas").attr("height", img.height*reportList.rate);
        				cxt.clearRect(0, 0, img.width, img.height);
        				cxt.drawImage(img, 0, 0, img.width*reportList.rate, img.height*reportList.rate);
        	            var mycanvas = document.getElementById("myCanvas");  
        				var dataURL = mycanvas.toDataURL("image/png");
        				$("#image").attr("src",dataURL);
        				
        				options["button"] = true;
        				options["toolbar"] = false;
        			    $images.viewer('destroy').viewer(options);
        				var resultData = {enable:"modal",method:"show"};
        			   // var resultData = $(this).data();
        			    var args = resultData.arguments || [];

        			    if (resultData.method) {
        			      if (resultData.target) {
        			        $images.viewer(resultData.method, $(resultData.target).val());
        			      } else {
        			        $images.viewer(resultData.method, args[0], args[1]);
        			      }
        			      switch (resultData.method) {
        			        case 'scaleX':
        			        case 'scaleY':
        			          args[0] = -args[0];
        			          break;
        			        case 'destroy':
        			          toggleButtons('none');
        			          break;
        			      }
        			    }
                    }
            	}
            })
            
        });
        
        $(document).on('click', '.correctBtn', function(e) {
            _globalParam.set("imgId", e.target.attributes['img_id'].value)
            _globalParam.set("imgName", e.target.attributes['img_name'].value)
            _globalParam.set("tmpId", e.target.attributes['tmp_id'].value)
            window.location.href = "dataCorrection.html"
        });

        $(document).on('click', '.csvExportBtn', function(e) {
        	
        	var rd = $("input[name='optradio']:checked").val();
        	var json = {
        			"recStatus" : rd
        	}
        	_service.invoke("/report/csvDownload", json, function(returnData) {
        		$("input[name='optradio']:eq(0)").attr("checked",'checked');
        		var ret = JSON.parse(returnData); 
        		_ui.alert("OK", ret.retMsg);
        	})
        });
    },
}


$(document).ready(function() {
    init();

    $('#recognizeData').click(function() {
        
        var paramArr = [];
        var params = {};
        $("#reportsListTable tbody tr").each(function(){
        	params ={};
        	if(!$(this).find(".toggle-one").parent().hasClass("off")) {
        	//if($(this).find("toggle-one").prop("checked") == true) {
        		params.img_id = $(this).find("div.tmpName").attr("imgid");
        		params.tmp_id = $(this).find("div.tmpName").attr("tmpid");
        		paramArr.push(params);
        	}
        });

        for (var i =0; i < paramArr.length; i++){
            var param = { "imgId": paramArr[i].img_id,
                          "tmpId": paramArr[i].tmp_id
                         };
            _service.invoke("/report/recognize",param,
            		function(data) {
            	        window.location.href = "reportList.html"
        		        //alert("OK");
                    }
            );
        }
    
//    $('#recognizeData').click(function() {
//        $("#recogDataModal").modal('show');
//        setTimeout(function() {
//            var url = "webData/recognize_result.json";
//            $.ajax({
//                url: url,
//                dataType: "json",
//                type: "GET",
//                data: {
//                    templateId: 154,
//                    testingMode: 0
//                },
//                success: function(data) {
//                    $("#recogDataModal").modal('hide');
//                },
//                error: function(XMLHttpRequest, textStatus, errorThrown) {}
//            });
//        }, 2000);
//
//        var img = document.getElementById("imgId");
//        var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//        var data = {};
//        var item = new Object();
//        item.accountImage = image;
//        item.originalWidth = img.height;
//        item.originalHight = img.width;
//        $.extend(data.AccountInfo, item);
    });

    /*
     * init
     *
     */
    function init() {
        reportList.loadReportListToTable();
    }
});


$(document).on('click', '#csvExport', function() {
    $('#exportModal').modal('show');
});
//$(document).on('click', '#AAApng', function() {
//    $('#datashowModal').modal('show');
//});
