/*!
 * jQuery Dialog v1.1
 * http://www.chinaluxus.com/
 *
 * Copyright (c) 2012 chinaluxus.com
 * http://www.chinaluxus.com/About/aboutus.html
 *
 * Date: 2012-09-27 (Wed, 27 Sep 2012)
 
 调用方法:
 
 1、默认的:
 new Dialog('这是一个默认对话框').show();
 2、无遮罩对话框:
 new Dialog('非模态对话框，可以打开多个！',{modal:false}).show();
 3、自动关闭:
 new Dialog('5秒后自动关闭',{time:5000}).show();
 4、非fixed模式:
 new Dialog('对话框不随滚动条移动',{fixed:false}).show();
 5、显示指定ID的内容
 new Dialog({type:'id',value:'content-type-id'}).show();
 6、加载一张图片
 new Dialog({type:'img',value:'http://img.chinaluxus.com/pic/view/2012/10/12/20121012154456935.jpg'}).show();
 7、加载一URL地址
 new Dialog({type:'url',value:'http://news.chinaluxus.com/Bsn/20121013/232394.html'}).show();
 8、
 new Dialog({type:'iframe',value:'http://www.chinaluxus.com'}).show();
 
 9、传入函数
 new Dialog(tipTxt,{time:1000},function(r){alert('confirmed:'+r);}).show();
 
 v1.1主要修改Dialog的返回值不止传入函数内有，也可通过options的isReturn来设置
 */


