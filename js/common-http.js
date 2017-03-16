/*
* 须先引入：jquery.js underscore.js es6-promise.js 
*/

(function($,exports,undefined) {
	//切换发布版本 true：正式版，连接生产环境；false：测试版，连接测试环境。
	var publish_version = false ;
	var serverUrl = "";

	if(publish_version == true) {
		serverUrl = "http://172.19.103.87:8085/figure/";
	} 
	else {
		serverUrl = "http://172.19.103.87:8085/figure/";
	}

	var CommonHttp = {
		// 统一请求ajax发送方法
		httpRequest: function (url, params, error, success, reqType, async, timeout) {
			// 增加绝对URL（含有http://及https://）的判断，以满足跨域请求（yzh）
			var reqUrl = serverUrl + url;
			if(url&&(url.indexOf("http://")>-1 || url.indexOf("https://")>-1)) {
				reqUrl = url;
			}
			$.ajax(reqUrl, {
				data: params || {},
				dataType: 'json',
				async: (async === false)?false: true,
				type: reqType,
				timeout: timeout || 20000, 
				error: function(xht, type, throwErr) {
					error && error();
				},
				success: function(res) {
					success && success(res);
				}
			});
		},
		
		/**
		 * 统一请求ajax发送方法
		 * url 请求地址：例如：patient/health_index/add
		 * params 请求参数
		 * dataType 数据类型：json等
		 * reqType 请求方式:get
		 * error 请求失败处理方法
		 * success 请求成功处理方法
		 */
		sendGet: function (url, params, error, success, timeout){
			this.httpRequest(url, params, error, success, "GET", true, timeout);
		},
		/**
		 * 统一请求ajax发送方法
		 * url 请求地址：例如：patient/health_index/add
		 * params 请求参数
		 * dataType 数据类型：json等
		 * reqType 请求方式:post
		 * error 请求失败处理方法
		 * success 请求成功处理方法
		 */
		sendPost: function (url, params, custError, custSuccess, timeOut) {
			this.httpRequest(url, params, error, success, "POST", true, timeout);
		},
		
		getReqPromise: function(url, data, reqType) {
			var _this = this;
			var sendMethod = (reqType && reqType.toUpperCase()=='POST')? "sendPost": "sendGet";
			return new Promise(function(resolve, reject) {
				_this[sendMethod](url, data,
				function err (xht, type, throwErr) {
					reject(xht, type, throwErr)
				}
				, function success(res) {
					resolve(res); 
				},reqType);
			})
		},
		
		/**
		 * reqs: 请求的参数数组，格式：[{url:'a/xxx', reqType: 'POST', data:{...}},{url:'b/xxx',data:{...}}]
		 */
		getReqPromises: function (reqs, newWay) {
			if(!reqs || !reqs.length) {
				return new Promise(function(resolve, reject) {
					resolve([]);
				});
			}
			reqs = _.filter(reqs,function(req) {
				return req!=null
			});
			return Promise.all(_.map(reqs,function(param){
				return this.getReqPromise(param.url,param.data, param.reqType);
			}));
		}
		
	}
	
	// 导出CommonHttp
	exports.CommonHttp = CommonHttp;
})(jQuery,window);
