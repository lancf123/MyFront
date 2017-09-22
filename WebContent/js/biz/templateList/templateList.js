var templateList = {
		
	rate :1,
	dragArea :{},
    loadTemplatesToTable : function(){
    	table = $('#templateListTbl').DataTable({
            //data: templatesInfo.templates,
            "createdRow": function(nRow, aData, iDisplayIndex) {

            },
            "aoColumns": [
                {  "title": "Id","sClass": "center", "mDataProp": "tmpId" },
                {  "title": "テンプレート名","sClass": "center", "mDataProp": "tmpName" },
                {  "title": "登録日","sClass": "center", "mDataProp": "createTime" },
                { "title": "オーナー","sClass": "center", "mDataProp": "owner" },

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
    	
    	//初始化img view控件
		var $images = $('.docs-pictures');	
    	$(document).on('click', '.btn-View', function() {
    		
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
			
			   var templateId = $(this).parent().siblings(':first').text();
			   var json = {"tmpId":templateId};
			   _service.invoke("/template/viewTemplate", json, function(data) {
            	$("#imgDivId").show();


            })
            
	    });
        $(document).on('click', '.btn-Delete', function(e) {
        	var id = $(this).parent().siblings(':first').text();
        	
            _ui.showDialog("確定", "キャンセル",
                "blue",
                "modal",
                "確認を削除しますか？", function () {

                    //alert("success1");
                    
                    var json = "{"+'"tmpId"'+":"+'"'+id+'"'+"}";
                    var jsondata=JSON.parse(json);
                    //alert(json);
                    _service.invoke("/template/deleteTemplate", jsondata, function(resultData) {
                    	table.ajax.reload();
                        //alert(resultData);
                    	
                    })
                    
                }, function () {
                		
                		
                });
/*            // console.log($(this).parent().siblings(':first').next().text());

            var templateDelName = $(this).parent().siblings(':first').next().text();
            templatesInfo["templateDelId"].push(templateDelId);
            localStorage.setItem("ls_templatesInfo", JSON.stringify(templatesInfo));
            $('#del-target').html(templateDelName);
            $('#deleteModal').modal('show');*/
        });


        });
    },
}
$(document).ready(function() {
    templateList.loadTemplatesToTable();
});
