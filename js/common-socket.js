/*
* 须先引入：jquery.js es6-promise.js ui-im-dialog.js
*/
(function($,exports,undefined) {
	//切换发布版本 true：正式版，连接生产环境；false：测试版，连接测试环境。
	var publish_version = false ;
	var socketUrl = "";

	if(publish_version == true) {
		socketUrl = "http://192.168.131.102:3008/";
	} 
	else {
		socketUrl = "http://192.168.131.102:3008/";
	}
	
	CommonSocket = {
		createSocketConnect: function (userId){
			jQuery.getScript(socketUrl+"socket.io/socket.io.js?"+Math.random()).done(function() {
				var socket = io.connect(socketUrl);
				socket.emit('login', {userId: '915d01c1-5b1d-11e6-8344-fa163111ee56', password: 111,sessionId:111,clientType:"demo"});
				socket.on('message', function (res) {
					if(res.data) {
						var data = JSON.parse(res.data);
						IMDialog.show(data.type,data);
					}
				});
			
				socket.on('error', function (res) {
			    	console.log(res);
				});
			
				socket.on('ack', function (res) {
			    	console.log(res);
				});	
		
			})
		 	.fail(function() {
		 		reject("对话连接获取失败")
			});
		}
	}
	
	// 导出CommonSocket
	exports.CommonSocket = CommonSocket;
})(jQuery,window);

