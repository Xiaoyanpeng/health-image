var suggest_vm= new Vue({
    el:'#suggest_app',
    data:{
        suggHeader:[],//头条建议
        suggAllMsg:{},
        allServices:[],//所有服务
    },
})

suggest_vm.$watch('suggAllMsg', function () {
    $("#frame").sly({
        horizontal: 1,
        itemNav: "basic",
        dragContent: 1,
        scrollBy: 0,
        easing: "swing",
        prev: $('#beforebtn'),
        next: $('#afterbtn'),
        smart:true,
        activateOn: 'click',
        mouseDragging: 0,
        touchDragging: 0,
        releaseSwing: 1,
        startAt:0,
    })
})

$(function(){
    //请求数据
    var patientCode = localStorage.patientCode;
    DataService.getPatientInfo({patientCode:patientCode}).then(function(res){
        if(res.status == 200 ){
            var str = res.patient.suggests;
            var arr = [];
            for (var key in str) {
                arr.push(str[key][0])
            }
            suggest_vm.suggHeader = arr;
            suggest_vm.suggAllMsg = str;
        }

        setTimeout(function() {
            //切换文章事件
            $('#frame').sly('on', 'change', function(){
                var first = $('#frame ul li:first');
                var last = $('#frame ul li:last');
                $('#afterbtn').show();
                $('#beforebtn').show();
                if(last.hasClass('active')){
                    $('#afterbtn').hide()
                }
                if(first.hasClass('active')){
                    $('#beforebtn').hide()
                }
            })
        }, 200);
            
    },function err(){}).catch(function(){})

    DataService.findPortraitServices({userCode:patientCode}).then(function(res){
        if(res.status == 200 ){
            suggest_vm.allServices = res.data[0];
        }
    },function err(){}).catch(function(){})    
 })



 