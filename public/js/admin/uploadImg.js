// 初始化Web Uploader

uploader = WebUploader.create({

    // 选完文件后，是否自动上传。
    auto: false,

    // swf文件路径
    swf: '/static/admin/js/plugins/webuploader/Uploader.swf',

    // 文件接收服务端。
    // server: '/static/admin/js/plugins/webuploader/uploader.php',
    server: uploadServer,

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: {
        id: '#picker',
        multiple: false
    },

    fileSizeLimit: maxSize * 1024 * 1024,

    // fileSingleSizeLimit: maxSize * 1024 * 1024,

    // 只允许选择图片文件。
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,png',
        mimeTypes: 'image/gif,image/jpg,image/jpeg,image/png'
    },
    thumb: {
        // 图片质量，只有type为`image/jpeg`的时候才有效。
        quality: 70,

        // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
        allowMagnify: true,

        // 是否允许裁剪。
        crop: true,

        // 为空的话则保留原有图片格式。
        // 否则强制转换成指定的类型。
        // type: 'image/jpeg'
    },

    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
    resize: false
});

// 当有文件添加进来的时候
uploader.on('fileQueued', function(file) {
    var $img = $('<img>');
    // 清空添加省略图
    $("#imgContainer").html("").append($img);
    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    setTimeout(function() {
        uploader.makeThumb(file, function(error, src) {
            if (error) {
                return;
            }
            if (widthSize && heightSize) {
                if (imgWidth !== widthSize || imgHeight !== heightSize) {
                    // $img.replaceWith('<span>不能预览</span>');
                }else{
                    $img.attr({ 'data-src': src, 'src': '/static/admin/images/u645.png', 'class': "st_img_hover" });
                }
            }else{
                $img.attr({ 'data-src': src, 'src': '/static/admin/images/u645.png', 'class': "st_img_hover" });
            }
            // $("#imgTips").val(file.name);
        }, imgWidth, imgHeight);
    }, 200);
});
uploader.on('beforeFileQueued', function(file) {
    hasUploadImg = true;
    // 大小验证
    if (file.size > maxSize * 1024 * 1024) {
        CB.tips({
            "title": "提示",
            'text': "所选附件总大小不可超过" + maxSize + "M"
        }, function() {
            $("#imgTipsTip").attr("class", "onError").find("div").attr("class", "onError").html("所选附件总大小不可超过" + maxSize + "M");
            $("#imgTips").val("");
        });
        return false;
    }
    uploader.makeThumb(file, function(error, src) {
        imgWidth = file._info.width;
        imgHeight = file._info.height;
        if (widthSize && heightSize) {
            if (imgWidth != widthSize || imgHeight != heightSize) {
                uploader.stop();
                // uploader.removeFile(file, true);
                for (var i = 0; i < uploader.getFiles().length; i++) {
                    uploader.removeFile(uploader.getFiles()[i], true);
                    uploader.cancelFile(uploader.getFiles()[i]);
                    delete uploader.getFiles()[i];
                }
                CB.tips({
                    "title": "提示",
                    "text": "尺寸为 （" + widthSize + "*" + heightSize + "）"
                }, function() {
                    $("#imgTipsTip").attr("class", "onError").find("div").attr("class", "onError").html("尺寸为 （" + widthSize + "*" + heightSize + "）");
                    $("#imgTips").val("");
                });
                var name = file.name;
                //删除图片
                // $.post(delImg,{name: name},function(){});
                return false;
            } else {
                $("#imgTipsTip").attr("class", "onCorrect").find("div").attr("class", "onCorrect").html("格式正确");
                $("#imgTips").val(file.name);
            }
        } else {
            $("#imgTipsTip").attr("class", "onCorrect").find("div").attr("class", "onCorrect").html("格式正确");
            $("#imgTips").val(file.name);
        }
    }, 1, 1);
});

uploader.on("error", function(type) {
    if (type == "Q_TYPE_DENIED") {
        CB.tips({
            "title": "提示",
            'text': "上传图片格式必须是gif,jpg,jpeg,png"
        }, function() {
            $("#imgTipsTip").attr("class", "onError").find("div").attr("class", "onError").html("上传图片格式必须是gif,jpg,jpeg,png");
        });
    }
});
// 文件上传过程中创建进度条实时显示。
uploader.on('uploadProgress', function(file, percentage) {

});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader.on('uploadSuccess', function(file, response) {
    /*CB.tips({
        'title': '提示',
        'text': '上传成功'
    });*/
    if (response.msg) {
        $("#imgTips").val(response.msg);
    }
    if (response.status == 1) {
        stSubmit(response);
    }else{
        CB.tips({
            'title': '提示',
            'text': response.msg
        });
    }
});

// 文件上传失败，显示上传出错。
uploader.on('uploadError', function(file,aaa) {
    CB.tips({
        'title': '提示',
        'text': '上传失败'
    });
});
uploader.on('all', function(type) {
    if (type === 'startUpload') {
        state = 'uploading';
    } else if (type === 'stopUpload') {
        state = 'paused';
    } else if (type === 'uploadFinished') {
        state = 'done';
    }

});
// 完成上传完了，成功或者失败，先删除进度条。
uploader.on('uploadComplete', function(file) {
    $("#imgTipsTip").attr("class", "onCorrect").find("div").attr("class", "onCorrect").html("上传成功");
    hasUploadImg = false;
});