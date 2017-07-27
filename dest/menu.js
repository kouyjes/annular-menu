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
            visible = typeof el.getAttribute(attrName) !== 'string';
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
        if (typeof name === 'object') {
            Object.keys(name).forEach(function (key) {
                if (key in style) {
                    style[key] = name[key];
                }
            });
        }
        else if (typeof name === 'string') {
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
})(util || (util = {}));
var util$1 = util;

var defaultConstant = {
    centerSize: 30,
    radiusStep: 0,
    offsetRadius: 80,
    arcAngle: Math.PI / 3
};
var ContextMenu = (function () {
    function ContextMenu(option) {
        this.menuList = {
            items: []
        };
        this.centerSize = defaultConstant.centerSize;
        this.assignOption(option);
    }
    ContextMenu.prototype.assignOption = function (option) {
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
    ContextMenu.prototype._renderMenuCenter = function () {
        var centerSize = this.centerSize;
        var center = util$1.createSvgElement('circle');
        center.setAttribute('class', 'menu-center');
        center.setAttribute('r', '' + centerSize);
        center.setAttribute('cx', '0');
        center.setAttribute('cy', '0');
        return center;
    };
    ContextMenu.prototype._renderContentEl = function () {
        var contentEl = util$1.createSvgElement('g');
        contentEl.setAttribute('class', 'menu-position');
        return contentEl;
    };
    ContextMenu.prototype._renderRootEl = function () {
        var svg = util$1.createSvgElement('svg');
        svg.setAttribute('class', 'here-ui-menus');
        return svg;
    };
    ContextMenu.prototype.renderMenuContent = function (menu, offsetAngle, baseRadius, offsetRadius) {
        var tempDeg = offsetAngle;
        var arcCenterX = (baseRadius + offsetRadius / 2) * Math.cos(tempDeg) - offsetRadius / 2, arcCenterY = -(baseRadius + offsetRadius / 2) * Math.sin(tempDeg) - offsetRadius / 2;
        var objectEle = util$1.createSvgElement('foreignObject');
        objectEle.setAttribute('width', '' + offsetRadius);
        objectEle.setAttribute('height', '' + offsetRadius);
        objectEle.setAttribute('x', '' + arcCenterX);
        objectEle.setAttribute('y', '' + arcCenterY);
        var html = util$1.createElement('div');
        html.className = 'menu-panel';
        objectEle.appendChild(html);
        if (menu.html) {
            html.innerHTML = menu.html;
        }
        else {
            var icon = void 0, img = void 0;
            if (menu.icon) {
                icon = util$1.createElement('div');
                icon.className = 'menu-icon';
                img = util$1.createElement('img');
                img.src = menu.icon;
                icon.appendChild(img);
                html.appendChild(icon);
            }
            var text = util$1.createElement('div');
            text.className = 'menu-text';
            text.innerText = menu.caption;
            html.appendChild(text);
        }
        return objectEle;
    };
    ContextMenu.prototype.renderMenus = function (menuList, startDeg, baseRadius) {
        var _this = this;
        if (startDeg === void 0) { startDeg = 0; }
        if (baseRadius === void 0) { baseRadius = this.centerSize; }
        var offsetRadius = util$1.valueOf(menuList.offsetRadius, defaultConstant.offsetRadius);
        var radiusStep = util$1.valueOf(menuList.radiusStep, defaultConstant.radiusStep);
        baseRadius += radiusStep;
        var pg = util$1.createSvgElement('g');
        pg.setAttribute('class', 'menu-items');
        var menus = menuList.items;
        var offsetAngle = 0;
        menus.forEach(function (menu) {
            var angle = menu.angle;
            var tempDeg = startDeg + angle + offsetAngle;
            var arcG = (util$1.createSvgElement('g'));
            arcG.setAttribute('class', 'menu-path-g');
            arcG.__menuData__ = {
                menu: menu,
                angle: angle,
                radius: baseRadius + offsetRadius,
                offsetAngle: startDeg + offsetAngle
            };
            var p = util$1.createSvgElement('path');
            p.setAttribute('class', 'menu-path');
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
    ContextMenu.prototype.render = function (position) {
        var rootEl = this._renderRootEl(), contentEl = this._renderContentEl(), menuCenter = this._renderMenuCenter();
        contentEl.appendChild(menuCenter);
        rootEl.appendChild(contentEl);
        this._el = rootEl;
        this.contentEl = contentEl;
        this.contentEl.setAttribute('transform', 'translate(' + position.x + ',' + position.y + ')');
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
    ContextMenu.prototype._findMenuTarget = function (target) {
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
    ContextMenu.prototype.bindEvent = function () {
        var _this = this;
        var currentMenuEl;
        this._el.addEventListener('mouseover', function (e) {
            var target = e.target;
            var menuTarget = _this._findMenuTarget(target);
            if (currentMenuEl === menuTarget) {
                return;
            }
            if (menuTarget) {
                currentMenuEl = menuTarget;
                _this.renderMenu(menuTarget);
            }
        });
    };
    ContextMenu.prototype._findMenuTargetPath = function (target) {
        var className = 'menu-items';
        var pathElements = [];
        while ((target = util$1.parent(target)) && target !== this._el) {
            var classNames = (target.getAttribute('class') || '').split(/\s+/);
            if (classNames.indexOf(className) >= 0) {
                pathElements.unshift(target);
            }
        }
        return pathElements;
    };
    ContextMenu.prototype.getAllMenuElements = function () {
        var selector = '.menu-items';
        var slice = Array.prototype.slice;
        return slice.call(this._el.querySelectorAll(selector));
    };
    ContextMenu.prototype.renderMenu = function (target, visible) {
        if (visible === void 0) { visible = true; }
        var pathElements = this._findMenuTargetPath(target);
        this.getAllMenuElements().forEach(function (el) {
            var existIndex = pathElements.indexOf(el);
            if (existIndex >= 0) {
                util$1.toggleVisible(el, true);
                pathElements.splice(existIndex, 1);
                return;
            }
            util$1.toggleVisible(el, false);
        });
        pathElements.forEach(function (el, index) {
            if (!visible && index === pathElements.length - 1) {
                return;
            }
            util$1.toggleVisible(el, true);
        });
        var menuGroupEl = target.querySelector('.menu-items');
        if (!menuGroupEl) {
            var menuData = target.__menuData__;
            var currentMenu = menuData.menu;
            var menuList = currentMenu.menuList;
            var menus = menuList && menuList.items;
            if (!menus || menus.length === 0) {
                return;
            }
            var angle_1 = menuList.angle || defaultConstant.arcAngle;
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
    return ContextMenu;
}());

exports.ContextMenu = ContextMenu;

Object.defineProperty(exports, '__esModule', { value: true });

})));
