var yearNum;
var seeDoctor_vm = new Vue({
    el:'#seedoctor_app',
    data:{
        showSection:0, //就诊 历史
        arrYearBack:[],//倒序年份
        arrYear:[],//正序年份
        arrYearData:[],//年份数据
        arrYearBackHis:[],//倒序年份 历史
        arrYearHis:[],//正序年份
        arrYearDataHis:[],//年份数据
        sickYear:'',
        seeTimer:'',
        hosTimer:'',
        newseeEve:{},
        medicine:[],
    }
})

seeDoctor_vm.$watch('arrYearData', function () {
    startSly();
})
seeDoctor_vm.$watch('arrYearDataHis', function () {
    startSly2();
})

    //sly配置
    function startSly(){
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
    }
    function startSly2(){
        yearNum = $('#frame2 ul li').length - 1; //计算个数
        $("#frame2").sly({
            horizontal: 1,
            itemNav: "forceCentered",
            dragContent: 1,
            scrollBy: 1,
            easing: "easeOutBack",
            prev: $('#beforebtn2'),
            next: $('#afterbtn2'),
            smart:true,
            activateOn: 'click',
            mouseDragging: 0,
            touchDragging: 0,
            releaseSwing: 1,
            startAt:yearNum,
        });
    }

$(function(){
    //请求数据
    var patientCode = localStorage.patientCode;
    var icdName = localStorage.healthType;
    DataService.getVisits({patientCode:patientCode,icdName:icdName}).then(function(res){
        if(res.status == 200 ){
            var str = res.list;
            var newseeEve = _.pick(res.list[0], 'time');
            var result = queryDataAnalysis(str);//数据处理
            //统计
            var seeTimer = _.countBy(str, function(num){
                return num.typeName == '门诊' ? 'yes': 'no';
            })
            var hosTimer = _.countBy(str, function(num){
                return num.typeName == '住院' ? true: false;
            })
            if(!seeTimer.yes){ seeTimer.yes = 0; }
            if(!hosTimer.yes){ hosTimer.yes = 0; }

            seeDoctor_vm.seeTimer = seeTimer.yes;
            seeDoctor_vm.hosTimer = hosTimer.yes;
            seeDoctor_vm.newseeEve = newseeEve;
            seeDoctor_vm.arrYearData = result.arrYearData; 
            seeDoctor_vm.arrYearBack = result.arrYearBack;
            seeDoctor_vm.arrYear = result.arrYear;
            seeDoctor_vm.sickYear = result.sickYear;
            setTimeout(function() {
                startEve();
            }, 200);
        }
    },function err(){}).catch(function(){})

    //常用药物
    var dictByName;
    if(icdName == '糖尿病'){ dictByName = 'TNB_YY';};
    if(icdName == '高血压'){ dictByName = 'GXY_YY' };
    DataService.getDictByDictName({name:dictByName}).then(function(res){
        if(res.status == 200 ){
            seeDoctor_vm.medicine = res.dict;
        }
    },function err(){}).catch(function(){})

    //就诊事件与历史检查请求数据处理
    function queryDataAnalysis(str){
        var arrYearBack = [];//倒序年份
        var arrYear = [];//正序年份
        var arrYearData = [];//年份数据
        var nowYear = new Date().getFullYear();//今年
        var lastYear = JSON.parse(_.last(str).time.split('-')[0]);//最小一年
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
        var sickYear = nowYear - lastYear;//患病年数
        return {arrYearData:arrYearData,arrYearBack:arrYearBack,arrYear:arrYear,sickYear:sickYear}
    }

    //初始事件
    function startEve(){
        countLineH($('#tree_year'));
        changeActive($('#tree_year li:first .j-showBtn')); //初始年份展开
        //切换年份事件 
        $('#frame').sly('on', 'change', function(){
            var num = yearNum - $('#frame ul li.active').data('year');
            var $this = $('#tree_year').children().eq(num);
            oneShow($this);
            countLineH($('#tree_year'));
            scrollToPos(100*num);
        })
    }
    function startEve2(){
        countLineH($('#tree_year2'));
        changeActive($('#tree_year2 li:first .j-showBtn')); //初始年份展开
        //切换年份事件 
        $('#frame2').sly('on', 'change', function(){
            var num = yearNum - $('#frame2 ul li.active').data('year');
            var $this = $('#tree_year2').children().eq(num);
            oneShow($this);
            countLineH($('#tree_year2'));
            scrollToPos(100*num);
        })
    }

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
    function countLineH(obj){
        var docuH = obj.height();
        var treeH;
        var see_treeH;//疾病详情信息（就诊）专用
        if(docuH > 901){
            treeH = 200;
        }else{
            treeH = 901 - obj.height();
        }
        if(docuH > 559){
            see_treeH = 100;
        }else{
            see_treeH = 559 - obj.height();
        }
        $('#see_line_height').css('height',see_treeH);
        $('#see_line_height2').css('height',see_treeH);
    }
    

//年份展开
    $('#tree_year').on('click','.j-showBtn',function(){
        var $that = $(this);
        changeActive($that);
        countLineH($('#tree_year'));
        var route = $that.offset().top -179;
        scrollToPos(route);
    })
    $('#tree_year2').on('click','.j-showBtn',function(){
        var $that = $(this);
        changeActive($that);
        countLineH($('#tree_year2'));
        var route = $that.offset().top -179;
        scrollToPos(route);
    })

    $('#see_type li').click(function(){
        var that = $(this)
        if(!that.hasClass('active')){
            that.addClass('active').siblings().removeClass('active');
            seeDoctor_vm.showSection = that.data('id');
            if(that.data('id') == 1){
                //请求历史情况
                DataService.getInspections({patientCode:patientCode,icdName:icdName}).then(function(res){
                    if(res.status == 200 ){
                        var str = res.list;
                        var arrYearBack = [];//倒序年份
                        var arrYear = [];//正序年份
                        var arrYearData = [];//年份数据
                        var result = queryDataAnalysis(str);//数据处理
                        seeDoctor_vm.arrYearDataHis = result.arrYearData; 
                        seeDoctor_vm.arrYearBackHis = result.arrYearBack;
                        seeDoctor_vm.arrYearHis = result.arrYear;
                        setTimeout(function() {
                            startEve2();
                        }, 200);
                    }
                },function err(){}).catch(function(){})

            }
        }
    })

})



    
