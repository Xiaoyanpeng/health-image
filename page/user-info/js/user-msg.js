$(function () {
    var $umPopBody = $('.um-pop-body'),
        $umC = $('.um-c'),
        $jUmW = $('.j-um-w'),
        $umPopConM = $('.um-pop-con-m'),
        umBsTmp = $('#umBsTmp').html(),
        umBpTmp = $('#umBpTmp').html(),
        dContent = '，建议立即进食补充糖分。必要时请咨询您的家庭医生，建议继续密切监测血糖。',
        heiContent = '，请注意饮食或按医生要求服药。必要时请咨询您的家庭医生，建议继续密切监测血糖。',
        norContent = '，请继续保持良好的饮食习惯，并按医生要求服药。';

    //文本替换
    function render (t, d) {
        return t.replace(/\{\{(\w+)\}\}/g, function(m, $1){
            return d[$1];
        });
    }

    function init () {
        $.ajax({
            url: 'um.json',
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                data.bs.bsnum = parseFloat(data.bs.bsnum);
                if (data.bs.bsnum > 0 && data.bs.bsnum < 3.9) {
                    data.bs.statecon = '血糖偏低';
                    data.bs.content = dContent;
                } else if (data.bs.bsnum >= 3.9 && data.bs.bsnum <= 6.1) {
                    data.bs.statecon = '血糖正常';
                    data.bs.content = norContent;
                    data.bs.staclass = 'norm';
                }else if (data.bs.bsnum > 6.1) {
                    data.bs.statecon = '血糖偏高';
                    data.bs.content = heiContent;
                    data.bs.staclass = 'hei';
                }
                $umPopConM.append(render(umBsTmp,data.bs));
            }
        });
        $umC.on('click' ,function () {
            $umPopBody.hide();
        });
    }



    init ();
});