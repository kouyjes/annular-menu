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

var defaultFontSize = 12;
var ContextMenu = (function () {
    function ContextMenu(option) {
        this.config = {
            centerSize: 30,
            circleDistance: 80
        };
        this.menus = option.menus;
        this.initConfig(option.config);
    }
    ContextMenu.prototype.initConfig = function (config) {
        var _this = this;
        if (!config) {
            return;
        }
        Object.keys(config).forEach(function (key) {
            var value = config[key];
            if (typeof value !== typeof _this.config[key]) {
                return;
            }
            _this.config[key] = value;
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
        var centerSize = this.config.centerSize;
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
    ContextMenu.prototype.renderMenus = function (menus, deg, diff) {
        if (!diff) {
            diff = deg;
        }
        var centerSize = this.config.centerSize;
        var radiusDiff = this.config.circleDistance;
        var pg = util$1.createSvgElement('g');
        menus.forEach(function (menu, index) {
            var tempDeg = deg + index * diff;
            var arcG = util$1.createSvgElement('g');
            arcG.menu = menu;
            arcG.diff = index * diff;
            var p = util$1.createSvgElement('path');
            var paths = [];
            var pointA = {
                x: Math.cos(tempDeg) * centerSize,
                y: -Math.sin(tempDeg) * centerSize
            };
            paths.push('M' + pointA.x + ' ' + pointA.y);
            var radius = centerSize + radiusDiff;
            var pointB = {
                x: Math.cos(tempDeg) * radius,
                y: -Math.sin(tempDeg) * radius
            };
            paths.push('L' + pointB.x + ' ' + pointB.y);
            tempDeg = deg + (index - 1) * diff;
            var pointC = {
                x: Math.cos(tempDeg) * radius,
                y: -Math.sin(tempDeg) * radius
            };
            paths.push('A' + radius + ' ' + radius + ' 0 0 1 ' + pointC.x + ' ' + pointC.y);
            var pointD = {
                x: Math.cos(tempDeg) * centerSize,
                y: -Math.sin(tempDeg) * centerSize
            };
            paths.push('L' + pointD.x + ' ' + pointD.y);
            paths.push('A' + centerSize + ' ' + centerSize + ' 0 0 0 ' + pointA.x + ' ' + pointA.y);
            p.setAttribute('d', paths.join(''));
            p.setAttribute('stroke', 'blue');
            //create text area
            tempDeg = index * diff + deg / 2;
            var arcCenterX = (centerSize + radiusDiff / 2) * Math.cos(tempDeg) - radiusDiff / 2, arcCenterY = -(centerSize + radiusDiff / 2) * Math.sin(tempDeg) - radiusDiff / 2;
            var objectEle = util$1.createSvgElement('foreignObject');
            objectEle.setAttribute('width', '' + radiusDiff);
            objectEle.setAttribute('height', '' + radiusDiff);
            objectEle.setAttribute('x', '' + arcCenterX);
            objectEle.setAttribute('y', '' + arcCenterY);
            var fontSize = menu.fontSize || defaultFontSize;
            fontSize = Math.max(Number(fontSize), defaultFontSize);
            var html = document.createElement('div');
            html.className = 'menu-html';
            var img = document.createElement('img');
            img.src = 'image/icon.png';
            img.className = 'menu-icon';
            img.style.height = (radiusDiff - fontSize) + 'px';
            var text = document.createElement('div');
            text.className = 'menu-text';
            text.innerText = menu.caption;
            text.style.fontSize = fontSize + 'px';
            text.style.height = fontSize + 'px';
            html.appendChild(img);
            html.appendChild(text);
            objectEle.appendChild(html);
            arcG.appendChild(p);
            arcG.appendChild(objectEle);
            pg.appendChild(arcG);
        });
        return pg;
    };
    ContextMenu.prototype.render = function () {
        this.renderMenuRoot();
        this.renderMenuCenter();
        var deg = 2 * Math.PI / this.menus.length, diff = deg;
        var pg = this.renderMenus(this.menus, deg, diff);
        this.contentEl.appendChild(pg);
        this.bindEvent();
    };
    ContextMenu.prototype.bindEvent = function () {
        var _this = this;
        this.el.addEventListener('click', function (e) {
            var target = e.target;
            while (true) {
                if (target.menu) {
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
        var currentMenu = target.menu;
        var menus = currentMenu.subMenus;
        if (!menus || menus.length === 0) {
            return;
        }
        var deg = Math.PI / 3, diff = currentMenu.diff;
        var pg = this.renderMenus(menus, deg, diff);
        this.contentEl.appendChild(pg);
    };
    return ContextMenu;
}());

exports.ContextMenu = ContextMenu;

Object.defineProperty(exports, '__esModule', { value: true });

})));
