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
        if (children.length > 0) {
            parent.insertBefore(element, children[0]);
        }
        else {
            parent.appendChild(element);
        }
    }
    util.preAppend = preAppend;
    function toggleVisible(el, visible) {
        var attrName = 'active';
        if (visible === void 0) {
            visible = !isString(el.getAttribute(attrName));
        }
        if (visible) {
            el.setAttribute(attrName, '');
        }
        else {
            el.removeAttribute(attrName);
        }
    }
    util.toggleVisible = toggleVisible;
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
})(util || (util = {}));
var util$1 = util;

var defaultConstant = {
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
    menuItems: 'menu-items'
};

var AnnularMenu = (function () {
    function AnnularMenu(option) {
        this.menuList = {
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
    AnnularMenu.prototype._renderMenuCenter = function () {
        var centerSize = this.centerSize;
        var center = util$1.createSvgElement('circle');
        center.setAttribute('class', classNames.center);
        center.setAttribute('r', '' + centerSize);
        center.setAttribute('cx', '0');
        center.setAttribute('cy', '0');
        return center;
    };
    AnnularMenu.prototype._renderContentEl = function () {
        var contentEl = util$1.createSvgElement('g');
        contentEl.setAttribute('class', classNames.position);
        return contentEl;
    };
    AnnularMenu.prototype._renderRootEl = function () {
        var svg = util$1.createSvgElement('svg');
        svg.setAttribute('class', classNames.root);
        util$1.toggleVisible(svg, true);
        return svg;
    };
    AnnularMenu.prototype.renderMenuContent = function (menu, offsetAngle, baseRadius, offsetRadius) {
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
            var text = util$1.createElement('div');
            text.className = classNames.menuText;
            text.innerText = menu.caption;
            html.appendChild(text);
        }
        return objectEle;
    };
    AnnularMenu.prototype.renderMenus = function (menuList, startDeg, baseRadius) {
        var _this = this;
        if (startDeg === void 0) { startDeg = 0; }
        if (baseRadius === void 0) { baseRadius = this.centerSize; }
        var offsetRadius = util$1.valueOf(menuList.offsetRadius, defaultConstant.offsetRadius);
        var radiusStep = util$1.valueOf(menuList.radiusStep, defaultConstant.radiusStep);
        baseRadius += radiusStep;
        var pg = util$1.createSvgElement('g');
        pg.setAttribute('class', classNames.menuItems);
        var menus = menuList.items;
        var offsetAngle = 0;
        menus.forEach(function (menu) {
            var angle = menu.angle;
            var tempDeg = startDeg + angle + offsetAngle;
            var arcG = (util$1.createSvgElement('g'));
            arcG.setAttribute('class', classNames.menuPathGroup);
            arcG.__menuData__ = {
                menu: menu,
                angle: angle,
                radius: baseRadius + offsetRadius,
                offsetAngle: startDeg + offsetAngle
            };
            var p = util$1.createSvgElement('path');
            p.setAttribute('class', classNames.menuPath);
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
            var menuContent = _this.renderMenuContent(menu, contentAngle, baseRadius, offsetRadius);
            arcG.appendChild(p);
            arcG.appendChild(menuContent);
            if (util$1.isFunction(menu.callback)) {
                menu.callback.call(undefined, arcG);
            }
            pg.appendChild(arcG);
            offsetAngle += angle;
        });
        if (util$1.isFunction(menuList.callback)) {
            menuList.callback.call(undefined, pg);
        }
        return pg;
    };
    AnnularMenu.prototype.render = function (position) {
        var rootEl = this._renderRootEl(), contentEl = this._renderContentEl(), menuCenter = this._renderMenuCenter();
        contentEl.appendChild(menuCenter);
        rootEl.appendChild(contentEl);
        this._el = rootEl;
        this.contentEl = contentEl;
        if (position) {
            this.position(position);
        }
        var menuList = this.menuList;
        var menus = menuList && menuList.items;
        if (!menus || menus.length === 0) {
            return;
        }
        var angle = menuList.angle;
        angle = angle || 2 * Math.PI / menus.length;
        menus.forEach(function (menu) {
            menu.angle = menu.angle || angle;
        });
        var pg = this.renderMenus(this.menuList);
        util$1.preAppend(contentEl, pg);
        this.bindEvent();
        return this._el;
    };
    AnnularMenu.prototype.position = function (pointX, pointY) {
        var attrName = 'transform';
        var transform = this.contentEl.getAttribute(attrName) || '';
        var translateReg = /\b(translate)\s*\(\s*([^()]+)\s*,\s*([^()]+)\s*\)/;
        var _position = {
            x: 0,
            y: 0
        };
        if (transform) {
            var match = transform.match(translateReg);
            if (match) {
                _position.x = parseFloat(match[2]) || 0;
                _position.y = parseFloat(match[3]) || 0;
            }
        }
        if (pointX === void 0) {
            return _position;
        }
        var point;
        if (util$1.isObject(pointX)) {
            point = pointX;
            if (pointY !== void 0) {
                point.y = pointY;
            }
        }
        else {
            point = {
                x: pointX,
                y: pointY
            };
        }
        point.x = point.x === void 0 ? _position.x : point.x;
        point.y = point.y === void 0 ? _position.y : point.y;
        var posStr = '(' + point.x + ',' + point.y + ')';
        if (!translateReg.test(transform)) {
            transform += ' translate' + posStr;
        }
        else {
            transform = transform.replace(translateReg, function (all, name) {
                return name + posStr;
            });
        }
        this.contentEl.setAttribute(attrName, transform);
    };
    AnnularMenu.prototype.toggleCollapse = function (collapse) {
        var attrName = 'collapse';
        if (collapse === void 0) {
            collapse = !this.contentEl.hasAttribute(attrName);
        }
        if (collapse) {
            this.contentEl.setAttribute(attrName, '');
            this.collapseAllSubMenus();
        }
        else {
            this.contentEl.removeAttribute(attrName);
        }
    };
    AnnularMenu.prototype.toggleVisible = function (visible) {
        util$1.toggleVisible(this._el, visible);
    };
    AnnularMenu.prototype._findMenuTarget = function (target) {
        while (true) {
            if (target.__menuData__) {
                return target;
            }
            if (target === this._el) {
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
    };
    AnnularMenu.prototype.bindCollapseEvent = function () {
        var _this = this;
        var circleEl = this.contentEl.querySelector(this._selector(classNames.center));
        circleEl.addEventListener('click', function () {
            _this.toggleCollapse();
        });
    };
    AnnularMenu.prototype.bindHoverEvent = function () {
        var _this = this;
        var currentMenuEl, subMenuRenderTimeout;
        var renderSubMenus = function (menuTarget) {
            if (currentMenuEl === menuTarget) {
                return;
            }
            subMenuRenderTimeout && clearTimeout(subMenuRenderTimeout);
            subMenuRenderTimeout = setTimeout(function () {
                currentMenuEl = menuTarget;
                _this.renderSubMenus(menuTarget);
            }, 30);
        };
        ['mouseover', 'click'].forEach(function (evtType) {
            _this._el.addEventListener(evtType, function (e) {
                var target = e.target;
                var menuTarget = _this._findMenuTarget(target);
                renderSubMenus(menuTarget);
                if (menuTarget) {
                    var menu_1 = menuTarget.__menuData__.menu;
                    if (e.type === 'click') {
                        _this.listeners.menuClick.forEach(function (handler) {
                            handler.call(_this, e, menu_1);
                        });
                    }
                    else {
                        _this.listeners.menuHover.forEach(function (handler) {
                            handler.call(_this, e, menu_1);
                        });
                    }
                }
                _this.listeners[evtType].forEach(function (handler) {
                    handler.call(_this, e);
                });
            });
        });
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
    AnnularMenu.prototype._findMenuTargetPath = function (target) {
        var pathElements = [];
        while (target && target !== this._el) {
            if (target.__menuData__) {
                pathElements.unshift(target);
            }
            target = util$1.parent(target);
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
    AnnularMenu.prototype.getAllMenuEl = function () {
        var selector = this._selector(classNames.menuPathGroup);
        var slice = Array.prototype.slice;
        return slice.call(this._el.querySelectorAll(selector));
    };
    AnnularMenu.prototype.collapseAllSubMenus = function () {
        this.getAllMenuEl().forEach(function (el) {
            util$1.toggleVisible(el, false);
        });
    };
    AnnularMenu.prototype.renderSubMenus = function (target, visible) {
        if (visible === void 0) { visible = true; }
        this.collapseAllSubMenus();
        if (!target) {
            return;
        }
        var menusElSelector = this._selector(classNames.menuItems);
        var pathElements = this._findMenuTargetPath(target);
        pathElements.forEach(function (el, index) {
            if (!visible && index === pathElements.length - 1) {
                return;
            }
            util$1.toggleVisible(el, true);
        });
        var menuGroupEl = target.querySelector(menusElSelector);
        if (!menuGroupEl) {
            var menuData = target.__menuData__;
            var currentMenu = menuData.menu;
            var menuList = currentMenu.menuList;
            var menus = menuList && menuList.items;
            if (!menus || menus.length === 0) {
                return;
            }
            var angle_1 = menuList.angle || currentMenu.angle || defaultConstant.arcAngle;
            var totalAngle_1 = 0;
            menus.forEach(function (menu) {
                menu.angle = menu.angle || angle_1;
                totalAngle_1 += menu.angle;
            });
            var startAngle = menuData.offsetAngle - (totalAngle_1 - menuData.angle) / 2;
            menuGroupEl = this.renderMenus(currentMenu.menuList, startAngle, menuData.radius);
            util$1.preAppend(target, menuGroupEl);
        }
        if (menuGroupEl) {
            util$1.toggleVisible(menuGroupEl, true);
        }
    };
    return AnnularMenu;
}());

exports.AnnularMenu = AnnularMenu;

Object.defineProperty(exports, '__esModule', { value: true });

})));
