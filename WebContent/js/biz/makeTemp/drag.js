(function() {
	function Drag(drager,dragContainer)
	{
		this.drager=$$(drager);
		this.dragContainer=$$(dragContainer);
		this.drager.style.cursor="move";
		this.DragHandler();
	}
	Drag.prototype={
		DragHandler:function()
		{
			var drager=this.drager;
			var dragContainer=this.dragContainer;
			drager.onmousedown=function(e)
			{
				var e=e||window.event;
				var oldLeft=dragContainer.offsetLeft;
				var oldTop=dragContainer.offsetTop;
				var oldX=e.clientX;
				var oldY=e.clientY;
				document.onmousemove=function(e)
				{
					var e=e||window.event;
					var mouseX=e.clientX;
					var mouseY=e.clientY;
					var newX=parseInt(mouseX)-parseInt(oldX)+parseInt(oldLeft);
					var newY=parseInt(mouseY)-parseInt(oldY)+parseInt(oldTop);
					dragContainer.style.left=newX+"px";
					dragContainer.style.top=newY+"px";
					return false;
				}
				document.onmouseup=function(e)
				{
					document.onmousemove=null;
					document.onmouseup=null;
					return false;					
				}
				return false;
			}
		}
	}
	function Zoom(drager,dragContainer,zoom)
	{
		this.dragContainer=$$(dragContainer);
		//this.defaultWH={"width":this.dragContainer.offsetWidth,"height":this.dragContainer.offsetHeight};
		this.defaultWH={"width":20,"height":20};
		var drag=new Drag(drager,dragContainer);
		this.zoom=$$(zoom);
		this.zoom.style.cursor="se-resize";
		this.goMove();
	}
	Zoom.prototype={
		goMove:function()
		{
			var dragContainer=this.dragContainer;
			var defaultWH=this.defaultWH;
			var zoom=this.zoom;
			zoom.onmousedown=function(e)
			{
				var e=e||window.event;
				var oldLeft=zoom.offsetLeft;
				var oldTop=zoom.offsetTop;
				var oldX=e.clientX;
				var oldY=e.clientY;
				document.onmousemove=function(e)
				{
					var e=e||window.event;
					var newX=e.clientX;
					var newY=e.clientY;
					var w=newX-oldX+oldLeft+zoom.offsetWidth;
					var h=newY-oldY+oldTop+zoom.offsetHeight;
					w=Math.max(w,defaultWH.width);
					h=Math.max(h,defaultWH.height);
					dragContainer.style.width=w+"px";
					dragContainer.style.height=h+"px";
					return false;
				}
				document.onmouseup=function(e)
				{
					document.onmousemove=null;
					document.onmouseup=null;
					return false;
				}
				return false;								
			}
		}
	}
	window.Drag=Drag;
	window.Zoom=Zoom;
})(window)

function $$(id)
{
	return document.getElementById(id);
}
