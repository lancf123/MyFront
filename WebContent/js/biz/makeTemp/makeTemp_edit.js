var makeTemp = {
    dragArea :{},
    dragDiv :{},
    zoomDiv :{},
    divIndex :0,
    mouseDownFlag :false,
    hasMove :false,
    rectangleMap :[],
    selectImgFlag :false,
    x:0,
    y:0,
    endX:0,
    endY:0,
    reDoList :[],
    unDoList :[],
    Action :{"DEL" : 0, "ADD" : 1}, 
    canvasWidth :0,
    canvasHeight :0,
    rate :1,
    itemNameIndex :0,
    cxt :$("#myCanvas")[0].getContext("2d"),
    imgData :"",
    
    /*画面初始化*/
    init : function(){
        this.initImg();
        this.initPageShow();
        this.initBind();
    },
    initImg : function(){
        /*_service.invoke("templateView",{},function(data) {
          
        var img = document.getElementById('imgId');
        $("#myCanvas").attr("width", img.width);
        $("#myCanvas").attr("height", img.height);
        makeTemp.rate = 1;
        makeTemp.canvasWidth = img.width;
        makeTemp.canvasHeight = img.height;
        makeTemp.cxt.drawImage(img, 0, 0);
    
    });*/
        $.ajax({
            url: "../webData/getItemList.json",
            type : 'GET',
            contentType:'json',
            cache: false
        }).done(function(data){
            
            $("#imgId").attr("src", "data:image/png;base64,"+ data.img_data);
            var img = document.getElementById('imgId');
            img.onload = function() {
                $("#myCanvas").attr("width", img.width);
                $("#myCanvas").attr("height", img.height);
                makeTemp.rate = 1;
                makeTemp.canvasWidth = img.width;
                makeTemp.canvasHeight = img.height;
                makeTemp.cxt.drawImage(img, 0, 0);
                makeTemp.selectImgFlag = true;
            }
            for (var i = 0; i < data.itemList.length; i++) {
                var itemTemp = data.itemList[i];
                var item = new Object();
                item.left = itemTemp.x;
                item.top = itemTemp.y;
                item.width = itemTemp.width;
                item.height = itemTemp.height;
                //item.id = "dragContainer" + this.divIndex;
                //item.itemName = $("#itemName").val();
                //item.selectType = $("#selectType").val();
                //item.selMovelineType = $("#selMovelineType").val();
                item.id = itemTemp.item_id;
                item.itemName = itemTemp.item_name;
                item.selectType = itemTemp.item_type;
                item.selMovelineType = itemTemp.line_type;
                makeTemp.rectangleMap.push(item);
            }
            makeTemp.drawRectangleMap();
        });
    },
    /*画面初始化*/
    initPageShow : function(){
        /*_service.invoke("getCategoryList",{},function(data) {
            var html= "";
            $.each(data.itemTypeList, function(i, item) {
                html+= '<option value="'+item.code+'">'+item.code_value+'</option>'
            });
            $("#selectType").append(html);
            
            html=""
            $.each(data.lineTypeList, function(i, item) {
                html+= '<option value="'+item.code+'">'+item.code_value+'</option>'
            });
            $("#selMovelineType").append(html);
        });*/
        //ダミデータ
        $.ajax({
                url: "../webData/getItemType.json",
                type : 'GET',
                contentType:'json',
                cache: false
        }).done(function(data){
            
            var html= "";
            $.each(data.itemTypeList, function(i, item) {
                html+= '<option value="'+item.code+'">'+item.code_value+'</option>'
            });
            $("#selectType").append(html);
            
            html=""
            $.each(data.lineTypeList, function(i, item) {
                html+= '<option value="'+item.code+'">'+item.code_value+'</option>'
            });
            $("#selMovelineType").append(html);
            makeTemp.clearItemArea();            
        });
        // $("#draw,#clear,#undo,#redo,#zoomIn,#zoomOut,#identify").show();
        $("#draw,#clear,#undo,#redo,#zoomIn,#zoomOut,#identify").show();
        $("#contentDiv").ligerLayout({ leftWidth: 100, rightWidth: 400 });
        $('#imgId').hide();
        $('#imgDivId').hide();        
    },
    /*画面按钮动作绑定*/
    initBind: function() {
        $("#save").click(function(e) {
            // ajax请求
            var param = {};
            param.tmp_id = "";
            param.tmp_name = $("#template_name").val();
            param.tmp_data = document.getElementById('imgId').src;
            param.templateItemList = [];
            makeTemp.rectangleMap.forEach(function(v, i) {
                if(typeof(v.itemName) !== "undefined") {
                    var item = new Object();
                    item.item_id = "";
                    item.item_name = v.itemName;
                    item.item_type = v.selectType;
                    item.line_type = v.selMovelineType;
                    item.x = Math.round($("#dragContainer"+i).css("left").split("px")[0]*1/makeTemp.rate);
                    item.y = Math.round($("#dragContainer"+i).css("top").split("px")[0]*1/makeTemp.rate);
                    item.width= Math.round($("#dragContainer"+i).css("width").split("px")[0]*1/makeTemp.rate);
                    item.height= Math.round($("#dragContainer"+i).css("height").split("px")[0]*1/makeTemp.rate);
                    param.templateItemList.push(item);
                }
            });
            _service.invoke("/template/updateTemplate",param,function(data) {
                console.log("OK");
            });
        });
        $("#loadTemplateBtn").change(function(e) {
            makeTemp.changImg(e);
            $("#draw,#clear,#undo,#redo,#zoomIn,#zoomOut").show();
        });
        
        /*item名变更*/
        $("#itemName").change(function(){
            if($(this).val() !== "") {
                var index = makeTemp.getIndexFromId($(".dragContainer.selected").attr("id"));
                makeTemp.rectangleMap[index].itemName = $(this).val();
            } else{
                $(this).focus();
            }
            
        });
        /*item Type变更*/
        $("#selectType").change(function(){
            var index =  makeTemp.getIndexFromId($(".dragContainer.selected").attr("id"));
            makeTemp.rectangleMap[index].selectType = $(this).val();
        });
        /*move Type变更*/
        $("#selMovelineType").change(function(){
            var index = makeTemp.getIndexFromId($(".dragContainer.selected").attr("id"));
            makeTemp.rectangleMap[index].selMovelineType = $(this).val();
        });
        
        //画布区域落鼠标动作
        $("#myCanvas").mousedown(function(e) {
            if ($("#draw").hasClass("selected") && makeTemp.selectImgFlag) {
                $(this).css("cursor", "pointer");
                // set mousedown flag for mousemove event
                makeTemp.mouseDownFlag = true;
                makeTemp.hasMove = false;
                //set the begin path of the brash
                var offset = $("#myCanvas").offset();
                makeTemp.x = e.pageX - offset.left;
                makeTemp.y = e.pageY - offset.top;

                console.log("begin e.pageX:" + e.pageX + " " + offset.left);
                console.log("begin e.pageY:" + e.pageY + " " + offset.top);
                console.log("begin x y:" + makeTemp.x + " " + makeTemp.y);

                var borderColor = "#FF0000";
                var borderWidth = "1px";
                var sr = borderColor + " " + borderWidth + " solid";
                var backgroundColor = "#00ff00";
                $("#rectTipId").css({
                    "border": sr
                });
                $("#rectTipId").show();
            }
        });

        //画布区移动鼠标动作
        $("#myCanvas").mousemove(function(e) {
            if ($("#draw").hasClass("selected") && makeTemp.selectImgFlag) {
                makeTemp.hasMove = true;
                makeTemp.fakeRectangleInput(e);
            }
        });

        //画布区域抬鼠标动作
        $("#myCanvas").mouseup(function(e) {
            if ($("#draw").hasClass("selected") && makeTemp.selectImgFlag) {
                makeTemp.mouseDownFlag = false;
                var p = makeTemp.getEventPosition(e);

                if (makeTemp.hasMove) {
                    console.log("Drawing " + p.x + " " + p.y);
                    makeTemp.drawRectangle();
                } else {
                    objIndex = makeTemp.redrawRectangle(p, makeTemp.cxt);
                    if (objIndex != null && objIndex.length > 0) {
                        $("#itemName").val(makeTemp.rectangleMap[objIndex].itemName);
                        $("#selectType").val(makeTemp.rectangleMap[objIndex].selectType);
                        $("#selMovelineType").val(makeTemp.rectangleMap[objIndex].selMovelineType);
                        //$("#imgNameLibModal").modal('show');
                    }
                }
            }
        });

        //选择文件按钮
        $("#selFile").click(function() {
            makeTemp.selectImgFlag = true;
            makeTemp.selectFile();
        });
        
        //开启/关闭画框功能
        $("#draw").click(function() {
            $(this).toggleClass("selected");
        });

        //清空按钮
        $("#clear").click(function() {
            makeTemp.clearCanvas();
            makeTemp.clearItemArea();
        });

        //回退按钮
        $("#undo").click(function() {
            makeTemp.unDo();
        });
        //前进按钮
        $("#redo").click(function() {
            makeTemp.reDo();
        });
        //缩小按钮
        $("#zoomIn").click(function() {
            makeTemp.zoomin();
        });
        //放大按钮
        $("#zoomOut").click(function() {
            makeTemp.zoomout();
        });
        
        //关闭按钮
        /*$("#closeDialogBtn").click(function() {
            $("#dragContainer" + (makeTemp.divIndex - 1)).remove();
        });*/
        //语言切换
         /*$("#language").click(function() {
            alert("OK");
        });*/
    },
    
    /*清空item区域*/
    clearItemArea: function() {
        $("#itemName").val("");
        $("#selectType").val("");
        $("#selMovelineType").val("");
    },
    /*换模板图片*/
    changImg: function(e) {
        for (var i = 0; i < e.target.files.length; i++) {
            var file = e.target.files.item(i);
            if (!(/^image\/.*$/i.test(file.type))) {
                continue;
            }
            var freader = new FileReader();
            freader.readAsDataURL(file);
            freader.onload = function(e) {
                $("#imgId").attr("src", e.target.result);
                var img = document.getElementById("imgId");
                img.onload = function() {
                    $("#myCanvas").attr("width", img.width);
                    $("#myCanvas").attr("height", img.height);
                    makeTemp.rate = 1;
                    makeTemp.canvasWidth = img.width;
                    makeTemp.canvasHeight = img.height;
                    makeTemp.cxt.drawImage(img, 0, 0);
                }
            }
        }
    },
    /*清空画布上的区域*/
    clearCanvas: function(e) {
        this.rectangleMap.forEach(function(v, i) {
            $("#" + v.id).remove();
        });
    },
    /*selectFile*/
    selectFile: function() {
        this.clearCanvas();
        $("#loadTemplateBtn").click();
    },
    
    /*根据拖动显示红框*/
    fakeRectangleInput: function(e) {
        var offset = $("#myCanvas").offset();
        var borderWidth = 1;        
        this.endX = e.pageX - offset.left;
        this.endY = e.pageY - offset.top;
        if (this.mouseDownFlag) {
            $("#rectTipId").show();
            $("#rectTipId").css({ left: this.x, top: this.y });
            $("#rectTipId").width(this.endX - this.x - borderWidth * 2);
            $("#rectTipId").height(this.endY - this.y - borderWidth * 2);
        }
    },
    
    /*取得当前位置*/
    getEventPosition: function(ev) {
        var x, y;
        var offset = $("#myCanvas").offset();
        x = ev.pageX - offset.left;
        y = ev.pageY - offset.top;
        return { x: x, y: y };
    },
    drawRectangleMap : function() {
        divIndex = 0;
        if ($.isEmptyObject(this.rectangleMap)) return;
        this.rectangleMap.forEach(function(element) {
            x = element.left;
            y = element.top;
            endX = element.width;
            endY = element.height;
            console.log(x, y, endX, endY);
            
            var closeStr = "<div class='closeBtn'><i class='glyphicon glyphicon-remove'></i></div>";
            dragArea = $("<div class='dragContainer selected' id='" + element.id + "' style='top:" + y + "px;left:" + x + "px;width:" + (endX - x) + "px;height:" + (endY - y) + "px;'>" + closeStr + "</div>");
            $("#container").append(dragArea);
            $(".closeBtn").unbind("click").bind("click", function(e){
                $(this).parent().hide();
                makeTemp.clearItemArea();
                objIndex = makeTemp.getIndexFromId($(this).parent().attr("id"));
                var rectObj =  makeTemp.rectangleMap[objIndex];
                makeTemp.rectangleMap[objIndex]={};
                //this.reDoList.push(rectObj);
                makeTemp.unDoList.push({flag:makeTemp.Action.DEL, index:objIndex, item:rectObj});
                return false;
            });
            $(".dragContainer").unbind("click").bind("click", function(e){
                $(".dragContainer").removeClass("selected");
                $(this).addClass("selected");
                objIndex = makeTemp.getIndexFromId($(this).attr("id"));
                if (objIndex != null && typeof(makeTemp.rectangleMap[objIndex])!== "undefined") {
                    $("#itemName").val(makeTemp.rectangleMap[objIndex].itemName);
                    $("#selectType").val(makeTemp.rectangleMap[objIndex].selectType);
                    $("#selMovelineType").val(makeTemp.rectangleMap[objIndex].selMovelineType);
                }
            });

            $(".dragContainer").hover(function(e){
                $(this).find(".closeBtn").show();
            },function(){
                $(this).find(".closeBtn").hide();
            });            
            dragDiv = $("<div class='dragDiv' id='dragDiv" + divIndex + "'></div>");
            zoomDiv = $("<div class='zoomDiv' id='zoomDiv" + divIndex + "'></div>")
            dragArea.append(dragDiv);
            dragArea.append(zoomDiv);
            new Zoom("dragDiv" + divIndex, "dragContainer" + divIndex, "zoomDiv" + divIndex);
            /*$(".zoomDiv").unbind("click").bind("click", function(e){
                makeTemp.hasMove = false;
            });*/
            $(".zoomDiv,.dragDiv").mouseup(function(e) {
                makeTemp.hasMove = false;
            });
            $(".zoomDiv,.dragDiv").mousedown(function(e) {
                makeTemp.hasMove = false;
            });
            e = element;
            divIndex++;
        }, this);
        $(".dragContainer").removeClass("selected");
        $("#myCanvas").focus();
        $("#rectTipId").hide();
        $("#rectTipId").css({
            "width": "0px",
            "height": "0px"
        });
    },
    /*生成item红框*/
    drawRectangle: function() {
        $(".dragContainer").removeClass("selected");
        var closeStr = "<div class='closeBtn'><i class='glyphicon glyphicon-remove'></i></div>";
        this.dragArea = $("<div class='dragContainer selected' id='dragContainer" + this.divIndex + "' style='top:" + this.y + "px;left:" + this.x + "px;width:" + (this.endX - this.x) + "px;height:" + (this.endY - this.y) + "px;'>" + closeStr + "</div>");
        $("#container").append(this.dragArea);
        $(".closeBtn").unbind("click").bind("click", function(e){
            $(this).parent().hide();
            makeTemp.clearItemArea();
            objIndex = makeTemp.getIndexFromId($(this).parent().attr("id"));
            var rectObj =  makeTemp.rectangleMap[objIndex];
            makeTemp.rectangleMap[objIndex]={};
            //this.reDoList.push(rectObj);
            makeTemp.unDoList.push({flag:makeTemp.Action.DEL, index:objIndex, item:rectObj});
            return false;
        });
        $(".dragContainer").unbind("click").bind("click", function(e){
            $(".dragContainer").removeClass("selected");
            $(this).addClass("selected");
            objIndex = makeTemp.getIndexFromId($(this).attr("id"));
            if (objIndex != null && typeof(makeTemp.rectangleMap[objIndex])!== "undefined") {
                $("#itemName").val(makeTemp.rectangleMap[objIndex].itemName);
                $("#selectType").val(makeTemp.rectangleMap[objIndex].selectType);
                $("#selMovelineType").val(makeTemp.rectangleMap[objIndex].selMovelineType);
            }
        });

        $(".dragContainer").hover(function(e){
            $(this).find(".closeBtn").show();
        },function(){
            $(this).find(".closeBtn").hide();
        });       
        this.dragDiv = $("<div class='dragDiv' id='dragDiv" + this.divIndex + "'></div>");
        this.zoomDiv = $("<div class='zoomDiv' id='zoomDiv" + this.divIndex + "'></div>")
        this.dragArea.append(this.dragDiv);
        this.dragArea.append(this.zoomDiv);
        
        new Zoom("dragDiv" + this.divIndex, "dragContainer" + this.divIndex, "zoomDiv" + this.divIndex);
        /*$(".zoomDiv").unbind("click").bind("click", function(e){
            makeTemp.hasMove = false;
        });*/
        $(".zoomDiv,.dragDiv").mouseup(function(e) {
            makeTemp.hasMove = false;
        });
        $(".zoomDiv,.dragDiv").mousedown(function(e) {
            makeTemp.hasMove = false;
        });
        
        $("#itemName").val(this.createNewItemName());
        $("#selectType option:first").prop("selected", 'selected');
        $("#selMovelineType option:first").prop("selected", 'selected');
        
        var item = new Object();
        item.left = this.x;
        item.top = this.y;
        item.width = this.endX;
        item.height = this.endY;
        item.id = "dragContainer" + this.divIndex;
        item.itemName = $("#itemName").val();
        item.selectType = $("#selectType").val();
        item.selMovelineType = $("#selMovelineType").val();
        this.rectangleMap.push(item);
        this.unDoList.push({flag:this.Action.ADD, index:this.rectangleMap.length-1, item:item});        
        this.divIndex++;

        $("#myCanvas").focus();
        $("#rectTipId").hide();
        $("#rectTipId").css({
            "width": "0px",
            "height": "0px"
        });
    },
    
    redrawRectangle: function(p,cxt) {
        var savedRect = [];
        this.rectangleMap.forEach(function(v, i) {
            $("#rectTipId").hide();
            if (p && cxt.isPointInPath(p.x, p.y)) {
                savedRect.push(i);
            }
        });
        $("#myCanvas").focus();
        $("#rectTipId").hide();
        $("#rectTipId").css({
            "width": "0px",
            "height": "0px"
        });
        return savedRect;
    },
    /*后退*/
    unDo: function() {
         var lastAction = this.unDoList.pop();
         if(typeof(lastAction) !== "undefined") {
             if(lastAction.flag == this.Action.ADD){
                this.rectangleMap[lastAction.index] = {};
                $("#" + lastAction.item.id).hide();
             } else {
                this.rectangleMap[lastAction.index] = lastAction.item;
                $("#" + lastAction.item.id).show();
             }
            this.reDoList.push(lastAction);
         }
         if($(".dragContainer.selected").css("display") == "none") {
            this.clearItemArea();
            $(".dragContainer").removeClass("selected");
         }
    },
    /*前进*/
    reDo: function() {
         var lastAction = this.reDoList.pop();
         if(typeof(lastAction) !== "undefined") {
             if(lastAction.flag == this.Action.ADD){
                this.rectangleMap[lastAction.index] = lastAction.item;
                $("#" + lastAction.item.id).show();
             } else {
                this.rectangleMap[lastAction.index] = {};
                $("#" + lastAction.item.id).hide();
             }
            this.unDoList.push(lastAction);
         }
         if($(".dragContainer.selected").css("display") == "none") {
            $("#itemName").val("");
            $("#selectType").val("");
            $("#selMovelineType").val("");
            $(".dragContainer").removeClass("selected");
         }
    },
    /*放大*/
    zoomin: function() {
        var img = document.getElementById("imgId");
        this.canvasWidth = this.canvasWidth * 1.1;
        this.canvasHeight =  this.canvasHeight * 1.1;
        this.rate = this.rate * 1.1;
        $("#myCanvas").attr("width",  this.canvasWidth);
        $("#myCanvas").attr("height",  this.canvasHeight);
        this.cxt.clearRect(0, 0, img.width, img.height);
        this.cxt.drawImage(img, 0, 0,  this.canvasWidth, this.canvasHeight);
        $.each(this.rectangleMap, function(i, item) {
            if(typeof(item.id) !== "undefined") {
                $("#" + item.id).css("width", $("#" + item.id)[0].offsetWidth * 1.1);
                $("#" + item.id).css("height", $("#" + item.id)[0].offsetHeight * 1.1);
                $("#" + item.id).css("left", $("#" + item.id)[0].offsetLeft * 1.1);
                $("#" + item.id).css("top", $("#" + item.id)[0].offsetTop * 1.1);
            }
        });

    },
    /*缩小*/
    zoomout: function() {
        var img = document.getElementById("imgId");
        this.canvasWidth = this.canvasWidth / 1.1;
        this.canvasHeight = this.canvasHeight / 1.1;
        this.rate = this.rate / 1.1;
        $("#myCanvas").attr("width", this.canvasWidth);
        $("#myCanvas").attr("height", this.canvasHeight);
        this.cxt.clearRect(0, 0, img.width, img.height);
        this.cxt.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
        $.each(this.rectangleMap, function(i, item) {
            if(typeof(item.id) !== "undefined") {
                $("#" + item.id).css("width", $("#" + item.id)[0].offsetWidth / 1.1);
                $("#" + item.id).css("height", $("#" + item.id)[0].offsetHeight / 1.1);
                $("#" + item.id).css("left", $("#" + item.id)[0].offsetLeft / 1.1);
                $("#" + item.id).css("top", $("#" + item.id)[0].offsetTop / 1.1);
            }                
        });
    },
    /*生成默认Itemm名*/
    createNewItemName: function() {
        this.itemNameIndex++;
        return "item"+this.itemNameIndex;
    },
    /*从id里取得序号*/
    getIndexFromId: function(id){
        return id.substring(13)*1;
    }

}
$(document).ready(function() {
    makeTemp.init();
});