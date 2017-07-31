import util from './util';
import { nextFrame,cancelFrame } from './util';
import { MenuConfig,Menu,MenuList,AnnularMenuOption,Point,EventListeners } from './interface';
import { defaultConstant,classNames } from './config';
class AnnularMenu implements AnnularMenuOption {
    element:SVGElement;
    menuList:MenuList = {
        items: []
    };
    collapsible:boolean = true;
    draggable:boolean = true;
    centerSize = defaultConstant.centerSize;
    private listeners:EventListeners = {
        click: [],
        mouseover: [],
        menuClick: [],
        menuHover: []
    };
    private contentEl;

    constructor(option:AnnularMenuOption) {
        this.assignOption(option);
    }

    private assignOption(option:AnnularMenuOption) {
        if (!option) {
            return;
        }
        Object.keys(option).forEach((key) => {
            var value = option[key];
            if (typeof value === typeof this[key]) {
                this[key] = value;
            }
        });
    }

    /**
     * render menu center
     */
    private _renderMenuCenter() {
        var centerSize = this.centerSize;
        var center = util.createSvgElement('circle');
        util.addClass(center,classNames.center);
        center.setAttribute('r', '' + centerSize);
        center.setAttribute('cx', '0');
        center.setAttribute('cy', '0');
        return center;
    }

    private _renderContentEl() {
        var contentEl = util.createSvgElement('g');
        util.addClass(contentEl,classNames.position);
        return contentEl;
    }

    private _renderRootEl() {
        var svg = util.createSvgElement('svg');
        util.addClass(svg,classNames.root);
        util.toggleVisible(svg,true);
        return svg;
    }

    private renderMenuContent(menu:Menu, offsetAngle:number, baseRadius:number, offsetRadius:number) {

        var tempDeg = offsetAngle;
        var arcCenterX = (baseRadius + offsetRadius / 2) * Math.cos(tempDeg) - offsetRadius / 2,
            arcCenterY = -(baseRadius + offsetRadius / 2) * Math.sin(tempDeg) - offsetRadius / 2;
        var objectEle = util.createSvgElement('foreignObject');
        objectEle.setAttribute('width', '' + offsetRadius);
        objectEle.setAttribute('height', '' + offsetRadius);
        objectEle.setAttribute('x', '' + arcCenterX);
        objectEle.setAttribute('y', '' + arcCenterY);


        var html = util.createElement('div');
        html.className = classNames.menuContent;
        objectEle.appendChild(html);

        if (menu.html) {
            html.innerHTML = menu.html;
        } else {
            let icon, img;
            if (menu.icon) {
                icon = util.createElement('div');
                icon.className = classNames.menuIcon;

                img = util.createElement('img');
                img.src = menu.icon;
                icon.appendChild(img);
                html.appendChild(icon);
            }

            let text = util.createElement('div');
            text.className = classNames.menuText;
            text.innerText = menu.caption;

            html.appendChild(text);
        }

        return objectEle;
    }

    private renderMenus(menuList:MenuList, startDeg:number = 0, baseRadius:number = this.centerSize) {


        var offsetRadius = util.valueOf(menuList.offsetRadius, defaultConstant.offsetRadius);
        var radiusStep = util.valueOf(menuList.radiusStep, defaultConstant.radiusStep);

        baseRadius += radiusStep;

        var pg = util.createSvgElement('g');
        util.addClass(pg,classNames.menuItems);
        var menus = menuList.items;
        var offsetAngle = 0;
        menus.forEach((menu) => {

            var angle = menu.angle;
            var tempDeg = startDeg + angle + offsetAngle;
            var arcG = <SVGElement>(util.createSvgElement('g'));
            util.addClass(arcG,classNames.menuPathGroup);
            arcG.__menuData__ = {
                menu: menu,
                angle: angle,
                radius: baseRadius + offsetRadius,
                offsetAngle: startDeg + offsetAngle
            };
            var p = util.createSvgElement('path');
            util.addClass(p,classNames.menuPath);
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

            p.setAttribute('d', paths.join(''))


            //create text area
            var contentAngle = startDeg + offsetAngle + angle / 2;
            var menuContent = this.renderMenuContent(menu, contentAngle, baseRadius, offsetRadius);

            arcG.appendChild(p);
            arcG.appendChild(menuContent);

            if (util.isFunction(menu.callback)) {
                menu.callback.call(undefined, arcG);
            }
            pg.appendChild(arcG);

            offsetAngle += angle;
        });

        if (util.isFunction(menuList.callback)) {
            menuList.callback.call(undefined, pg);
        }

        return pg;
    }