function Dialog(content, options, fn) {
    var defaults = { 			// 默认值。 
        title: '标题',       	// 标题文本，若不想显示title请通过CSS设置其display为none 
        showTitle: true,		// 是否显示标题栏
        closeText: '关闭',		// 关闭按钮文字
		closeBtn: true,			// 是否显示关闭按钮
        draggable: true,		// 是否移动 
        modal: true,			// 是否是模态对话框 
        center: true,			// 是否居中
		width: false,			// 设定内容宽度,默认是min-width;
		height: false,			// 设定内容高度,自动高
        fixed: true,			// 是否跟随页面滚动
        time: 0,				// 自动关闭时间，为0表示不会自动关闭
        id: false				// 对话框的id，若为false，则由系统自动产生一个唯一id

    };
    var options = $.extend(defaults, options);
    options.id = options.id ? options.id : 'dialog-' + Dialog.__count; // 唯一ID
    var overlayId = options.id + '-overlay'; // 遮罩层ID
    var timeId = null;  // 自动关闭计时器 
    var isShow = false;
    var isIe = $.browser.msie;
    var isIe6 = $.browser.msie && ('6.0' == $.browser.version);
	var _this = this;

    /* 对话框的布局及标题内容。*/
	var barBtn = !options.closeBtn ? '' : '<a class="close" title="' + options.closeText + '">' + options.closeText + '</a>';
    var barHtml = !options.showTitle ? '' :
        '<div class="bar"><span class="title">' + options.title + '</span>' + barBtn + '</div>';
    var $bd = $(document.getElementsByTagName("body")[0]);
    var dialog = $(document.createElement("div"));
    dialog.attr("class", "dialog");
    dialog.attr("id", options.id);
    dialog.hide();
    dialog.html('<div class="bg">' + barHtml + '<div class="content"></div></div>');
    $bd.append(dialog);

    /**
     * 设置函数
     *
     * 如果点击确定则返回true，反之亦然
     *
     */
    if (typeof (fn) != "undefined") {
        var tb = $(document.createElement("div"));
        tb.attr("class", "dialog-btn");
        tb.html('<div class="dialog-button"><a href="javascript:void(0)" style="margin-left: 10px;" class="l-btn"><span class="l-btn-left"><span class="l-btn-text">确定</span></span></a><a href="javascript:void(0)" style="margin-left: 10px;" class="l-btn"><span class="l-btn-left"><span class="l-btn-text">取消</span></span></a></div>');

        dialog.find(".bg").append(tb);
        tb.find(".l-btn").each(function (i) {
            var $this = $(this);
            $(this).bind("click", function () {
                if ($this.find(".l-btn-text").text() == "取消") {
                    dialog.fadeOut(200, function () {
                        $(this).remove();
                        fn(false);
                        return false;
                    });
                    if (options.modal)
                    { $('#' + overlayId).fadeOut(200, function () { $(this).remove(); }); }
                } else {
                    dialog.fadeOut(200, function () {
                        $(this).remove();
                        fn(true);
                        return false;
                    });
                    if (options.modal)
                    { $('#' + overlayId).fadeOut(200, function () { $(this).remove(); }); }
                }

            });
        });
    }


    /**
     * 重置对话框的位置。
     *
     * 主要是在需要居中的时候，每次加载完内容，都要重新定位
     *
     * @return void
     */
    var resetPos = function () {
        /* 是否需要居中定位，必需在已经知道了dialog元素大小的情况下，才能正确居中，也就是要先设置dialog的内容。 */
        if (options.center) {
            var left = ($(window).width() - dialog.width()) / 2;
            var top = ($(window).height() - dialog.height()) / 2;
            if (!isIe6 && options.fixed)
            { dialog.css({ top: top, left: left }); }
            else
            { dialog.css({ top: top + $(document).scrollTop(), left: left + $(document).scrollLeft() }); }
        }
    }

    /**
     * 初始化位置及一些事件函数。
     *
     * 其中的this表示Dialog对象而不是init函数。
     */
    var init = function () {
        /* 是否需要初始化背景遮罩层 */
        if (options.modal) {
            $('body').append('<div id="' + overlayId + '" class="dialog-overlay"></div>');
            $('#' + overlayId).css({
                'left': 0, 'top': 0,
                /*'width':$(document).width(),*/
                'width': $(window).width(),
                /*'height':'100%',*/
                'height': $(document).height(),
                'z-index': ++Dialog.__zindex,
                'position': 'absolute'
            }).hide();
        }
		if(!options.draggable){
			dialog.find('.bar').css("cursor","default");
		}

        dialog.css({ 'z-index': ++Dialog.__zindex, 'position': options.fixed ? 'fixed' : 'absolute' });

        /*  IE6 兼容fixed代码 */
        if (isIe6 && options.fixed) {
            dialog.css('position', 'absolute');
            resetPos();
            var top = parseInt(dialog.css('top')) - $(document).scrollTop();
            var left = parseInt(dialog.css('left')) - $(document).scrollLeft();
            $(window).scroll(function () {
                dialog.css({ 'top': $(document).scrollTop() + top, 'left': $(document).scrollLeft() + left });
            });
        }

        /* 以下代码处理框体是否可以移动 */
        var mouse = { x: 0, y: 0 };
        function moveDialog(event) {
            var e = window.event || event;
            var top = parseInt(dialog.css('top')) + (e.clientY - mouse.y);
            var left = parseInt(dialog.css('left')) + (e.clientX - mouse.x);
            dialog.css({ top: top, left: left });
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        dialog.find('.bar').mousedown(function (event) {
            if (!options.draggable) { return; }
            var e = window.event || event;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            $(document).bind({
				'mousemove': moveDialog,
				'mouseup':function (event) {
					$(document).unbind({'mousemove': moveDialog,'mouseup': null});
				}
			});
			return false;
        });

        /* 绑定一些相关事件。 */
        dialog.find('.close').bind('click', this.close);
        dialog.bind('mousedown', function () { dialog.css('z-index', ++Dialog.__zindex); });

        // 自动关闭 
        if (0 != options.time) { timeId = setTimeout(this.close, options.time); }
		/*
		$(document).keydown(function(ev){
			var $ev = ev || window.event;
			var onKey = $ev.charCode || $ev.keyCode;
			if (onKey === 27) {
				_this.close();
				$(document).unbind('keydown');
			}
		});
		*/
    }
	
	/**
     * 检查是否设置了宽高，是像素还是百分比，返回对应的像素;
     *
     * @param options.width height;
     * @return px
     */
	/*
	this.isPercent = function(str){
		
		var isPercent = /\%$/.test(str);
		if(isPercent){
			return '200px';
		}else{
			return str;
		}
	}
	*/

    /**
     * 设置对话框的内容。 
     *
     * @param string c 可以是HTML文本。
     * @return void
     */
    this.setContent = function (c) {
        var div = dialog.find('.content');
		//var _width = this.isPercent(options.width);
		//var _height = this.isPercent(options.height);
		
		div.css({
			'width':options.width ? options.width:'',
			'height':options.height ? options.height:''
		});
        if ('object' == typeof (c)) {
            switch (c.type.toLowerCase()) {
                case 'id': // 将ID的内容复制过来，原来的还在。
                    div.html($('#' + c.value).html());
                    break;
                case 'img':
                    div.html('加载中...');
                    $('<img alt="" />').load(function () { div.empty().append($(this)); resetPos(); })
                        .attr('src', c.value);
                    break;
                case 'url':
                    div.html('加载中...');
                    $.ajax({
                        url: c.value,
                        success: function (html) { div.html(html); resetPos(); },
                        error: function (xml, textStatus, error) { div.html('请求出错，请联系中奢网客服') }
                    });
                    break;
                case 'iframe':
					var ifrID = 'dialog_ifr' + Dialog.__count;
					if(!options.width || !options.height){
						div.css({'width':'650px','height':'210px'});
					}
                    div.html('<iframe id="'+ ifrID +'" scrolling="no" frameborder="0" src="'+ c.value +'"></iframe>');
					//解决IE6显示空白BUG
					if(isIe6){
						setTimeout('window.parent("'+ ifrID +'").location.reload();',0);
					}
                    break;
                case 'text':
                default:
                    div.html(c.value);
                    break;
            }
        }
        else { div.html(c); }
		resetPos();
    }

    /**
     * 显示对话框
     */
    this.show = function () {
        if (undefined != options.beforeShow && !options.beforeShow())
        { return; }

        /**
         * 获得某一元素的透明度。IE从滤境中获得。
         *
         * @return float
         */
        var getOpacity = function (id) {
            if (!isIe) {
                return $('#' + id).css('opacity');
            }else if(isIe6){
				return null;
			}
            var el = document.getElementById(id);
            return (undefined != el
                    && undefined != el.filters
                    && undefined != el.filters.alpha
                    && undefined != el.filters.alpha.opacity)
                ? el.filters.alpha.opacity / 100 : 1;
        }
        /* 是否显示背景遮罩层 */
        if (options.modal && !isIe6) {
            $('#' + overlayId).fadeTo(200, getOpacity(overlayId));
	    $(window).scroll(function(){
		$('#' + overlayId).css({
			/*'width':$(document).width(),*/
			'width': $(window).width(),
			/*'height':'100%',*/
			'height': $(document).height()
		});
	    });
        }
        dialog.fadeTo(200, getOpacity(options.id), function () {
            if (undefined != options.afterShow) {
                options.afterShow();
            }
            isShow = true;
        });
        // 自动关闭 
        if (0 != options.time) { timeId = setTimeout(this.close, options.time); }

        resetPos();
    }
    /**
     * 隐藏对话框。但并不取消窗口内容。
     */
    this.hide = function () {
        if (!isShow) { return; }

        if (undefined != options.beforeHide && !options.beforeHide())
        { return; }

        dialog.fadeOut('slow', function () {
            if (undefined != options.afterHide) { options.afterHide(); }
        });
        if (options.modal)
        { $('#' + overlayId).fadeOut('slow'); }

        isShow = false;
    }

    /**
     * 关闭对话框 
     *
     * @return void
     */
    this.close = function (time) {
        if (undefined != options.beforeClose && !options.beforeClose())
        { return; }
        if (typeof (time) != undefined && time > 0) {
            timeId = setTimeout(this.close, time);
            return false;
        }
        dialog.fadeOut(200, function () {
            $(this).remove();
            isShow = false;
            if (undefined != options.afterClose) { options.afterClose(); }
        });
        if (options.modal)
        { $('#' + overlayId).fadeOut(200, function () { $(this).remove(); }); }
        clearTimeout(timeId);
    }



    init.call(this);
    this.setContent(content);

    Dialog.__count++;
    Dialog.__zindex++;
}
Dialog.__zindex = 9000;
Dialog.__count = 1;

function dialog(content, options) {
    var dlg = new Dialog(content, options);
    dlg.show();
    return dlg;
}

