var yearNum;
var healthFile_vm = new Vue({
    el:'#health_app',
    data:{
        arrYearBack:[],//倒序年份
        arrYear:[],//正序年份
        arrYearData:[],//年份数据
    }
})
healthFile_vm.$watch('arrYearData', function () {
    yearNum = $('#frame ul li').length - 1; //计算个数
    $("#frame").sly({
        horizontal: 1,
        itemNav: "forceCentered",
        dragContent: 1,
        scrollBy: 1,
        easing: "easeOutBack",
        prev: $('#beforebtn'),
        next: $('#afterbtn'),
        smart:true,
        activateOn: 'click',
        mouseDragging: 0,
        touchDragging: 0,
        releaseSwing: 1,
        startAt:yearNum,
    });
})
$(function(){
    //请求数据
    var patientCode = localStorage.patientCode;
    DataService.getVisits({patientCode:patientCode}).then(function(res){
        if(res.status == 200 ){
            var str = res.list;
            var nowYear = new Date().getFullYear();//今年
            var lastYear = JSON.parse(_.last(str).time.split('-')[0]);//最小一年
            var arrYearBack = [];//倒序年份
            var arrYear = [];//正序年份
            var arrYearData = [];//年份数据
            for(var i=nowYear;i>=lastYear;i--){
                arrYearBack.unshift(i);
                arrYear.push(i);
                var data = _.groupBy(str,function(n){ return n.time >= i+"-01-01" && n.time < (i+1)+"-01-01"}).true;
                var newdata = _.map(data,function(num){
                     num.time = num.time.substr(5);
                     return num;
                })
                arrYearData.push(newdata);
            }

            healthFile_vm.arrYearBack = arrYearBack;
            healthFile_vm.arrYear = arrYear;
            healthFile_vm.arrYearData = arrYearData; 

            setTimeout(function() {
                countLineH();
                changeActive($('#tree_year li:first .j-showBtn')); //初始年份展开
                //切换年份事件 
                $('#frame').sly('on', 'change', function(){
                        var num = yearNum - $('#frame ul li.active').data('year');
                        var $this = $('#tree_year').children().eq(num);
                        oneShow($this);
                        countLineH();
                        scrollToPos(100*num);
                    })
            }, 200);
        }

    },function err(){}).catch(function(){})


    //切换添加active来控制显示
    function changeActive(obj){
        if(obj.hasClass('active')){
            obj.removeClass('active');
            obj.siblings('.j-treeDetail').hide();
        }else{
            obj.addClass('active');
            obj.siblings('.j-treeDetail').show();
        }
    }
    //只有一个展开
    function oneShow(obj){
        var btn = obj.find('.j-showBtn');
        var list = obj.find('.j-treeDetail');
        if(! btn.hasClass('active')){
            btn.addClass('active');
            obj.siblings().find('.j-showBtn').removeClass('active');
            list.show();
            obj.siblings().find('.j-treeDetail').hide();
        }
    }
    //滚到指定位置
    function scrollToPos(n){
        $('.time-tree').animate({scrollTop:n},500);
    }

    //计算底部线高
    function countLineH(){
        var docuH = $('#tree_year').height();
        var treeH;
        var see_treeH;//疾病详情信息（就诊）专用
        if(docuH > 901){
            treeH = 200;
        }else{
            treeH = 901 - $('#tree_year').height();
        }
        $('#line_height').css('height',treeH);
        if(docuH > 559){
            see_treeH = 100;
        }else{
            see_treeH = 559 - $('#tree_year').height();
        }
        $('#see_line_height').css('height',see_treeH);
    }
    

//年份展开
    $('#tree_year').on('click','.j-showBtn',function(){
        var $that = $(this);
        changeActive($that);
        countLineH();
        var route = $that.offset().top -179;
        scrollToPos(route);
    })

})
