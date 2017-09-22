$(document).ready(function() {
    var liIndex = 0;
    var tempRadioVal = "unsel",
        libRadioVal = "sel";
    var dataObj = {};
    var resDownloadFlag = false;
    var rectTip = $(" <div id='rectTipId' class='dragContainer' style='width:1px;height:1px;display:none;'></div>");
    var dragArea = {};
    var dragDiv = {};
    var zoomDiv = {};
    var divIndex = 0;
    var flag = false;
    var hasMove = false;
    var rectangleMap = [];
    var templateMap = [];
    var selectImgFlag = false;
    var rectIndex = 0;
    var x, y, endX, endY;
    var reDoArr = [];
    var tempDataFlag = false;
    var canvasWidth = 0,
        canvasHeight = 0;
    var rate = 1;
    var circleStyle = { fillColor: "blue", fill: true, stroke: true, fillOpacity: 1, strokeOpacity: 1 };
    var templatesInfo = {};

    templateList.loadTemplatesToTable();

});

var array = [];
function createPromise(filea, i) {
	var promise;
    promise = new Promise(function(resolve, reject) {
    	var reader = new FileReader();
    	reader.readAsDataURL(filea);
	    reader.onload = function(e){
	    	console.log(e.target.result);
	    	var json = {
	    			"name" : filea.name,
	    			"data" : e.target.result
	    	}
	    	array[i] = json;
	    	resolve(array[i]);
	    };
    });
    return promise;
}

var templateList = {
		
		loadTemplatesToTable : function(){
	        $('#templateListTbl').DataTable({
	            "createdRow": function(nRow, aData, iDisplayIndex) {
	                $('td:eq(5)', nRow).html("<input type='file' multiple='multiple' class='btn btn-upload' accept='image/png, image/jpeg, image/jpg' id='loadTemplateBtn' name='ocrFile[]'>");
	            },
				"aoColumns": [
					{  "title": "Id","sClass": "center", "mDataProp": "tmpId" },
					{  "title": "テンプレート名","sClass": "center", "mDataProp": "tmpName" },
					{  "title": "登録日","sClass": "center", "mDataProp": "createTime" },
					{ "title": "オーナー","sClass": "center", "mDataProp": "owner" },
					{ "title": "ステータス","sClass": "center", "mDataProp": "statusValue" },
					{ "title": "Action", "mDataProp": "statusCode", "sClass": "center" }
				],
				"searching":false,
				"sServerMethod": "POST",
				"bLengthChange": true,
				"bPaginate": true,
				"bProcessing": true,
				"bSort": true,
				"bServerSide": true,
				"fnServerData": function ( sSource, aoData, fnCallback ) {
                    $.ajax ( {
                        type : "POST",
                        url : "http://localhost:8088/template/templateList",
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
	   addOnClickEventListener : function(){
	        $(document).on('change', '.btn-upload', function(e) {
	            var file = this.files[0];
	            array = [];
				var tmpId = $(this).parent().siblings(':first').text();
	            var tmpName =  $(this).parent().siblings(':first').next().text();
	            
	            var promiseArray = []; 
				for (var i = 0, filea; filea = this.files[i]; i++) { 
					promiseArray.push(createPromise(filea, i)); 
				} 
				Promise.all(promiseArray).then(function(resultData) { 
					if (file != null) {
		            	var json = {
		            			"tmpId" : tmpId,
		            			"tmpName" : tmpName,
		            			"uploadFiles" : JSON.stringify(array)
		            			 };
		            	_service.invoke("/templateSelect/ｔemplateSelectSave", json, function(returnData) {
			            		window.location.href = "reportList.html";
		        		}, function(data) {
		        			e.target.value = "";
		        			_ui.alert("OK", data.msg);
		        		}, false)
		            }
				}) 
	        });
	    }		
}