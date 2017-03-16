var article_vm= new Vue({
    el:'#articles_app',
    data:{
        articles:[],
    }
})

article_vm.$watch('articles', function () {
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
    var healthType = localStorage.healthType;
    DataService.getHealthArticle({keyword:healthType}).then(function(res){
        if(res.status == 200 ){
            article_vm.articles = res.data
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
        }, 200)  

    },function err(){}).catch(function(){})
        
 })