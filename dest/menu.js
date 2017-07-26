/* menus */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.HERE = global.HERE || {}, global.HERE.UI = global.HERE.UI || {})));
}(this, (function (exports) { 'use strict';

var util;
(function (util) {
    var xhtml = "http://www.w3.org/1999/xhtml";
    var namespaces = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: xhtml,
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };
    function createSvgElement(qualifiedName) {
        var namespaceURI = namespaces.svg;
        return document.createElementNS(namespaceURI, qualifiedName);
    }
    util.createSvgElement = createSvgElement;
})(util || (util = {}));
var util$1 = util;

var defaultConstant = {
    fontSize: 12,
    centerSize: 30,
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
    ContextMenu.prototype.show = function (position, parent) {
        parent = parent || document.body;
        if (!this.el) {
            this.render();
            parent.appendChild(this.el);
        }
        this.contentEl.setAttribute('transform', 'translate(' + position.x + ',' + position.y + ')');
    };
    /**
     * render menu center
     */
    ContextMenu.prototype.renderMenuCenter = function () {
        var centerSize = this.centerSize;
        var center = util$1.createSvgElement('circle');
        center.setAttribute('r', '' + centerSize);
        center.setAttribute('cx', '0');
        center.setAttribute('cy', '0');
        center.setAttribute('fill', '#ccc');
        this.contentEl.appendChild(center);
    };
    ContextMenu.prototype.renderMenuRoot = function () {
        var svg = util$1.createSvgElement('svg');
        svg.setAttribute('class', 'here-ui-menus');
        this.el = svg;
        var contentEl = util$1.createSvgElement('g');
        contentEl.setAttribute('class', 'menu-position');
        this.contentEl = contentEl;
        svg.appendChild(contentEl);
    };
    ContextMenu.prototype.renderMenuContent = function (menu, offsetAngle, baseRadius, offsetRadius) {
        var tempDeg = offsetAngle;
        var arcCenterX = (baseRadius + offsetRadius / 2) * Math.cos(tempDeg) - offsetRadius / 2, arcCenterY = -(baseRadius + offsetRadius / 2) * Math.sin(tempDeg) - offsetRadius / 2;
        var objectEle = util$1.createSvgElement('foreignObject');
        objectEle.setAttribute('width', '' + offsetRadius);
        objectEle.setAttribute('height', '' + offsetRadius);
        objectEle.setAttribute('x', '' + arcCenterX);
        objectEle.setAttribute('y', '' + arcCenterY);
        var fontSize = menu.fontSize || defaultConstant.fontSize;
        fontSize = Math.max(Number(fontSize), defaultConstant.fontSize);
        var html = document.createElement('div');
        html.className = 'menu-html';
        var img = document.createElement('img');
        img.src = 'image/icon.png';
        img.className = 'menu-icon';
        img.style.height = (offsetRadius - fontSize) + 'px';
        var text = document.createElement('div');
        text.className = 'menu-text';
        text.innerText = menu.caption;
        text.style.fontSize = fontSize + 'px';
        text.style.height = fontSize + 'px';
        html.appendChild(img);
        html.appendChild(text);
        objectEle.appendChild(html);
        return objectEle;
    };
    ContextMenu.prototype.renderMenus = function (menuList, startDeg, baseRadius) {
        var _this = this;
        if (startDeg === void 0) { startDeg = 0; }
        if (baseRadius === void 0) { baseRadius = this.centerSize; }
        var offsetRadius = menuList.offsetRadius || defaultConstant.offsetRadius;
        var pg = util$1.createSvgElement('g');
        pg.setAttribute('class', 'menu-items');
        var menus = menuList.items;
        var offsetAngle = 0;
        menus.forEach(function (menu) {
            var angle = menu.angle;
            var tempDeg = startDeg + angle + offsetAngle;
            var arcG = (util$1.createSvgElement('g'));
            arcG.__menuData__ = {
                menu: menu,
                angle: angle,
                radius: baseRadius + offsetRadius,
                offsetAngle: startDeg + offsetAngle
            };
            var p = util$1.createSvgElement('path');
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
            p.setAttribute('stroke', 'blue');
            //create text area
            var contentAngle = startDeg + offsetAngle + angle / 2;
            var menuContent = _this.renderMenuContent(menu, contentAngle, baseRadius, offsetRadius);
            arcG.appendChild(p);
            arcG.appendChild(menuContent);
            pg.appendChild(arcG);
            offsetAngle += angle;
        });
        return pg;
    };
    ContextMenu.prototype.render = function () {
        this.renderMenuRoot();
        this.renderMenuCenter();
        var menus = this.menuList.items;
        var angle = this.menuList.angle;
        angle = angle || 2 * Math.PI / menus.length;
        menus.forEach(function (menu) {
            menu.angle = menu.angle || angle;
        });
        var pg = this.renderMenus(this.menuList);
        this.contentEl.appendChild(pg);
        this.bindEvent();
    };
    ContextMenu.prototype.bindEvent = function () {
        var _this = this;
        this.el.addEventListener('click', function (e) {
            var target = e.target;
            while (true) {
                if (target.__menuData__) {
                    _this.menuClick(target);
                    break;
                }
                if (target === _this.el) {
                    break;
                }
                if (target = target.parentElement) {
                }
                else {
                    break;
                }
            }
        });
    };
    ContextMenu.prototype.menuClick = function (target) {
        var selector = '.menu-items';
        var elements = Array.prototype.slice.call(target.parentElement.querySelectorAll(selector));
        elements.forEach(function (el) {
            el.setAttribute('hidden', '');
        });
        var menusElement = target.querySelector(selector);
        if (menusElement) {
            menusElement.removeAttribute('hidden');
        }
        var menuData = target.__menuData__;
        var currentMenu = menuData.menu;
        var menuList = currentMenu.menuList;
        var menus = menuList && menuList.items;
        if (!menus || menus.length === 0) {
            return;
        }
        var angle = menuList.angle || defaultConstant.arcAngle;
        var totalAngle = 0;
        menus.forEach(function (menu) {
            menu.angle = menu.angle || angle;
            totalAngle += menu.angle;
        });
        var startAngle = menuData.offsetAngle - (totalAngle - menuData.angle) / 2;
        var pg = this.renderMenus(currentMenu.menuList, startAngle, menuData.radius);
        target.appendChild(pg);
    };
    return ContextMenu;
}());

exports.ContextMenu = ContextMenu;

Object.defineProperty(exports, '__esModule', { value: true });

})));