(function($, exports) {
	var tpl = '<div class="um-pop-mian animated">'
            		+'<a class="um-c" href="javascript:void(0)"></a>'
            		+'<h2 class="um-pop-tit">您有新的<span class="j-um-w">{{typeName}}</span>消息</h2>'
            		+'<div class="um-pop-con">'
	                	+'<div class="um-pop-con-m">'
	                	+'{{inner}}'
	                	+'</div>'
	                +'</div>'
	            +'</div>';
	var umBsTmp = '<p><span class="um-time">{{time}}</span> 测量的血糖为<span class="um-xt {{staclass}}">{{value}}</span>mmol/L</p>'
				  +'<p>您的<span class="um-s {{staclass}}">血糖{{result}}</span>，{{msg}}</p>';
	var umBpTmp = '<p><span class="um-time">{{time}}</span> 测量的血压数据为</p>'
				+'<p class="um-bp">舒张压：<span class="um-s {{szyclass}}">{{szy}}</span>kpa</p>'
				+'<p class="um-bp">收缩率：<span class="um-s {{ssyclass}}">{{ssy}}</span>kpa</p>'
				+'<p class="um-bp">心&nbsp;&nbsp;&nbsp;率：<span class="um-s {{rateclass}}">{{heartRate}}</span>bpm</p>';
				
	//文本替换
    function render (t, d) {
        return t.replace(/\{\{(\w+)\}\}/g, function(m, $1){
            return d[$1];
        });
    }
    
    function getLevel(level) {
    	if(level==0) {
			return {
				clazz: 'normal',
				result: '正常'
			}
		} else if(level<0) {
			return {
				clazz: 'lower',
				result: '偏低'
			}
		} else if(level>0) {
			return {
				clazz: 'heigher',
				result: '偏高'
			}
		}
    }
    
    var IMDialog = {
    	show: function(type,data) {
    		var html = '';
    		var innerHtml = '';
    		var typeName = '';
    		if(type=="1") {
    				typeName = "血糖";
	    			var date = new Date(data.time);
	    			var level = getLevel(data.level)
	    			innerHtml = render(umBsTmp,{
	    				time: date.format('hh:mm'),
	    				staclass: level.clazz,
	    				result: level.result,
	    				msg: data.msg,
	    				value: data.value ||''
	    			})
	    	} else if(type=="2") {
	  			typeName = "血压";
	    		var ssyLevel = getLevel(data.ssyLevel),
	    			szyLevel = getLevel(data.szyLevel),
	    			heartRateLevel = getLevel(data.heartRateLevel);
	    		var date = new Date(data.time);	
	    		innerHtml = render(umBpTmp,{
					time: date.format('hh:mm'),
					szy: data.szy,
					ssy: data.ssy,
					heartRate: data.heartRate,
					szyclass: szyLevel.clazz,
					ssyclass: ssyLevel.clazz,
					rateclass: heartRateLevel.clazz
				})
	    	}
	    	if(innerHtml) {
	    		html = render(tpl,{inner: innerHtml,typeName:typeName});
	    		var $dialog = $(html).addClass('slideInUp');
	    		$(document.body).append($dialog);
	    	}
    	}
    }
    
    $(document.body).on('click','.um-pop-mian .um-c',function() {
    	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    	var $dialog = $(this).closest('.um-pop-mian');
    	$dialog.removeClass('slideInUp').addClass('slideOutDown').one(animationEnd, function() {
            $dialog.remove();
        });;
    });
    exports.IMDialog = IMDialog;
})(jQuery, window);
