# jquery.Dialog
这是一个弹出框插件
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
