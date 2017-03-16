var residentCode;
var resi_index_vm = new Vue({
    el:'#resident_app',
    data:{
        tagData:[
            {name:'健康评估',text:''},
            {name:'健康建议',text:''},
            {name:'推荐服务',text:''},
        ],//标签详情
        recommendService:'',//推荐服务
        suggestData:[],//健康建议
        peopleType:'',//切换示例
        resultData:[],//标签
        peopleMsg:{},//姓名，性别
        examList:[],//例子类型
    },
})

$(function(){
    DataService.getPatientList().then(function(res){
        if(res.status == 200 ){
            //获取示例类型
            var patients = res.patient;
            var clazzs = {"糖尿病示例":"diabetes","高血压示例":"highblood","老年人示例":"older","自主体验（男）":"man",}
            resi_index_vm.examList = _.map(patients,function(p) {
                return $.extend({},p, {clazz: clazzs[p.name]});
            })
            residentCode = patients[0].code;
            localStorage.patientCode = residentCode;//储存code

            //展示人物数据 标签 建议
            DataService.getPatientInfo({patientCode:patients[0].code}).then(function(res){
                if(res.status == 200 ){
                    resi_index_vm.peopleType = 0;
                    resi_index_vm.peopleMsg = res.patient;
                    var str = res.patient.suggests;
                    var arr = [];
                    for (var key in str) {
                        arr.push(str[key][0])
                    }
                    resi_index_vm.suggestData = arr;
                    resi_index_vm.resultData = res.patient.userPortraits;//标签
                    setTimeout(function () { showAdvice()}, 1500);//显示健康建议
                    $('#exam_list li:first').addClass('active');
                }else{}  
            },function err(){}).catch(function(){})

        }else{}  
    },function err(){
        alert('请求异常，请检查网络');
    }).catch(function(){})


    //切换active控制显示
    function changeActiveShow(obj1,obj2){
        if(obj1.hasClass('active')){
            obj1.removeClass('active');
            obj2.css({display:'none'})
        }else{
            obj1.addClass('active');
            obj2.css({display:'inline-block'})
        }
    }
    //点击切换active
    function changeActive(obj){
        if(!obj.hasClass('active')){
            obj.addClass('active').siblings().removeClass('active');
        }
    }
    //关闭按钮
    function closeBtn(obj){
        obj.hide();
    }
    //隐藏，移除active
    function closeActive(obj1,obj2){
        obj1.hide();
        obj2.removeClass('active');
    }
    //清除数据
    function clearData(){
        resi_index_vm.resultData=[];
    }
    //弹出标签内容
    function showAlert(){
        $('#tag_main').animate({right:'show'},500);
    }
    //显示健康建议
    function showAdvice(){
        $('#resi_sugg').animate({left:'show'},500);
    }

//切换示例
   $('#change_example').click(function(){
       var $that1 = $(this);
       var $that2 = $('#exam_list');
       changeActiveShow($that1,$that2);//示例图标变色
   })

   $('#exam_list').on('click','li',function(){
        var that = $(this);
        if(!that.hasClass('active')){
            clearData();
            closeBtn($('#tag_main'));
            closeBtn($('#resi_sugg'));

            residentCode = that.data('code');
            localStorage.patientCode = residentCode;//储存code

            DataService.getPatientInfo({patientCode:that.data('code')}).then(function(res){
                resi_index_vm.peopleType = that.data('id');
                if(res.status == 200 ){
                    resi_index_vm.peopleMsg = res.patient;
                    var str = res.patient.suggests;
                    var arr = [];
                    for (var key in str) {
                        arr.push(str[key][0])
                    }
                    resi_index_vm.suggestData = arr;
                    resi_index_vm.resultData = res.patient.userPortraits;//标签

                    setTimeout(function () { showAdvice()}, 3000);//显示健康建议
                }else{}  
            },function err(){}).catch(function(){})

            changeActive(that);  //卡片变色
        }
        closeActive($('#exam_list'),$('#change_example')) //关闭效果
   })

//查看更多
   $('#change_more').click(function(){
       var $that1 = $(this);
       var $that2 = $('#more_list');
       changeActiveShow($that1,$that2);
   })

   $('#more_list li').on('click',function(){
       var that = $(this);
       changeActive(that);  //卡片变色
       closeActive($('#more_list'),$('#change_more')) //关闭效果
   })

//关闭标签内容
    function closeTagText(){
        closeBtn($('#tag_main'));
        resi_index_vm.tagData[0].text = '';
        resi_index_vm.tagData[1].text = '';
        resi_index_vm.recommendService = [];
    }
    $('#tag_close').click(function(){
        closeTagText();
    })

//点击标签
    $('#result_tag').on('click','li',function(){
        var that = $(this);
        var $id = that.data('id');

        //请求标签信息
        DataService.findPortraitById({id:$id}).then(function(res){
            if(res.status == 200 ){
                resi_index_vm.tagData[0].text = res.data.healthAppraise;
                resi_index_vm.tagData[1].text = res.data.healthSuggest;
                resi_index_vm.recommendService = JSON.parse(res.data.recommendService);
                //标签显示 空值不显示
                if(!!resi_index_vm.tagData[0].text || !!resi_index_vm.tagData[1].text || !!resi_index_vm.recommendService){
                    $('#tag_main').animate({right:'show'},500);
                    localStorage.healthType = res.data.value;//储存犯病类型
                }else{
                    closeTagText();
                } 
            }else{}  
        },function err(){}).catch(function(){})
    })

//链接跳转
    function gotoURL(url){
        window.location.href=url+'?patientCode='+residentCode;
    }
    //个人信息
    $('#user_info').click(function(){
        gotoURL('../user-info/user-info.html');
    })
})
