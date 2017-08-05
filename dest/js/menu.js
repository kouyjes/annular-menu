/* menus */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.HERE = global.HERE || {}, global.HERE.UI = global.HERE.UI || {})));
}(this, (function (exports) { 'use strict';

var util;
(function (util) {
    util.namespaces = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: 'http://www.w3.org/1999/xhtml',
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/'
    };
    function isDefined(value) {
        return value !== undefined;
    }
    util.isDefined = isDefined;
    function isNumber(value) {
        return typeof value === 'number';
    }
    util.isNumber = isNumber;
    function valueOf(value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = value; }
        return isDefined(value) ? value : defaultValue;
    }
    util.valueOf = valueOf;
    function isFunction(fn) {
        return typeof fn === 'function';
    }
    util.isFunction = isFunction;
    function createSvgElement(qualifiedName) {
        var namespaceURI = util.namespaces.svg;
        return document.createElementNS(namespaceURI, qualifiedName);
    }
    util.createSvgElement = createSvgElement;
    function createElement(qualifiedName) {
        var el = document.createElement(qualifiedName);
        return el;
    }
    util.createElement = createElement;
    function preAppend(parent, element) {
        var children = parent.children;
        if (children && children.length > 0) {
            parent.insertBefore(element, children[0]);
        }
        else if (parent.firstChild) {
            parent.insertBefore(element, parent.firstChild);
        }
        else {
            parent.appendChild(element);
        }
    }
    util.preAppend = preAppend;
    function toggleVisible(el, visible) {
        var className = 'active';
        toggleClass(el, className, visible);
    }
    util.toggleVisible = toggleVisible;
    function toggleSelect(el, select) {
        var className = 'selected';
        toggleClass(el, className, select);
    }
    util.toggleSelect = toggleSelect;
    function getClassNames(el) {
        var clazz = el.getAttribute('class') || '';
        var classNames = clazz.split(/\s+/);
        return classNames;
    }
    function addClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        if (classNames.indexOf(className) >= 0) {
            return;
        }
        classNames.push(className);
        el.setAttribute('class', classNames.join(' '));
    }
    util.addClass = addClass;
    function removeClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        var index = classNames.indexOf(className);
        if (index >= 0) {
            classNames.splice(index, 1);
        }
        el.setAttribute('class', classNames.join(' '));
    }
    util.removeClass = removeClass;
    function hasClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        return classNames.indexOf(className) >= 0;
    }
    util.hasClass = hasClass;
    function toggleClass(el, className, addOrRemove) {
        if (addOrRemove === void 0) {
            addOrRemove = !hasClass(el, className);
        }
        if (addOrRemove) {
            addClass(el, className);
        }
        else {
            removeClass(el, className);
        }
    }
    util.toggleClass = toggleClass;
    function style(el, name, value) {
        var style = el.style;
        if (isObject(name)) {
            Object.keys(name).forEach(function (key) {
                if (key in style) {
                    style[key] = name[key];
                }
            });
        }
        else if (isString(name)) {
            if (value === undefined) {
                return style[name];
            }
            style[name] = value;
        }
    }
    util.style = style;
    
    function parent(target) {
        return target.parentElement || target.parentNode;
    }
    util.parent = parent;
    function isObject(value) {
        return typeof value === 'object' && null != value;
    }
    util.isObject = isObject;
    function isString(value) {
        return typeof value === 'string';
    }
    util.isString = isString;
    function isEventSupport(eventType) {
        return 'on' + eventType in document;
    }
    util.isEventSupport = isEventSupport;
    function getPosition(e) {
        var touches = e['touches'];
        if (touches && touches.length > 0) {
            e = touches[0];
        }
        var evt = e;
        var x = evt.clientX || evt.pageX, y = evt.clientY || evt.pageY;
        return {
            x: x,
            y: y
        };
    }
    util.getPosition = getPosition;
    function sizeOf(el) {
        var size = {
            width: el.clientWidth,
            height: el.clientHeight
        };
        return size;
    }
    util.sizeOf = sizeOf;
    function transform(el, name, value, defaultValue) {
        var attrName = 'transform';
        var transform = el.getAttribute(attrName) || '';
        var reg = new RegExp('\\b(' + name + ')\\s*\\(\\s*([^()]+)\\s*[,|\\s]\\s*([^()]+)\\s*\\)');
        var _reg = new RegExp('\\b(' + name + ')\\s*\\(\\s*([^()]+)\\s*\\)');
        var _value = {
            x: defaultValue.x,
            y: defaultValue.y
        };
        if (transform) {
            var match = transform.match(reg);
            if (!match) {
                match = transform.match(_reg);
                reg = _reg;
            }
            if (match) {
                if (parseFloat(match[2])) {
                    _value.x = parseFloat(match[2]);
                }
                if (parseFloat(match[3])) {
                    _value.y = parseFloat(match[3]);
                }
                else {
                    _value.y = _value.x;
                }
            }
        }
        if (value === void 0) {
            return _value;
        }
        if (!value.x) {
            value.x = _value.x;
        }
        if (!value.y) {
            value.y = _value.y;
        }
        var valueStr = '(' + value.x + ',' + value.y + ')';
        if (!reg.test(transform)) {
            transform += ' ' + name + valueStr;
        }
        else {
            transform = transform.replace(reg, function (all, name) {
                return name + valueStr;
            });
        }
        el.setAttribute(attrName, transform);
    }
    util.transform = transform;
})(util || (util = {}));
var nextFrame = window.requestAnimationFrame || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFram'] || function (executor) {
    return setTimeout(executor, 1000 / 60);
};
var cancelFrame = window.cancelAnimationFrame || window['webkitCancelAnimationFrame'] || window['mozCancelAnimationFrame'] || clearTimeout;
var util$1 = util;

