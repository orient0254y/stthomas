(function() {
    if (document.getElementById("st_item_list")) {
        document.getElementById("st_item_list").addEventListener("click", function(e) {
            selectList(this, e);
        });
        document.getElementById("st_item_list").addEventListener("contextmenu", function(e) {
            selectList(this, e);
            return false;
        });
    }

    function selectList(scope, e) {
        var ul = null;
        for (var i = 0; i < scope.children.length; i++) {
            if (scope.children[i].tagName === "UL") {
                ul = scope.children[i];
                break;
            }
        }
        if (e.target.parentNode === ul) {
            var val = e.target.getAttribute("val");
            var text = e.target.innerHTML;
            var prev = ul.previousSibling;
            while (prev) {
                if (prev.nodeType === 1) {
                    if (prev.tagName === "P") {
                        break;
                    }
                } else {
                    prev = prev.previousSibling;
                }
            }
            if (prev) {
                prev.innerHTML = text;
                if (val) {
                    prev.setAttribute("val", val);
                }
            }
        }
        if (ul) {
            if (ul.style.display === "block") {
                ul.style.display = "none";
            } else {
                ul.style.display = "block";
            }
        }
    }
    window.addEventListener("click", function(e) {
        setItemListBlock(e);
    });
    window.addEventListener("contextmenu", function(e) {
        setItemListBlock(e);
    })

    function setItemListBlock(e) {
        var item = document.getElementById("st_item_list");
        if (!item) {
            return;
        }
        var ul = null;
        for (var i = 0; i < item.children.length; i++) {
            if (item.children[i].tagName === "UL") {
                ul = item.children[i];
                break;
            }
        }
        var target = e.target;
        while (target.parentNode) {
            if (target.parentNode === document) {
                if (ul) {
                    if (ul.style.display === "block") {
                        ul.style.display = "none";
                    }
                }
                break;
            }
            if (target.parentNode === item) {
                break;
            }
            target = target.parentNode;
        }
    }
    //开关切换
    $(".st_switch").each(function(){
        var span = $("<span></span>");
        $(this).html(span);
    });
    /*var switchFlag = false;
    $(document).on("click",".st_switch",function(){
    	var close = false;
    	if ($(this).hasClass("on")) {
    		close = true;
    	}
    	var scope = this;
    	$.ajax(0,{"close" : close},function(data){
    		if (data.status) {
    			if (close) {
    				//当前为开，点击关闭
    				$(scope).attr("class", "st_switch");
    			}else{
    				//当前关闭，点开打开
    				$(scope).attr("class", "st_switch on");
    			}
    			switchFlag = false;
    		}
    	});
    });*/
    var bigImg = document.createElement("div");
    var img0 = document.createElement("img");
    bigImg.appendChild(img0);
    $(bigImg).attr("class", "bigImg").hide();
    document.body.appendChild(bigImg);
    //图片hover放大显示
    $(document).on("mouseover", ".st_img_hover", function(event) {
        var event = event || window.event;
        var dX = parseFloat(event.clientX) + 10;
        var dY = parseFloat(event.clientY);
        var imgSrc = $(this).attr("data-src") || $(this).attr("src");
        $(".bigImg").show().css({
            "left": dX,
            "top": dY
        }).find("img").attr("src", imgSrc);
    });
    $(document).on("mousemove", ".st_img_hover", function(event) {
        var event = event || window.event;
        var dX = parseFloat(event.clientX) + 10;
        var dY = event.clientY;
        $(".bigImg").show().css({
            "left": dX,
            "top": dY
        });
    });
    $(document).on("mouseout", ".st_img_hover", function() {
        $(".bigImg").hide();
    });
    // 全选
    $('#inputCheckAll').click(function() {
        if ($(this).prop('checked')) {
            $(this).closest("thead").siblings("tbody").find("tr").each(function() {
                if ($(this).find("input[name='inputCheck']").length === 1) {
                    $(this).addClass("select");
                }
            });
            $("#pl_ensure").removeClass("disable").data("useful", true);
        } else {
            $(this).closest("thead").siblings("tbody").find("tr").removeClass("select");
            $("#pl_ensure").addClass("disable").data("useful", false);
        }
    });
    // 单选
    $("input[name='inputCheck']").click(function() {
        if ($(this).prop('checked')) {
            $(this).closest("tr").addClass("select");
            $("#pl_ensure").removeClass("disable").data("useful", true);
        } else {
            $(this).closest("tr").removeClass("select");
            var flag = false;
            $("input[name='inputCheck']").each(function() {
                if ($(this).prop("checked")) {
                    flag = true;
                }
            });
            if (flag) {
                $("#pl_ensure").removeClass("disable").data("useful", true);
            } else {
                $("#pl_ensure").addClass("disable").data("useful", false);
            }
        }
    });
    // 给所有拥有此class的标签定义不能被选属性
    $(".unselectable").attr({
        "onselectstart": "return false;",
        "unselectable": "on"
    });

    // 添加属性条目和减少属性条目操作 add_attr_box
    // 添加操作
    var f$;
    if ($ && $.formValidator) {
        f$ = $;
        f$.formValidator = $.formValidator;
    }
    $(document).on("click","#add_attr_box .add_btn",function(){
        var newLine = $('<div class="add_attr_line"><span class="add_btn unselectable" onselectstart="return false;" unselectable="on">[+]</span><!-- --><input type="text" name="attrVal" class="st_normal_input_add"></div>');
        $(this).addClass("sub_btn").removeClass("add_btn").html("[-]");
        $("#add_attr_box").prepend(newLine);
    });
    // 减少操作
    $(document).on("click","#add_attr_box .sub_btn",function(){
        var id = $(this).siblings("input[name='attrVal']").attr("id");
        f$ && f$.formValidator && f$("#" + id).unFormValidator(true);
        $(this).parent().remove();
    });
})();