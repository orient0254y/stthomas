$(function () {
   //左边导航js部分
   // $(".nav-left").find('li').each(function (i) {
   //     $(this).on('click',function () {
   //         $(".nav-left").find('li').removeClass('active');
   //         // 点击时控制背景色
   //         // $(".nav-right").show(300);
   //         $(".nav-right").css('display','block');
   //         $("#page-wrapper").css('margin-left','220px')
   //         $(".nav-control").removeClass('open');
   //         $(this).siblings().removeAttr('id');
   //         $(this).attr('id','active');
   //         // 控制对应的右侧导航对应显示隐藏
   //         var className = $(this).attr('class');
   //         $(".nav-right").find('ul').hide(300);
   //         $(".nav-right").find('ul').each(function () {
   //             var classNameR = $(this).attr('class');
   //             if(className.indexOf(classNameR) != -1){
   //                 $(this).show(300);
   //             }
   //         });
   //     });
   // });
    // 关闭右侧导航
    $(".nav-control").on('click',function () {
        if($(this).hasClass('open')){
            // $(".nav-right").show('normal');
            $("#page-wrapper").css('margin-left','220px')
            $(".nav-right").css('display','block');

            // $(".nav-left").find('li').each(function(){
            //     if($(this).hasClass('active')){
            //        $(this).attr('id','active');
            //        $(this).removeClass('active');
            //     }
            // });
            $(".nav-control").removeClass('open');
            $(this).find("i").css("background-position","-2px -209px");
        }else{
            $("#page-wrapper").css('margin-left','60px');
            // $(".nav-left").find('li').each(function(){
            //     if($(this).attr('id')){
            //         $(this).addClass($(this).attr('id'));
            //     }
            // });
            // $(".nav-left").find('li').attr('id','');
            // $(".nav-right").hide(300);
            $(".nav-right").css('display','none');
            $(".nav-control").addClass('open');
            $(this).find("i").css("background-position","-32px -209px");
        }
    });
    // 鼠标进入用户名显示离开时隐藏
    $(".userName").on('mouseenter',function () {
        $(".userMsg").show();
    });
    $(".userName").on('mouseleave',function () {
            $(".userMsg").hide();
    });
    $(".userMsg").on('mouseenter',function () {
        $(".userMsg").show();
    });
    $(".userMsg").on('mouseleave',function () {
        $(".userMsg").hide();
    });
});

//新建提示
function createTips(text,fn){
    // console.log(1111)
    var tips = $("<div></div>");
    var box = $("<div></div>");
    var winHeight = window.innerHeight;
    var height = winHeight / 2 - 22;
    box.css({"position": "absolute","top": height,"left":"50%","text-align": "center","background": "rgba(0,0,0,0.8)","border-radius": "8px","padding":"12px 20px"});
    var p = $("<p></p>");
    p.html(text);
    p.css({"height": "24px","line-height": "24px","font-size": "14px","color":"#fff","white-space" : "nowrap"});
    box.append(p);
    tips.append(box);
    tips.css({"position":"fixed","width": "100%","height": "100%","top": "0","left": "0","background-color": "rgba(0,0,0,0.0)","z-index":"9999999"});
    $(document.body).append(tips);
    var boxWidth = box.outerWidth();
    box.css("marginLeft" , - boxWidth / 2);
    tips.animate({opacity:1},500,"swing",function(){
        $(this).delay(500).fadeOut(500,function(){
            $(this).remove();
            fn && fn();
        });
    });
}

//新建弹出框2s后消失
function  popupTip(text,flag,fn) {
    var text = text || '成功';
    // var flag = flag || true;
    var html = '';
    html += '<div class="zheZhao" style="display: block;z-index: 99999;">'
    html += '<div class="tip" >'
    html += '<div class="tipName"  style="min-width: 200px;padding: 0px 10px;">提示</div>'
    html += '<div class="tipMsg"  style="min-width: 200px;padding: 0px 10px;">'
    if(flag){
        html += '<img class="tipImg" src="/static/admin/images/success.png" alt="">'
    }else{
        html += '<img class="tipImg" src="/static/admin/images/error.png" alt="">'
    }
    html += '<div class="tipTip">'+text+'</div>'
    html += '</div>'
    html += '</div>'
    html += '</div>'
    $('body').append(html);
    $('.zheZhao').animate({opacity:1},500,"swing",function(){
        $(this).delay(500).fadeOut(500,function(){
            $(this).remove();
            fn && fn();
        });
    });

}
//验证正整数
function zhengZhengShuIn (className){
    var rex = /^[1-9]{1}[0-9]*$/;//正整数
    $("."+className).keyup(function(event){
        var event = event || window.event;
        var value = $(this).val();
        if(value.length>1){
            var flagRex =/^0/;
            if(flagRex.test(value)){
                layer.msg('首个字符不能为0',{time:1500});
                $(this).val('');
            }
        }
    });
    $("."+className).keypress(function(event){
        var event = event || window.event;
        if (event.charCode == 46 && event.charCode !== 0 && event.charCode < 48 || event.charCode > 57) {
            return false;
        }
        if (/\./.test($(this).val()) && event.charCode === 46) {
            return false;
        }
        if ($(this).val() === "" && event.charCode === 46) {
            return false;
        }
        var tails = ($(this).val()).split(".")[1];
        if (tails && tails.length === 2 && event.charCode !== 0) {
            return false;
        }
    });

}
//    验证最多输入多少字符
var computeLength = function (eleInput, maxLength, nativeCharSize) {
    var nativeCharRegexp = /[\u4E00-\u9FFF]/;
    var string, char, length = 0;
    var ele = (typeof eleInput == 'string') ? document.getElementById(eleInput) : eleInput;
    if(maxLength == undefined) {
        maxLength = ele.maxLength || 100;
    }

    if(nativeCharSize == undefined) {
        nativeCharSize = 2;
    }

    string = (ele.value || '').split('');

    for(var i = 0, count = string.length; i < count; i ++) {
        char = string[i];
        if(nativeCharRegexp.test(char)) {
            length += nativeCharSize;
        } else {
            length ++;
        }
    }

    return length;
};
var checkLength = function (target,id,maxLength,zhiJie) {
    var maxLength = maxLength || 120; // 这是允许输入的最大数
    var zhiJie = zhiJie || 1; //这是区分字节的 例如汉字是2字节
    var targetLength = computeLength(target, maxLength, zhiJie); // 这个是已输入的字符
    var leftLength =maxLength - targetLength;
    if(leftLength<=0){
        var val = $(target).val().slice(0,maxLength);
        $(target).val(val);
        document.getElementById(id).innerHTML = 0;
        // $(target).keypress(function(event){
        //     var event = event || window.event;
            // return false;
        // });
    }else{
        document.getElementById(id).innerHTML = leftLength; // 这里的size就是需要变换数字地方的Id
    }
}