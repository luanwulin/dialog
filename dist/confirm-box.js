define("#dialog/0.9.0/confirm-box",["./base-dialog","./anim-dialog","$","#overlay/0.9.8/overlay","#iframe-shim/0.9.3/iframe-shim","#position/0.9.2/position","#widget/0.9.16/widget","#base/0.9.16/base","#events/0.9.1/events","#class/0.9.2/class","#overlay/0.9.8/mask","#easing/0.9.3/easing"],function(e,t,n){var r=e("$"),i=e("./anim-dialog"),s=i.extend({template:'<div class="ui-confirmBox">                    <div class="ui-confirmBox-action">                        <a title="关闭" class="ui-confirmBox-close" href="javascript:;">×</a>                    </div>                    <div class="ui-confirmBox-box">                        <div class="ui-confirmBox-title sl-linear-light"><h2></h2></div>                        <div class="ui-confirmBox-container">                            <div class="ui-confirmBox-content"></div>                            <div class="ui-confirmBox-operation">                                <div class="ui-button ui-button-sorange ui-confirmBox-confirm">                                    <a href="javascript:;" class="ui-button-text">确定</a>                                </div>                                <div class="ui-button ui-button-swhite ui-confirmBox-cancel">                                    <a href="javascript:;" class="ui-button-text">取消</a>                                </div>                            </div>                        </div>                    </div>               </div>',attrs:{confirmElement:".ui-confirmBox-confirm",cancelElement:".ui-confirmBox-cancel",closeElement:".ui-confirmBox-close",titleElement:".ui-confirmBox-title h2",title:"默认标题",contentElement:".ui-confirmBox-content",content:"默认内容",width:500,hasMask:!0,effect:null,align:{selfXY:["50%","50%"],baseXY:["50%","38%"]},hasTitle:!0,hasOk:!0,hasCancel:!0,hasCloseX:!0},setup:function(){i.superclass.setup.call(this),this.get("hasTitle")||this.$(".ui-confirmBox-title").remove(),!this.get("hasOk")&&this.get("confirmElement")&&this.get("confirmElement").remove(),!this.get("hasCancel")&&this.get("cancelElement")&&this.get("cancelElement").remove(),!this.get("hasCloseX")&&this.get("closeElement")&&this.get("closeElement").remove(),!this.get("hasOk")&&!this.get("hasCancel")&&this.$(".ui-confirmBox-operation").remove()}});s.message=function(e,t){var n=(new s({content:e,className:"ui-confirmBox-message",hasTitle:!1,hasOk:!1,hasCancel:!1,hasCloseX:!1,hasMask:!1,effect:{type:"slide"},width:"auto",align:{selfXY:["50%","0%"],baseXY:["50%","0%"]}})).show();r(window).resize(function(){n.set("align",n.get("align"))}).scroll(function(){n.set("align",n.get("align"))}),setTimeout(function(){n.hide()},t||4e3)},s.alert=function(e,t){(new s({content:e,hasTitle:!1,hasCancel:!1,hasCloseX:!1,onConfirm:function(){t&&t(),this.hide()}})).show()},s.confirm=function(e,t,n,r){(new s({content:e,title:t||"确认框",hasCloseX:!1,onConfirm:function(){n&&n(),this.hide()},onClose:function(){r&&r()}})).show()},n.exports=s});