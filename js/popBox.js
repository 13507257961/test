
(function($){

   $.extend($.fn, {  //为扩展类本身.为类添加新的方法。
         dialog_1: function(options) {  
            return this.each(function() {   //遍历匹配的元素.
            var dialog_1 = $.data(this, "dialog"); //var变量声明 //向元素附加数据，然后取回该数据：
             if (!dialog_1) { 
                    dialog_1 = new $.dialog_1(options, this); //变量声明
                    $.data(this, "dialog", dialog_1); //向元素附加数据，"dialog" 然后取回该数据：
                }
            });
        }
    });
   $.dialog_1 = function(options, el){   //dialog_1 方法
     if (arguments.length) {            //返回调用程序传递给函数的实际参数数目。
          this._init(options, el);
     }
   }
   $.dialog_1.prototype ={  //向对象添加属性和方法。
          options: {
            title:"title",
            showHeader:true,
            dragable:false,
            cache:true,
            html:'',
            width:'auto',
            height:'auto',
            cannelBtn:true,
            confirmBtn:true,
            cannelText:"Cannel",
            confirmText:"Confirm",
            showFooter:true,
            onClose:false,
            onOpen:false,
            onConfirm:false,
            onCannel:false,
            getContent:false
          },
     
        _init: function(options, el) { // init
            this.options = $.extend(true, {}, this.options, options)
            this.element = $(el);
            this._build(this.options.html);
            this._bindEvents();
        },

      

        _bindEvents: function() { // bind events
            var self = this;
            this.element.delegate('.close','click',function(){
                self.close(self.options.onClose);
            });
            this.element.delegate('.cannel','click',function(){
                self._cannel(self.options.onCannel);
            });
   
            this.element.delegate('.confirm','click',function(){
                self._confirm(self.options.onConfirm);
            });

            $(window).bind("resize", function() {
                self._center();
                self._setLayerWidthHeight();
            });

            if (self.options.dragable) {
                self._dragable();
            }
        },

        _build: function(html) { // build the template for dialog
            var html;
            var footer = '';
            var header = '';
            var cfBtn ='';
            var clBtn ='';
            var bodyContent = '<div class="body-content"></div>';
            if (html) {
                html = html;
            } else {

                if(this.options.confirmBtn){
                    cfBtn = '<button class="confirm">' + this.options.confirmText + '</button>';
                }

                if(this.options.cannelBtn){
                    clBtn = '<button class="cannel">' + this.options.cannelText + '</button>';
                }

                if (this.options.showFooter) {
                    footer = '<div class="footer">\
                                            <div class="buttons">\
                                                '+ cfBtn +'\
                                                '+ clBtn +'\
                                            </div>\
                                        </div>';

                }

                if(this.options.showHeader){
                  header = '<div class="header">\
                                            <h2 style="width:' + this.options.width + 'px;">' + this.options.title + '</h2>\
                                            <s class="close">X</s>\
                                        </div>';
                }

                if(this.options.showFooter){
                    var h = this.options.height - 80;
                    bodyContent = '<div class="body-content" style="height:'+ h +'px;"></div>';
                }else{
                    bodyContent = '<div class="body-content" style="height:'+this.options.height +'px;"></div>';
                }

                html = '<div class="dialog">\
                '+ header +'\
                                <div class="body" style="width:' + this.options.width + 'px;height:' + this.options.height + 'px;">\
                                    '+ bodyContent +'\
                                </div>' + footer + '<iframe frameborder="0" border="0" class="lay"></div>';
            }

            this.element.html(html);
            $("body").append("<div class='layer-box' style='display:none;'><div class='back'></div><iframe frameborder='0' border='0' class='lay'></div>");

            if (this.options.getContent) {
                this._setContent(this.options.getContent);
            }
            this._center();
            this._setLayerWidthHeight();
        },

        _dragable: function() { // dragable
            var h = this.element.find('.header').find('h2'),
                c = this.element.find('.dialog'),
                d,
                dragging = false,
                startObjectX,
                startObjectY,
                ondragstart = function(e) {
                    dragging = true;
                    var pos = c.offset();
                    startObjectX = pos.left;
                    startObjectY = pos.top;
                    d = {
                        maxX: $(document).width() - c.width(),
                        maxY: $(document).height() - c.height(),
                        posX: e.clientX - startObjectX,
                        posY: e.clientY - startObjectY
                    };
                },
                ondragging = function(e) {
                    if (dragging) {
                        c.css({
                            left: Math.max(0, Math.min(e.clientX - d.posX, d.maxX)) + "px",
                            top: Math.max(0, Math.min(e.clientY - d.posY, d.maxY)) + "px"
                        });
                    }
                },
                ondragstop = function() {
                    dragging = false;
                };

            h.mousedown(ondragstart);

            $(document).mousemove(ondragging).mouseup(ondragstop);

            h.undraggable = function() {
                h.unbind('mousedown', ondragstart);
                $(document).unbind('mousemove', ondragging).unbind('mouseup', ondragstop);
                delete h.undraggable;
                ondragstart = ondragstop = ondragging = null;
                return this;
            };
        },

        _center: function() { // Center dialog in window
            var d = this.element.find('.dialog');
            d.css({
                left: ($(document).width() - d.width()) / 2,
                top: (document.documentElement.clientHeight - d.height()) / 2 + $(document).scrollTop()
            });
        },

        _setLayerWidthHeight: function() {
            var height = this._getDocHeight();
            var width = this._getDocWidth();
            $(".layer-box, .layer-box .back,.layer-box .lay").css({
                width: this._getDocWidth(),
                height: this._getDocHeight()
            })
        },

        _getDocHeight: function() { // get document height
            var d = document;
            return Math.max(d.body.scrollHeight, d.documentElement.scrollHeight, d.body.offsetHeight, d.documentElement.offsetHeight, d.body.clientHeight, d.documentElement.clientHeight);
        },

        _getDocWidth: function() { // get docuement width
            var d = document;
            return Math.max(Math.max(d.body.scrollWidth, d.documentElement.scrollWidth), Math.max(d.body.offsetWidth, d.documentElement.offsetWidth), Math.max(d.body.clientWidth, d.documentElement.clientWidth));
        },


        _confirm: function(cb) { // confirm
            this._callback(cb);
            this._hide();
            this.clearCache();
        },

        _cannel: function(cb) { // cannel
            this._callback(cb);
            this._hide();
            this.clearCache();
        },

        close: function(cb) { // close
            this._callback(cb);
            this._hide();
            this.clearCache();
        },

        open: function(cb) { // open
            this._callback(cb);
            this.element.show();
            $('.layer-box').show();
            this._center();
            this._setLayerWidthHeight();
            this.clearCache();
        },
        clearCache: function() { // clear Cache
            if (!this.options.cache) {
                this.element.data('dialog', '');
            }
        },
        _hide: function() { // hidden
            this.element.hide();
            $('.layer-box').hide();
        },

        _callback: function(cb) { // callback
            if (cb && (typeof(cb) === 'function')) {
                cb.call(this);
            }
        },

        _setContent: function(cb) { // set dialog content
            if (cb && (typeof(cb) === 'function')) {
                cb();
            }
        }
    }

    $.extend($.fn, {
        open: function(cb) {
            $(this).data("dialog") && $(this).data("dialog").open(cb)
        },
        close: function(cb) {
            $(this).data("dialog") && $(this).data("dialog").close(cb)
        }
    });

 })(jQuery);
   
