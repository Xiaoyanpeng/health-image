$(function () {
    var Request = CommonUtil.GetRequest(),
    	patientCode = Request.patientCode||'test2';
    
    var infoVM = new Vue({
	    el:'#info_wrap',
	    data:{
	        patient: {},
	        medicalHistory: []
	    },
	    methods: {
	    	activeNavItem: function(index,event) {
	    		var ele = event.target;
	    		$(ele).addClass('n-active').siblings().removeClass('n-active');
	    		$('.j-pop-con').hide().eq(index).show();
	    	},
	    	goBack: function() {
	    		window.history.go(-1);
	    	}
	    }
	})
    
    function  init () {
        
        DataService.getPatientInfo({patientCode: patientCode})
        .then(function(data) {
        	if(data.status == 200) {
        		
        		var paitent = $.extend(true, {}, data.patient);
        		infoVM.patient = data.patient;
        		infoVM.medicalHistory = _.chain([ {'label':'个人史','key':'grs'},
        				{'label':'家族史','key':'jzs'},
        				{'label':'婚育史','key':'hys'},
        				{'label':'现病史','key':'xbs'},
        				{'label':'既往史','key':'jws'}
        		]).map(function(o) {
        			return {
        				label: o.label,
        				content: paitent[o.key] || ""
        			}
        		}).value();

        	} else {
        		dialog({contentType:'tipsbox',bottom:true, skin:'bk-popup' , content:data.msg}).show();
        	}
        })
        
        CommonSocket.createSocketConnect();
    }
    
    init();
});