    render(position?:Point):SVGElement {

        var rootEl = this._renderRootEl(),
            contentEl = this._renderContentEl(),
            menuCenter = this._renderMenuCenter();

        contentEl.appendChild(menuCenter);
        rootEl.appendChild(contentEl);

        this.element = rootEl;
        this.contentEl = contentEl;

        if(position){
            this.position(position);
        }

        var menuList = this.menuList;
        var menus = menuList && menuList.items;
        if (!menus || menus.length === 0) {
            return;
        }
        var angle = menuList.angle;
        angle = angle || 2 * Math.PI / menus.length;
        menus.forEach((menu:Menu) => {
            menu.angle = menu.angle || angle;
        });
        var pg = this.renderMenus(this.menuList);
        util.preAppend(contentEl, pg);

        this.bindEvent();

        return this.element;

    }

    position(pointX?:Point|number, pointY?:number) {
        var attrName = 'transform';
        var transform = this.contentEl.getAttribute(attrName) || '';
        var translateReg = /\b(translate)\s*\(\s*([^()]+)\s*[,|\s]\s*([^()]+)\s*\)/;

        var _position:Point = {
            x: 0,
            y: 0
        };
        if (transform) {
            let match = transform.match(translateReg);
            if (match) {
                _position.x = parseFloat(match[2]) || 0;
                _position.y = parseFloat(match[3]) || 0;
            }
        }
        if (pointX === void 0) {
            return _position;
        }
        var point:Point;
        if (util.isObject(pointX)) {
            point = <Point>pointX;
            if (pointY !== void 0) {
                point.y = pointY;
            }
        } else {
            point = {
                x: <number>pointX,
                y: pointY
            };
        }
        point.x = point.x === void 0 ? _position.x : point.x;
        point.y = point.y === void 0 ? _position.y : point.y;
        var posStr = '(' + point.x + ',' + point.y + ')';
        if (!translateReg.test(transform)) {
            transform += ' translate' + posStr;
        } else {
            transform = transform.replace(translateReg, function (all, name) {
                return name + posStr;
            });
        }
        this.contentEl.setAttribute(attrName, transform);
    }

    toggleCollapse(collapse?:boolean) {

        var className = 'collapse';

        if (collapse === void 0) {
            collapse = !util.hasClass(this.contentEl,className);
        }
        if (collapse) {
            util.addClass(this.contentEl,className);
            this.collapseAllSubMenus();
        } else {
            util.removeClass(this.contentEl,className);
        }

    }
    toggleVisible(visible?:boolean){
        util.toggleVisible(this.element,visible);
    }
    private _findMenuTarget(target:HTMLElement) {
        while (true) {
            if (target.__menuData__) {
                return target;
            }
            if (target === this.element) {
                break;
            }
            if (target = util.parent(target)) {
            } else {
                break;
            }
        }
        return null;
    }

    private bindEvent() {

        // bind collapse event
        if (this.collapsible) {
            this.bindCollapseEvent();
        }

        if (this.draggable) {
            this.bindDragEvent();
        }

        // bind mouse over event
        this.bindHoverEvent();

    }

