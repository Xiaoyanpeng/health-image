
(function($,exports,undefined) {
	var CommonUtil = {
		//获取链接上的参数
		GetRequest: function() {  
		   var url = location.search; //获取url中"?"符后的字串
		   var theRequest = new Object();
		   if (url.indexOf("?") != -1) {
			  var str = url.substr(1);
			  strs = str.split("&");
			  for(var i = 0; i < strs.length; i ++) {
				 theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
			  }
		   }
		   return theRequest;
		}
	}
	
	// 导出CommonUtil
	exports.CommonUtil = CommonUtil;
})(jQuery,window);

Date.prototype.format = function(format){ 
	var o = { 
	"M+" : this.getMonth()+1, //month 
	"d+" : this.getDate(), //day 
	"h+" : this.getHours(), //hour 
	"m+" : this.getMinutes(), //minute 
	"s+" : this.getSeconds(), //second 
	"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
	"S" : this.getMilliseconds() //millisecond 
	} 
	
	if(/(y+)/.test(format)) { 
	format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 
	
	for(var k in o) { 
	if(new RegExp("("+ k +")").test(format)) { 
	format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
	} 
	} 
	return format; 
} 