(function ($) {

    var pluginName = 'tooltip';

    var GLOBAL_SETTINGS = $.extend({
        // how far arrow center is from edge
        arrowOffset: 55,
        // use arrows by css tricks or images
        useCssArrows: true,
        // when use popup with overlay instead of tooltip
        mobileTreshold: 560,
        // show only one tooltip (close others when showing new one)
        onlyOneVisible: true
    }, window.tooltipConfig || {});


    var defaults = {
        // content to insert to popup
        content: '',
        // selector of element to insert to popup
        contentSelector: null,
        // event to react on
        event: 'click',
        // arrow position
        direction: 't',
        // popup offset in x direction
        leftOffset: 0,
        // popup offset in y direction
        topOffset: 0,
        // show immadiatelly
        show: false
    };

    function Tooltip(element, config) {
        this.element = element instanceof $ ? element : $(element);
        this.config = $.extend({}, defaults, this.element.data(), config);

        this.isShown = false;
        this.popup = null;
        this.init();
    }

    var DefaultPrototype = {
        constructor: Tooltip,

        init: function () {
            this.connectEvents();

            if (this.config.show) {
                this.show();
            }
        },

        connectEvents: function () {
            var _this = this;
            var triggers = getTriggerEvents(this.config.event);

            if (triggers.on === triggers.off) {
                this.element.on(triggers.on, function () {
                   _this.toggle();
                    return triggers.on !== 'click';
                });
            } else {
                this.element.on(triggers.on, function () {
                    _this.show();
                    return triggers.on !== 'click';
                });
                this.element.on(triggers.off, function () {
                    _this.hide();
                    return triggers.off !== 'click';
                });
            }

            $(window).resize(this.adjustTooltipPosition.bind(this));

            if (!GLOBAL_SETTINGS.onlyOneVisible) {
                $('body').on('hide-tooltips', this.hide.bind(this));
            }
        },

        show: function () {
            if (!this.popup) {
                this.initTooltipElement();
            }
            this.adjustTooltipPosition();

            if (!this.isShown) {
                $('body').trigger('hide-tooltips');
                this.popup.show();
            }
            this.isShown = true;
        },

        initTooltipElement: function () {
            this.popup = createTooltipElement(this.config);
            this.adjustTooltipSize();
            this.popup.appendTo('body');
            this.adjustTooltipPosition();
            this.element.offsetParent().append(this.popup);
        },

        adjustTooltipSize: function () {
            if (!this.popup) {
                this.initTooltipElement();
            }
            var cssRules = {};
            this.config.width && (cssRules['width'] = this.config.width);
            this.config.height && (cssRules['height'] = this.config.height);
            this.config.minWidth && (cssRules['minWidth'] = this.config.minWidth);
            this.config.maxWidth && (cssRules['maxWidth'] = this.config.maxWidth);
            this.config.minHeight && (cssRules['minHeight'] = this.config.minHeight);
            this.config.maxHeight && (cssRules['maxHeight'] = this.config.maxHeight);

            this.popup.css(cssRules);
        },

        adjustTooltipPosition: function () {
            // case when there is no popup created yet
            if (!this.popup) {
                return;
            }

            var position = PositionHelper.getPositionFor(this.config.direction, this.element, {
                width: this.popup.outerWidth(),
                height: this.popup.outerHeight()
            });

            position.left += this.config.leftOffset;
            position.top += this.config.topOffset;

            this.popup.css(position);
        },

        hide: function () {
            this.isShown && this.popup.hide();
            this.isShown = false;
        },

        toggle: function () {
            this.isShown ? this.hide() : this.show();
        },

        option: function (name, value) {
            if (name === 'direction' && this.popup) {
                this.updateTooltipDirectionClass(value);
            } else {
                this.config[name] = value;
            }
        },

        updateTooltipDirectionClass: function (newDirection) {
            this.popup
                .removeClass(getDirectionClasses(this.config.direction))
                .addClass(getDirectionClasses(newDirection));

            this.config.direction = newDirection;
            this.adjustTooltipPosition();
        }
    };

    var MobilePrototype = {
        constructor: Tooltip,

        init: function () {
            this.connectEvents();
        },

        connectEvents: function () {
            this.element.on('click', this.show.bind(this));
            $('body').on('hide-tooltips', this.hide.bind(this));
        },

        show: function () {
            if (!this.popup) {
                this.initTooltipElement();
            }
            if (!this.isShown) {
                $('body').trigger('hide-tooltips');
                this.popup.show();
            }
            this.isShown = true;
            return false;
        },

        initTooltipElement: function () {
            this.popup = createMobilePopupElement(this.config);
            this.popup.appendTo('body');
            this.popup.find('.icon-close').click(this.hide.bind(this));
        },

        hide: function () {
            this.isShown && this.popup.hide();
            this.isShown = false;
            return false;
        },

        option: function (name, value) {
            this.config[name] = value;
        }
    };

    // use version according to screen size
    Tooltip.prototype = $('body').width() > GLOBAL_SETTINGS.mobileTreshold ? 
        DefaultPrototype : MobilePrototype;



    var PositionHelper = {

        getPositionFor: function (dir, element, popupSize) {
            var elPos = element.offset();
            var elSize = {
                width: element.outerWidth(),
                height: element.outerHeight()
            };

            if (this.hasOwnProperty(dir)) {
                return this[dir](elPos, elSize, popupSize);
            } else {
                return this.t(elPos, elSize, popupSize);
            }
        },

        t: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width/2 - popupSize.width/2,
                top: elPos.top + elSize.height
            };
        },

        tl: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width/2 - GLOBAL_SETTINGS.arrowOffset,
                top: elPos.top + elSize.height
            };
        },

        tr: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width/2 - popupSize.width + GLOBAL_SETTINGS.arrowOffset,
                top: elPos.top + elSize.height
            };
        },

        r: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left - popupSize.width,
                top: elPos.top + elSize.height/2 - popupSize.height/2
            };
        },

        rt: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left - popupSize.width,
                top: elPos.top + elSize.height/2 - GLOBAL_SETTINGS.arrowOffset
            };
        },

        rb: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left - popupSize.width,
                top: elPos.top + elSize.height/2 - popupSize.height + GLOBAL_SETTINGS.arrowOffset
            };
        },

        b: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width/2 - popupSize.width/2,
                top: elPos.top - popupSize.height
            };
        },

        bl: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width/2 - GLOBAL_SETTINGS.arrowOffset,
                top: elPos.top - popupSize.height
            };
        },

        br: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width/2 - popupSize.width + GLOBAL_SETTINGS.arrowOffset,
                top: elPos.top - popupSize.height
            };
        },

        l: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width,
                top: elPos.top + elSize.height/2 - popupSize.height/2
            };
        },

        lt: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width,
                top: elPos.top + elSize.height/2 - GLOBAL_SETTINGS.arrowOffset
            };
        },

        lb: function (elPos, elSize, popupSize) {
            return {
                left: elPos.left + elSize.width,
                top: elPos.top + elSize.height/2 - popupSize.height + GLOBAL_SETTINGS.arrowOffset
            };
        }
    };

    function createTooltipElement(data) {
        var html = [
            '<div class="tooltip">',
                '<div class="content-wrap">',
                '</div>',
            '</div>'
        ].join('');

        var el = $(html).hide();

        el.find('.content-wrap').append(createTooltipContent(data));

        if (data.direction) {
            el.addClass(getDirectionClasses(data.direction));
        }

        if (GLOBAL_SETTINGS.useCssArrows) {
            el.addClass('css-arrows');
        }

        return el;
    }

    function createMobilePopupElement(data) {
        var html = [
            '<div class="mobile-popup-wrapper">',
                '<div class="tooltip mobile-popup">',
                    '<button class="icon-close"><span>x</span></button>',
                    '<div class="content-wrap">',
                    '</div>',
                '</div>',
            '</div>'
        ].join('');

        var el = $(html).hide();
        el.find('.content-wrap').append(createTooltipContent(data));

        return el;
    }

    function createTooltipContent(config) {
        if (config.contentSelector) {
            return $(config.contentSelector).show();
        } else {
            return $('<div/>').html(config.content);
        }
    }

    var getDirectionClasses = (function () {
        var classes = {
            t:  't',       // top edge, center
            tl: 't tl',    // top edge, left side
            tr: 't tr',    // top edge, right side
            r:  'r',       // right edge center
            rt: 'r rt',    // right edge on top
            rb: 'r rb',    // right edge on bottom
            b:  'b',       // bottom edge, center
            bl: 'b bl',    // bottom edge, left side
            br: 'b br',    // bottom edge, right side
            l:  'l',       // left edge, center
            lt: 'l lt',    // left edge on top
            lb: 'l lb'     // left edge on bottom
        };

        return function getDirectionClasses(dir) {
            // return matched classes or 'top-center' as default
            return classes[dir] || 't';
        };
    }());


    var getTriggerEvents = (function () {
        var events = {
            click: {on: 'click', off: 'click'},
            hover: {on: 'mouseover', off: 'mouseout'},
            mouseover: {on: 'mouseover', off: 'mouseout'},
            focus : {on: 'focus', off: 'blur'}
        };

        return function getHideEvent(showEvent) {
           return events[showEvent] || events['click'];
        };
    }());


    // jQuery plugin definition
    $.fn[pluginName] = function (config) {
        var args = [].slice.call(arguments, 1);

        return $(this).each(function () {
            var el = $(this);
            var method;

            // case with method call
            if (typeof config === 'string') {
                method = config;
                config = {};
            }

            // get plugin instance
            var instance = el.data(pluginName + '_instance');

            // init plugin when there is no instance
            if (!instance) {
                instance = new Tooltip(el, config);
                el.data(pluginName + '_instance', instance);
            }

            // call requested method with passed arguments
            if (method && typeof instance[method] === 'function') {
                instance[method].apply(instance, args);
            }

            return el;
        });
    };

}(jQuery));
