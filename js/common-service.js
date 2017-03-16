/*
*须先引入：common-http.js 
*/
(function(exports,http) {
	
	// 请求方式
	var METHOD = {
		GET: 'GET',
		POST: 'POST'
	}
	
	// REST API
	var ENDPOINTS = {
		// 获取用户列表
		getPatientList: 'patient/getPatientList',
		// 获取用户基本数据
		getPatientInfo: 'patient/getPatientInfo',
		// 根据标签ID查找标签信息接口
		findPortraitById: 'portrait/findPortraitById',
		// 获取疾病-所在区域接口
		getPortraitsTown: 'portrait/getPortraitsTown',
		// 获取疾病-所在年龄接口
		getPortraitsAge: 'portrait/getPortraitsAge',
		// 获取疾病-所在性别接口
		getPortraitsSex: 'portrait/getPortraitsSex',
		// 获取区域情况分布和近期分布接口
		getPortraitsLevel1: 'portrait/getPortraitsLevel1',
		// 获取患者建议
		getPatientSuggest: '/suggest/getPatientSuggest',
		// 根据code查询患者的就诊事件
		getVisits: 'disease/getVisits',
		// 根据code查询患者的检查检验(待确定)
		getInspections: 'disease/getInspections',
		// 获取体征数据
		healthIndex: 'health/healthIndex',
		//系统字典 常用药物
		getDictByDictName: 'dict/getDictByDictName',
		// 健康教育文章
		getHealthArticle:'/health/article/findByKeyword',
		//标签全部服务
		findPortraitServices:'portrait/findPortraitServices' ,
	}
	
	var DataService = {
		getPatientList: function() {
			return http.getReqPromise(ENDPOINTS.getPatientList,null,METHOD.GET)
		},
		getPatientInfo: function(data) {
			return http.getReqPromise(ENDPOINTS.getPatientInfo,data,METHOD.GET)
		},
		findPortraitById: function(data) {
			return http.getReqPromise(ENDPOINTS.findPortraitById,data,METHOD.GET)
		},
		getPortraitsTown: function(data) {
			return http.getReqPromise(ENDPOINTS.getPortraitsTown,data,METHOD.GET)
		},
		getPortraitsAge: function(data) {
			return http.getReqPromise(ENDPOINTS.getPortraitsAge,data,METHOD.GET)
		},
		getPortraitsSex: function(data) {
			return http.getReqPromise(ENDPOINTS.getPortraitsSex,data,METHOD.GET)
		},
		getPortraitsLevel1: function(data) {
			return http.getReqPromise(ENDPOINTS.getPortraitsLevel1,data,METHOD.GET)
		},
		getPatientSuggest: function(data) {
			return http.getReqPromise(ENDPOINTS.getPatientSuggest,data,METHOD.GET)
		},
		getVisits: function(data) {
			return http.getReqPromise(ENDPOINTS.getVisits,data,METHOD.GET)
		},
		getInspections: function(data) {
			return http.getReqPromise(ENDPOINTS.getInspections,data,METHOD.GET)
		},
		healthIndex: function(data) {
			return http.getReqPromise(ENDPOINTS.healthIndex,data,METHOD.GET)
		},
		getDictByDictName:function(data) {
			return http.getReqPromise(ENDPOINTS.getDictByDictName,data,METHOD.GET)
		},
		getHealthArticle: function(data) {
			return http.getReqPromise(ENDPOINTS.getHealthArticle,data,METHOD.GET)
		},
		findPortraitServices: function(data) {
			return http.getReqPromise(ENDPOINTS.findPortraitServices,data,METHOD.GET)
		},
		
	};
	exports.DataService = DataService;
})(window,CommonHttp);