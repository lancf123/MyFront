var dataCorrection = {
    rate :1,
    cxt :$("#myCanvas")[0].getContext("2d"),
    /*画面初始化*/
    init : function(){
        this.initPageShow();
        this.initBind();
    },
    /*画面取值初始化*/
    initPageShow: function() {
        /*var imgId = _html.getValue("img_id");
        var imgName = _html.getValue("img_name");
        var tmpId =  _html.getValue("tmp_id");*/
    	
        var imgId = _globalParam.get("imgId");
        var imgName = _globalParam.get("imgName");
        var tmpId =  _globalParam.get("tmpId");
		
        var param = {"imgId":imgId,"tmpId":tmpId};
        var param_tmp = {"tmpId":tmpId};
        //帐票名称
        $("#temName").html(imgName);
        //补正tabel

        _service.invoke("/report/dataCorrectionInit",param,function(data) {
            var html = "";
            $.each(data.item_recogresult, function(i, item) {
                html += '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td class="center">'+item.itemName+'</td>'+
                '<td class="center">'+item.itemValue+'</td>'+
                '<td class="center"><input class="correctInput" type="text" id="'+item.itemId+'" value="'+item.itemValue+'"></td>'+
                '</tr>';
            });
            $("#dataCorrectionTbl tbody").append(html);
            $("#dataCorrectionTbl tbody tr").mouseover(function(){
                $("#dragContainer_"+$(this).find("input.correctInput").attr("id")).addClass("selected");
            }).mouseout(function(){
                $(".dragContainer").removeClass("selected");
            });

            $("#imgDivId").show();

            $("#reportImg").attr("src", "data:image/png;base64,"+ data.img_data);
            //$("#reportImg").attr("src", data.img_data);
            //$("#reportImg").attr("src", data.img_data);
            $("#reportImg")[0].onload = function() {
                var img = document.getElementById("reportImg");
                //var imgWidth = $("#reportImg").css("width").split("px")[0]*1;
                //var imgHeight = $("#reportImg").css("height").split("px")[0]*1;
                $("#imgDivId").hide();
                dataCorrection.rate = 500/img.width;
                //$("#reportImg").css("width", "500px");
                $("#myCanvas").attr("width", img.width*dataCorrection.rate);
                $("#myCanvas").attr("height", img.height*dataCorrection.rate);
                dataCorrection.cxt.clearRect(0, 0, img.width, img.height);
                dataCorrection.cxt.drawImage(img, 0, 0, img.width*dataCorrection.rate, img.height*dataCorrection.rate);
                //帐票识别区域
                _service.invoke("/template/viewTemplate",param_tmp,function(data) {
                    dataCorrection.drawCutPic(data.templateItemList);
                    dataCorrection.drawRectangle(data.templateItemList);
                });
            }
            
        });
        
        
//        $(document).on('click', '.glyphicon-check', function(e) {
//        	
//        	$('correctInput').each(function (i){
//
//        		var id = this.prop("id");
//        		var value = this.prop("value");
//                alert(id + value);
//        		
//        	});
//        });
        	

//        	$("#dataCorrectionTbl tbody ").each(function(){
//            	var id = $(this).find("input.correctInput").prop("id");
//                var value = $(this).find("input.correctInput").prop("value");
//
//            }

        
        
//        _service.invoke("/report/imgDisplay",param,function(data) {
//            $("#imgDivId").show();
//            $("#reportImg").attr("src", "data:image/png;base64,"+ data.img_data);
//            $("#reportImg")[0].onload = function() {
//                var img = document.getElementById("reportImg");
//                //var imgWidth = $("#reportImg").css("width").split("px")[0]*1;
//                //var imgHeight = $("#reportImg").css("height").split("px")[0]*1;
//                $("#imgDivId").hide();
//                dataCorrection.rate = 500/img.width;
//                //$("#reportImg").css("width", "500px");
//                $("#myCanvas").attr("width", img.width*dataCorrection.rate);
//                $("#myCanvas").attr("height", img.height*dataCorrection.rate);
//                dataCorrection.cxt.clearRect(0, 0, img.width, img.height);
//                dataCorrection.cxt.drawImage(img, 0, 0, img.width*dataCorrection.rate, img.height*dataCorrection.rate);
//                //帐票识别区域
//                _service.invoke("templateView",param_tmp,function(data) {
//                    dataCorrection.drawCutPic(data.itemList);
//                    dataCorrection.drawRectangle(data.itemList);
//                });
//            }
//        });
        
        //补正tabel
        /*$.ajax({
                url: "../webData/getdataCorrection.json",
                type : 'GET',
                contentType:'json',
                cache: false
        }).done(function(data){
            var html = "";
            $.each(data.item_recogresult, function(i, item) {
                html += '<tr>'+
                '<td>'+(i+1)+'</td>'+
                '<td class="center">'+item.item_name+'</td>'+
                '<td class="center"><canvas class="curPic" width="1px" height="1px""></canvas></td>'+
                '<td class="center"><input class="correctInput" type="text" id="'+item.item_id+'" value="'+item.item_value+'"></td>'+
                '</tr>';
            });
            $("#dataCorrectionTbl tbody").append(html);
            $("#dataCorrectionTbl tbody tr").mouseover(function(){
                $("#dragContainer_"+$(this).find("input.correctInput").attr("id")).addClass("selected");
            }).mouseout(function(){
                $(".dragContainer").removeClass("selected");
            });
        });
        //账票图片
        $.ajax({
                url: "../webData/getImgDisplay.json",
                type : 'GET',
                contentType:'json',
                cache: false
        }).done(function(data){
            $("#imgDivId").show();
            $("#reportImg").attr("src", "data:image/png;base64,"+ data.img_data);
            $("#reportImg")[0].onload = function() {
                var img = document.getElementById("reportImg");
                //var imgWidth = $("#reportImg").css("width").split("px")[0]*1;
                //var imgHeight = $("#reportImg").css("height").split("px")[0]*1;
                $("#imgDivId").hide();
                dataCorrection.rate = 700/img.width;
                //$("#reportImg").css("width", "500px");
                $("#myCanvas").attr("width", img.width*dataCorrection.rate);
                $("#myCanvas").attr("height", img.height*dataCorrection.rate);
                dataCorrection.cxt.clearRect(0, 0, img.width, img.height);
                dataCorrection.cxt.drawImage(img, 0, 0, img.width*dataCorrection.rate, img.height*dataCorrection.rate);
                //帐票识别区域
                $.ajax({
                        url: "../webData/getTemplateView.json",
                        type : 'GET',
                        contentType:'json',
                        cache: false
                }).done(function(data){
                    dataCorrection.drawCutPic(data.itemList);
                    dataCorrection.drawRectangle(data.itemList);
                });    
            }
        });*/
        
    },
    /*画面按钮动作绑定*/
    initBind: function() {
        /*$("#myCanvas").okzoom({
            width: 300, // ルーペの幅
            height: 200, // ルーペの高さ
            round: false, // ルーペの形
            border: "1px solid black", // ルーペのボーダー指定
            shadow: "0 0 5px #000" // ルーペの影指定
        });*/
        $("#save").click(function(){
            var correctData ={"correctInfo":[]};
            var item = {};
            $(".correctInput").each(function(){
                item = {}
                item.itemId =$(this).attr("id");
                item.tmpId = _globalParam.get("tmpId");
                item.imgId = _globalParam.get("imgId");
                item.itemCorrectrslt = $(this).val();
                correctData.correctInfo.push(item);
            });
            
            _service.invoke("/report/dataCorrection",correctData,function(data) {
                console.log("save success");
            });
        });
    },
    /*识别区域红框*/    
    drawRectangle: function(itemData){
        if (itemData.length > 0) {
            itemData.forEach(function(item, i) {
                x = Math.round(item.x*dataCorrection.rate);
                y = Math.round(item.y*dataCorrection.rate);
                width = Math.round(item.width*dataCorrection.rate);
                height = Math.round(item.height*dataCorrection.rate);
                console.log(x, y, width, height);
                //var numDiv =$("<div class='numDiv' style='top:" + (y -10)+ "px;left:" + x + "px;width:10px;height:10px;'>"+(i+1)+"</div>");
                dragArea = $("<div class='dragContainer' id='dragContainer_" + item.item_id + "' style='top:" + y + "px;left:" + x + "px;width:" + width + "px;height:" + height+ "px;'></div>");
                $("#container").append(dragArea);                
                var numDiv =$("<div class='numDiv' style='top:" + (y -10)+ "px;left:" + (x-10) + "px;'>"+(i+1)+"</div>");
                $("#container").append(numDiv);
            }, this);
        }
    },
    /*识别区域截图显示*/
    drawCutPic: function(itemData){
        var itemObj = {};
        $(".curPic").each(function(){
            itemObj = {};
            for(var i=0; i< itemData.length; i++) {
                if(itemData[i].item_id == $(this).parent().parent().find("input.correctInput").attr("id")) {
                    itemObj = itemData[i];
                    break;
                }
            }
            //itemObj = itemData[0];
            var cutCxt =$(this)[0].getContext("2d");
            var img = document.getElementById("reportImg");
            $(this).attr("width", itemObj.width*dataCorrection.rate);
            $(this).attr("height", itemObj.height*dataCorrection.rate);
            cutCxt.clearRect(0, 0, itemObj.width*dataCorrection.rate, itemObj.height*dataCorrection.rate);
            cutCxt.drawImage(img, itemObj.x, itemObj.y, itemObj.width, itemObj.height,0,0,itemObj.width*dataCorrection.rate, itemObj.height*dataCorrection.rate);
            /*$(this).attr("width", itemObj.width);
            $(this).attr("height", itemObj.height);
            cutCxt.clearRect(0, 0, itemObj.width, itemObj.height);
            cutCxt.drawImage(img, itemObj.x, itemObj.y, itemObj.width, itemObj.height,0,0,itemObj.width, itemObj.height);*/
        });
    }
};
$(document).ready(function() {
    dataCorrection.init();
});