    protected bindDragEvent() {
        var events;
        var circleEl = this.contentEl.querySelector(this._selector(classNames.center));
        var className = 'event-source';
        var startPoint:Point,startPos:Point = null;
        var mouseDown = (e) => {
            util.addClass(this.element,className);
            startPoint = util.getPosition(e);;
            startPos = this.position();
        };
        var mouseMove = (e) => {
            if(!startPoint){
                return;
            }
            var curPoint = util.getPosition(e);

            var pos = {
                x:curPoint.x - startPoint.x + startPos.x,
                y:curPoint.y - startPoint.y + startPos.y
            };
            var size = util.sizeOf(this.element),
                circleElSize = util.sizeOf(circleEl);
            pos.x = Math.max(circleElSize.width / 2,pos.x);
            pos.x = Math.min(pos.x,size.width - circleElSize.width / 2);
            pos.y = Math.max(circleElSize.height / 2,pos.y);
            pos.y = Math.min(pos.y,size.height - circleElSize.height / 2);
            this.position(pos);
            e.stopPropagation();
        };
        var mouseUp = (e) => {
            util.removeClass(this.element,className);
            var curPoint = util.getPosition(e);
            if(startPoint && Math.pow(curPoint.x - startPoint.x,2) + Math.pow(curPoint.y - startPoint.y,2) > Math.pow(5,2)){
                circleEl.moved = true;
            }else{
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
        events.some((eventItem) => {
            eventItem.types.some((type) => {
                if(util.isEventSupport(type)){
                    eventItem.el.addEventListener(type, eventItem.handler);
                    return true;
                }
            });
        });
    }

    protected bindCollapseEvent() {
        var circleEl:HTMLElement = this.contentEl.querySelector(this._selector(classNames.center));
        circleEl.addEventListener('click', (e) => {
            !circleEl.moved && this.toggleCollapse();
            e.stopPropagation();
        });
    }

    protected bindHoverEvent() {
        var currentMenuEl, subMenuRenderTimeout;
        var renderSubMenus = (menuTarget) => {
            if (currentMenuEl === menuTarget) {
                return;
            }
            subMenuRenderTimeout && cancelFrame(subMenuRenderTimeout);
            subMenuRenderTimeout = nextFrame(() => {
                currentMenuEl = menuTarget;
                this.renderSubMenus(menuTarget);
            });
        }


        ['mouseover', 'click'].forEach((evtType) => {
            this.element.addEventListener(evtType, (e) => {
                var target = <HTMLElement>e.target;
                var menuTarget = this._findMenuTarget(target);
                renderSubMenus(menuTarget);

                if (menuTarget) {
                    let menu = menuTarget.__menuData__.menu;
                    if (e.type === 'click') {
                        this.listeners.menuClick.forEach((handler) => {
                            handler.call(this, e,menu);
                        })
                    } else {
                        this.listeners.menuHover.forEach((handler) => {
                            handler.call(this, e,menu);
                        })
                    }
                }

                this.listeners[evtType].forEach((handler) => {
                    handler.call(this, e);
                });

            });
        });

    }

    addEventListener(type:String, handler:Function) {
        var listeners:Function[] = this.listeners[type];
        if(!listeners){
            return;
        }
        var index = listeners.indexOf(handler);
        if (index === -1 && handler) {
            listeners.push(handler);
        }
    }

    removeEventListener(type:String, handler:Function) {
        var listeners:Function[] = this.listeners[type];
        if(!listeners){
            return;
        }
        var index = listeners.indexOf(handler);
        if (index >= 0) {
            listeners.splice(index, 1);
        }
    }

    private _findMenuTargetPath(target:HTMLElement) {
        var pathElements = [];
        while (target && target !== this.element) {
            if (target.__menuData__) {
                pathElements.unshift(target);
            }
            target = util.parent(target)
        }
        return pathElements;
    }

    private _className(className:String, prefix?:String) {
        if (!prefix) {
            return className;
        }
        return prefix + '-' + className;
    }

    private _selector(className:String, prefix?:String) {
        className = this._className(className, prefix);
        return '.' + className;
    }

    getAllMenuEl() {
        var selector = this._selector(classNames.menuPathGroup);
        var slice = Array.prototype.slice;
        return slice.call(this.element.querySelectorAll(selector));
    }

    private collapseAllSubMenus() {
        this.getAllMenuEl().forEach((el) => {
            util.toggleVisible(el, false);
        });
    }

    private renderSubMenus(target:HTMLElement, visible:boolean = true) {


        this.collapseAllSubMenus();

        if (!target) {
            return;
        }

        var menusElSelector = this._selector(classNames.menuItems);
        var pathElements = this._findMenuTargetPath(target);
        pathElements.forEach((el, index) => {
            if (!visible && index === pathElements.length - 1) {
                return;
            }
            util.toggleVisible(el, true);
        });

        var menuGroupEl:HTMLElement = <HTMLElement>target.querySelector(menusElSelector);
        if (!menuGroupEl) {
            let menuData = <MenuData>target.__menuData__;
            let currentMenu = menuData.menu;
            let menuList = currentMenu.menuList;
            let menus = menuList && menuList.items;
            if (!menus || menus.length === 0) {
                return;
            }
            let angle = menuList.angle || currentMenu.angle || defaultConstant.arcAngle;
            let totalAngle = 0;
            menus.forEach((menu:Menu) => {
                menu.angle = menu.angle || angle;
                totalAngle += menu.angle;
            });
            var startAngle = menuData.offsetAngle - (totalAngle - menuData.angle) / 2;

            menuGroupEl = this.renderMenus(currentMenu.menuList, startAngle, menuData.radius);
            util.preAppend(target, menuGroupEl);
        }

        if (menuGroupEl) {
            util.toggleVisible(menuGroupEl, true);
        }

    }
}
export { AnnularMenu };