var defaultConstant = {
    angleStep: 0,
    centerSize: 30,
    radiusStep: 0,
    offsetRadius: 80,
    arcAngle: Math.PI / 3
};
var classNames = {
    root: 'here-ui-annular-menu',
    position: 'menu-position',
    center: 'menu-center',
    menuPathGroup: 'menu-path-g',
    menuPath: 'menu-path',
    menuContent: 'menu-content',
    menuIcon: 'menu-icon',
    menuText: 'menu-text',
    menuItems: 'menu-items',
    menuItemsRoot: 'menu-items-root'
};

var AnnularMenu = (function () {
    function AnnularMenu(option) {
        this.menuList = {
            __data__: {},
            items: []
        };
        this.collapsible = true;
        this.draggable = true;
        this.centerSize = defaultConstant.centerSize;
        this.listeners = {
            click: [],
            mouseover: [],
            menuClick: [],
            menuHover: []
        };
        this.assignOption(option);
    }
    AnnularMenu.prototype.assignOption = function (option) {
        var _this = this;
        if (!option) {
            return;
        }
        Object.keys(option).forEach(function (key) {
            var value = option[key];
            if (typeof value === typeof _this[key]) {
                _this[key] = value;
            }
        });
    };
    /**
     * render menu center
     */
    AnnularMenu.prototype._renderCenterEl = function () {
        var centerSize = this.centerSize;
        var center = util$1.createSvgElement('circle');
        util$1.addClass(center, classNames.center);
        center.setAttribute('r', '' + centerSize);
        center.setAttribute('cx', '0');
        center.setAttribute('cy', '0');
        var g = util$1.createSvgElement('g');
        g.appendChild(center);
        return g;
    };
    AnnularMenu.prototype._renderContentEl = function () {
        var contentEl = util$1.createSvgElement('g');
        util$1.addClass(contentEl, classNames.position);
        return contentEl;
    };
    AnnularMenu.prototype._renderRootEl = function () {
        var svg = util$1.createSvgElement('svg');
        util$1.addClass(svg, classNames.root);
        util$1.toggleVisible(svg, true);
        return svg;
    };
    AnnularMenu.prototype.renderMenuContentEl = function (menu, offsetAngle, baseRadius, offsetRadius) {
        var tempDeg = offsetAngle;
        var arcCenterX = (baseRadius + offsetRadius / 2) * Math.cos(tempDeg) - offsetRadius / 2, arcCenterY = -(baseRadius + offsetRadius / 2) * Math.sin(tempDeg) - offsetRadius / 2;
        var objectEle = util$1.createSvgElement('foreignObject');
        objectEle.setAttribute('width', '' + offsetRadius);
        objectEle.setAttribute('height', '' + offsetRadius);
        objectEle.setAttribute('x', '' + arcCenterX);
        objectEle.setAttribute('y', '' + arcCenterY);
        var html = util$1.createElement('div');
        html.className = classNames.menuContent;
        objectEle.appendChild(html);
        if (menu.html) {
            html.innerHTML = menu.html;
        }
        else {
            var icon = void 0, img = void 0;
            if (menu.icon) {
                icon = util$1.createElement('div');
                icon.className = classNames.menuIcon;
                img = util$1.createElement('img');
                img.src = menu.icon;
                icon.appendChild(img);
                html.appendChild(icon);
            }
            if (menu.caption) {
                var text = util$1.createElement('div');
                text.className = classNames.menuText;
                text.innerText = menu.caption;
                html.appendChild(text);
            }
        }
        return objectEle;
    };
    AnnularMenu.prototype.renderMenuList = function (menuList, startDeg, baseRadius) {
        var _this = this;
        if (startDeg === void 0) { startDeg = 0; }
        if (baseRadius === void 0) { baseRadius = this.centerSize; }
        var offsetRadius = util$1.valueOf(menuList.offsetRadius, defaultConstant.offsetRadius);
        var radiusStep = util$1.valueOf(menuList.radiusStep, defaultConstant.radiusStep);
        baseRadius += radiusStep;
        var pg = util$1.createSvgElement('g');
        util$1.addClass(pg, classNames.menuItems);
        var menus = menuList.items;
        var offsetAngle = 0;
        menus.forEach(function (menu) {
            var angle = menu.angle;
            var tempDeg = startDeg + angle + offsetAngle;
            var arcG = (util$1.createSvgElement('g'));
            util$1.addClass(arcG, classNames.menuPathGroup);
            arcG.__menuData__ = {
                menu: menu,
                radius: baseRadius + offsetRadius,
                offsetAngle: startDeg + offsetAngle
            };
            var p = util$1.createSvgElement('path');
            util$1.addClass(p, classNames.menuPath);
            var paths = [];
            var pointA = {
                x: Math.cos(tempDeg) * baseRadius,
                y: -Math.sin(tempDeg) * baseRadius
            };
            paths.push('M' + pointA.x + ' ' + pointA.y);
            var radius = baseRadius + offsetRadius;
            var pointB = {
                x: Math.cos(tempDeg) * radius,
                y: -Math.sin(tempDeg) * radius
            };
            paths.push('L' + pointB.x + ' ' + pointB.y);
            tempDeg = startDeg + offsetAngle;
            var pointC = {
                x: Math.cos(tempDeg) * radius,
                y: -Math.sin(tempDeg) * radius
            };
            paths.push('A' + radius + ' ' + radius + ' 0 0 1 ' + pointC.x + ' ' + pointC.y);
            var pointD = {
                x: Math.cos(tempDeg) * baseRadius,
                y: -Math.sin(tempDeg) * baseRadius
            };
            paths.push('L' + pointD.x + ' ' + pointD.y);
            paths.push('A' + baseRadius + ' ' + baseRadius + ' 0 0 0 ' + pointA.x + ' ' + pointA.y);
            p.setAttribute('d', paths.join(''));
            //create text area
            var contentAngle = startDeg + offsetAngle + angle / 2;
            var menuContent = _this.renderMenuContentEl(menu, contentAngle, baseRadius, offsetRadius);
            arcG.appendChild(p);
            arcG.appendChild(menuContent);
            if (util$1.isFunction(menu.callback)) {
                menu.callback.call(undefined, arcG);
            }
            arcG._parent = pg;
            pg.appendChild(arcG);
            offsetAngle += angle + menu.angleStep;
        });
        if (util$1.isFunction(menuList.callback)) {
            menuList.callback.call(undefined, pg);
        }
        return pg;
    };
    AnnularMenu.prototype.render = function (position) {
        var rootEl = this._renderRootEl(), contentEl = this._renderContentEl(), menuCenter = this._renderCenterEl();
        contentEl.appendChild(menuCenter);
        rootEl.appendChild(contentEl);
        this.element = rootEl;
        this.contentEl = contentEl;
        if (position) {
            this.position(position);
        }
        var menuList = this.menuList;
        var menus = menuList && menuList.items;
        if (!menus || menus.length === 0) {
            return;
        }
        menuList.angle = menuList.angle || 2 * Math.PI / menus.length;
        this._initMenuListData(menuList);
        var pg = this.renderMenuList(this.menuList);
        util$1.addClass(pg, classNames.menuItemsRoot);
        util$1.preAppend(contentEl, pg);
        this.bindEvent();
        return this.element;
    };
    AnnularMenu.prototype._initMenuListData = function (menuList) {
        var totalAngle = 0;
        var angle = util$1.isNumber(menuList.angle) ? menuList.angle : defaultConstant.arcAngle;
        var angleStep = util$1.isNumber(menuList.angleStep) ? menuList.angleStep : defaultConstant.angleStep;
        menuList.items.forEach(function (menu) {
            menu.angle = util$1.isNumber(menu.angle) ? menu.angle : angle;
            menu.angleStep = util$1.isNumber(menu.angleStep) ? menu.angleStep : angleStep;
            totalAngle += (menu.angle + menu.angleStep);
        });
        if (!menuList.__data__) {
            menuList.__data__ = {};
        }
        menuList.__data__.totalAngle = totalAngle;
    };
    AnnularMenu.prototype.scale = function (point) {
        return util$1.transform(this.contentEl, 'scale', point, {
            x: 1,
            y: 1
        });
    };
    AnnularMenu.prototype.position = function (point) {
        return util$1.transform(this.contentEl, 'translate', point, {
            x: 0,
            y: 0
        });
    };
    AnnularMenu.prototype.toggleCollapse = function (collapse) {
        var className = 'collapse';
        if (collapse === void 0) {
            collapse = !util$1.hasClass(this.contentEl, className);
        }
        if (collapse) {
            util$1.addClass(this.contentEl, className);
            this.collapseAllSubMenus();
        }
        else {
            util$1.removeClass(this.contentEl, className);
        }
    };
    AnnularMenu.prototype.toggleVisible = function (visible) {
        util$1.toggleVisible(this.element, visible);
    };
    AnnularMenu.prototype._findMenuTarget = function (target) {
        while (true) {
            if (target.__menuData__) {
                return target;
            }
            if (target === this.element) {
                break;
            }
            if (target = util$1.parent(target)) {
            }
            else {
                break;
            }
        }
        return null;
    };
    AnnularMenu.prototype.bindEvent = function () {
        // bind collapse event
        if (this.collapsible) {
            this.bindCollapseEvent();
        }
        if (this.draggable) {
            this.bindDragEvent();
        }
        // bind mouse over event
        this.bindHoverEvent();
    };
    AnnularMenu.prototype.bindDragEvent = function () {
        var _this = this;
        var events;
        var circleEl = this.contentEl.querySelector(this._selector(classNames.center));
        var className = 'event-source';
        var startPoint, startPos = null;
        var stopEvent = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        var mouseDown = function (e) {
            util$1.addClass(_this.element, className);
            startPoint = util$1.getPosition(e);
            
            startPos = _this.position();
        };
        var mouseMove = function (e) {
            if (!startPoint) {
                return;
            }
            var curPoint = util$1.getPosition(e);
            var pos = {
                x: curPoint.x - startPoint.x + startPos.x,
                y: curPoint.y - startPoint.y + startPos.y
            };
            var size = util$1.sizeOf(_this.element);
            pos.x = Math.max(_this.centerSize, pos.x);
            pos.x = Math.min(pos.x, size.width - _this.centerSize);
            pos.y = Math.max(_this.centerSize, pos.y);
            pos.y = Math.min(pos.y, size.height - _this.centerSize);
            _this.position(pos);
            stopEvent(e);
        };
        var mouseUp = function (e) {
            util$1.removeClass(_this.element, className);
            var curPoint = util$1.getPosition(e);
            if (startPoint && Math.pow(curPoint.x - startPoint.x, 2) + Math.pow(curPoint.y - startPoint.y, 2) > Math.pow(5, 2)) {
                circleEl.moved = true;
                stopEvent(e);
            }
            else {
                circleEl.moved = false;
            }
            startPoint = null;
            startPos = null;
        };
        events = [
            {
                el: circleEl,
                types: ['touchstart', 'mousedown'],
                handler: mouseDown
            },
            {
                el: this.element,
                types: ['touchmove', 'mousemove'],
                handler: mouseMove
            },
            {
                el: this.element,
                types: ['touchend', 'mouseup'],
                handler: mouseUp
            },
            {
                el: this.element,
                types: ['mouseleave'],
                handler: mouseUp
            }
        ];
        events.some(function (eventItem) {
            eventItem.types.some(function (type) {
                if (util$1.isEventSupport(type)) {
                    eventItem.el.addEventListener(type, eventItem.handler);
                    return true;
                }
            });
        });
    };
    AnnularMenu.prototype.bindCollapseEvent = function () {
        var _this = this;
        var circleEl = this.contentEl.querySelector(this._selector(classNames.center));
        circleEl.addEventListener('click', function (e) {
            !circleEl.moved && _this.toggleCollapse();
            e.stopPropagation();
        });
    };
    AnnularMenu.prototype.bindHoverEvent = function () {
        var _this = this;
        var currentMenuEl, subMenuRenderTimeout;
        var renderSubMenus = function (menuTarget) {
            if (currentMenuEl === menuTarget) {
                return;
            }
            subMenuRenderTimeout && cancelFrame(subMenuRenderTimeout);
            subMenuRenderTimeout = nextFrame(function () {
                currentMenuEl = menuTarget;
                _this.renderSubMenus(menuTarget);
            });
        };
        ['mouseover', 'click'].forEach(function (evtType) {
            _this.element.addEventListener(evtType, function (e) {
                var target = e.target;
                var menuTarget = _this._findMenuTarget(target);
                renderSubMenus(menuTarget);
                if (menuTarget) {
                    var menu_1 = menuTarget.__menuData__.menu;
                    if (e.type === 'click') {
                        _this.listeners.menuClick.forEach(function (handler) {
                            handler.call(_this, _this.createEvent(e, menuTarget, 'menuClick', menu_1));
                        });
                    }
                    else {
                        _this.listeners.menuHover.forEach(function (handler) {
                            handler.call(_this, _this.createEvent(e, menuTarget, 'menuHover', menu_1));
                        });
                    }
                }
                _this.listeners[evtType].forEach(function (handler) {
                    handler.call(_this, _this.createEvent(e, _this.element, evtType));
                });
            });
        });
    };
    AnnularMenu.prototype.createEvent = function (e, target, type, data) {
        return {
            type: type,
            target: target,
            data: data,
            native: e
        };
    };
    AnnularMenu.prototype.addEventListener = function (type, handler) {
        var listeners = this.listeners[type];
        if (!listeners) {
            return;
        }
        var index = listeners.indexOf(handler);
        if (index === -1 && handler) {
            listeners.push(handler);
        }
    };
    AnnularMenu.prototype.removeEventListener = function (type, handler) {
        var listeners = this.listeners[type];
        if (!listeners) {
            return;
        }
        var index = listeners.indexOf(handler);
        if (index >= 0) {
            listeners.splice(index, 1);
        }
    };
    AnnularMenu.prototype.getMenuPathEls = function (target) {
        var pathElements = [];
        while (target && target !== this.element) {
            if (target.__menuData__) {
                pathElements.unshift(target);
            }
            target = target._parent;
        }
        return pathElements;
    };
    AnnularMenu.prototype._className = function (className, prefix) {
        if (!prefix) {
            return className;
        }
        return prefix + '-' + className;
    };
    AnnularMenu.prototype._selector = function (className, prefix) {
        className = this._className(className, prefix);
        return '.' + className;
    };
    AnnularMenu.prototype.getAllMenuEls = function () {
        var selector = this._selector(classNames.menuPathGroup);
        var slice = Array.prototype.slice;
        return slice.call(this.element.querySelectorAll(selector));
    };
    AnnularMenu.prototype.collapseAllSubMenus = function () {
        var _this = this;
        this.getAllMenuEls().forEach(function (el) {
            _this.toggleMenuElVisible(el, false);
        });
    };
    AnnularMenu.prototype.toggleMenuElVisible = function (el, visible) {
        util$1.toggleVisible(el, visible);
        el._child && util$1.toggleVisible(el._child, visible);
    };
    AnnularMenu.prototype.unSelectAllMenus = function () {
        this.getAllMenuEls().forEach(function (el) {
            util$1.toggleSelect(el, false);
        });
    };
    AnnularMenu.prototype.selectMenuEl = function (target) {
        if (!target) {
            return;
        }
        this.unSelectAllMenus();
        var pathElements = this.getMenuPathEls(target);
        pathElements.forEach(function (el) {
            util$1.toggleSelect(el, true);
        });
    };
    AnnularMenu.prototype.renderSubMenus = function (target) {
        var _this = this;
        this.collapseAllSubMenus();
        if (!target) {
            return;
        }
        var menuGroupEl = target._child;
        if (!menuGroupEl) {
            var menuData = target.__menuData__;
            var currentMenu = menuData.menu;
            var menuList = currentMenu.menuList;
            var menus = menuList && menuList.items;
            if (menus && menus.length > 0) {
                this._initMenuListData(menuList);
                var totalAngle = menuList.__data__.totalAngle;
                var startAngle = menuData.offsetAngle - (totalAngle - currentMenu.angle) / 2;
                menuGroupEl = this.renderMenuList(currentMenu.menuList, startAngle, menuData.radius);
                target._child = menuGroupEl;
                menuGroupEl._parent = target;
                util$1.preAppend(this.contentEl, menuGroupEl);
            }
        }
        var pathElements = this.getMenuPathEls(target);
        pathElements.forEach(function (el) {
            _this.toggleMenuElVisible(el, true);
        });
    };
    return AnnularMenu;
}());

exports.AnnularMenu = AnnularMenu;

Object.defineProperty(exports, '__esModule', { value: true });

})));
