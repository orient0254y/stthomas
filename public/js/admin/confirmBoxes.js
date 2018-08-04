/**
 * Created by BlueSummer on 2018/3/26.
        CB.tips({
            "title" : "信息提示",
            "text" : "结算成功",
            "btn": true //带确定按钮,默认false
        },function(){
            location.reload();
        });
        CB.confirm({
            "title" : "信息提示",
            "text" : "结算成功",
            "btn": true //带确定按钮,默认false
        },function(){
            
        });
 */
(function(window, document) {
    function ConfirmBoxes() {
        this.time = (new Date()).getTime();
    };
    ConfirmBoxes.prototype = {
        "init": function() {
            return this;
        },
        "confirm": function(params, fn) {
            this.params = params;
            var html = this.getHtml();
            var body = window.parent.document.body ? window.parent.document.body : document.body;
            body.append($(html).get(0));
            var scope = this;
            ($(html)).fadeIn(300, "swing", function() {
                scope.close();
                scope.end(fn);
            });
            return this;
        },
        "tips": function(params, fn) {
            this.params = params;
            if (params.btn) {
                var html = this.getHtml(true, true);
            } else {
                var html = this.getHtml(true);
            }
            var body = window.parent.document.body ? window.parent.document.body : document.body;
            body.append($(html).get(0));
            var scope = this;
            if (params.btn) {
                ($(html)).fadeIn(300, "swing", function() {
                    scope.close();
                    scope.end(fn);
                });
            } else {
                ($(html)).fadeIn(300, "swing").delay(1400).fadeOut(300, "swing", function() {
                    scope.fadeOut();
                    fn && fn();
                });
            }
            return this;
        },
        "getCss": function() {
            var style = $('<style></style>');
            var css = '';
            css += '.wrapper_' + this.time + '{position: fixed;width: 100%;height: 100%;background: rgba(0,0,0,0.5);top: 0;left: 0;font-family:"Microsoft Yahei";z-index:999999999999999;}';
            css += '.box_' + this.time + '{position: absolute;width: 260px;left: 50%;top: 50%;margin-top: -92px;margin-left: -170px;background-color: #fff;border-radius: 5px;overflow:hidden;}';
            css += '.head_' + this.time + '{height: 38px;line-height: 38px;font-size: 14px;color: #666;padding: 0 12px;background-color: #ECF8FF;border-top-right-radius: 5px;border-top-left-radius: 5px;position: relative;}';
            css += '.body_' + this.time + '{color: #666;padding: 20px 12px 6px;min-height:82px;}';
            css += '.closeBtn_' + this.time + '{position: absolute;width: 38px;height: 38px;right: 0;top:0;cursor: pointer;}';
            css += '.closeBtn_' + this.time + ' s,.closeBtn_' + this.time + ' b' + '{display: block;position: absolute;width: 16px;height: 2px;background-color: #666;top: 50%;left: 50%;margin-top: -1px;margin-left: -8px;}';
            css += '.closeBtn_' + this.time + ' s' + '{transform: rotate(45deg);-webkit-transform: rotate(45deg);}';
            css += '.closeBtn_' + this.time + ' b' + '{transform: rotate(135deg);-webkit-transform: rotate(135deg);}';
            css += '.line_' + this.time + '{padding: 6px 0;margin-bottom:30px;}';
            css += '.left_' + this.time + '{float: left;height: 24px;line-height: 24px;font-size:14px;}';
            css += '.left_' + this.time + ' s{display: inline-block;margin: 0 7px 0 5px;text-decoration:none;}';
            css += '.left_' + this.time + ' i{display: inline-block; width: 24px;}';
            css += '.right_' + this.time + '{float: left;line-height: 24px;}';
            css += '.right_' + this.time + ' label{float: left;margin-right: 10px;font-weight:normal;}';
            css += '.right_' + this.time + ' label input{vertical-align: top;margin-top: 5px;margin-right: 3px;outline:none;}';
            css += '.right_' + this.time + ' label span{display: inline-block;}';
            css += '.right_' + this.time + ' textarea{resize: none;border:1px solid #dbdbdb;width: 242px;min-height: 67px;padding: 5px 6px;outline:none;box-shadow: none;}';
            css += '.btnBox_' + this.time + '{position: relative;height: 28px;margin-bottom: 10px;margin-top:10px;}';
            css += '.ensureBtn_' + this.time + ',.cancelBtn_' + this.time + '{float:right;width: 60px;height: 26px;line-height: 26px;text-align: center;font-size: 14px;border-radius: 3px;cursor: pointer;}';
            css += '.ensureBtn_' + this.time + '{color: #fff;background-color: #1989FA;border:1px solid #1989FA;}';
            css += '.cancelBtn_' + this.time + '{color: #FF2833;border:1px solid #FF2833;background-color: #fff;margin-left: 5px;}';
            style.html(css);
            this.style = style;
            return style;
        },
        "getHtml": function(flag, flag2) {
            flag = flag || false;
            this.wrapperBox = $('<div></div>');
            var wrapper = $('<div></div>');
            wrapper.attr("class", "wrapper_" + this.time);
            var box = $('<div></div>');
            box.attr("class", "box_" + this.time);
            var head = $('<div><span></span></div>');
            head.attr("class", "head_" + this.time).html(this.params.title);;
            var closeBtn = $('<div><s></s><b></b></div></div>');
            closeBtn.attr("class", "closeBtn_" + this.time);
            this.closeBtn = closeBtn;
            head.append(closeBtn);
            var body = $('<div></div>');
            body.attr("class", "body_" + this.time);
            box.append(head);
            box.append(body);
            wrapper.append(box);
            //line1
            var line1 = $('<div></div>');
            line1.attr("class", "line_" + this.time + " clearfix");
            var left1 = $('<span></span>');
            left1.attr("class", "left_" + this.time);
            left1.html(this.params.text);
            line1.append(left1);
            body.append(line1);
            if (!flag) {
                closeBtn.css({ "display": "block" });
                //btnBox
                var btnBox = $('<div></div>');
                btnBox.attr("class", "btnBox_" + this.time + " clearfix");

                this.cancelBtn = $('<div>取消</div>');
                this.cancelBtn.attr('class', "cancelBtn_" + this.time);
                btnBox.append(this.cancelBtn);

                this.ensureBtn = $('<div>确定</div>');
                this.ensureBtn.attr("class", "ensureBtn_" + this.time);
                btnBox.append(this.ensureBtn);

                body.append(btnBox);
            } else {
                if (!flag2) {
                    closeBtn.css({ "display": "none" });
                    left1.css({
                        "width": "100%",
                        "text-align": "center"
                    });
                } else {
                    closeBtn.css({ "display": "block" });
                    //btnBox
                    var btnBox = $('<div></div>');
                    btnBox.attr("class", "btnBox_" + this.time + " clearfix");

                    this.ensureBtn = $('<div>确定</div>');
                    this.ensureBtn.attr("class", "ensureBtn_" + this.time);
                    btnBox.append(this.ensureBtn);
                    body.append(btnBox);
                }
            }
            var css = this.getCss();
            this.wrapperBox.append(css);
            this.wrapperBox.append(wrapper);
            return this.wrapperBox;
        },
        "close": function() {
            var scope = this;
            this.closeBtn.click(function() {
                scope.fadeOut();
            });
            this.cancelBtn.click(function() {
                scope.fadeOut();
            });
        },
        "end": function(fn) {
            var scope = this;
            this.ensureBtn.on("click", function(e) {
                e.stopPropagation();
                scope.fadeOut();
                fn && fn();
            });
        },
        "fadeOut": function() {
            var scope = this;
            this.wrapperBox.fadeOut(300, "swing", function() {}).remove();
        }
    };
    window.CB = new ConfirmBoxes().init();
})(window, document);