import util from './util';
var defaultConstant = {
    centerSize:30,
    radiusStep:0,
    offsetRadius:80,
    arcAngle:Math.PI / 3
};
var classNames = {
    root:'here-ui-annular-menu',
    position:'menu-position',
    center:'menu-center',
    menuPathGroup:'menu-path-g',
    menuPath:'menu-path',
    menuContent:'menu-content',
    menuIcon:'menu-icon',
    menuText:'menu-text',
    menuItems:'menu-items'
};
interface MenuConfig{
    angle?:number;
    callback?:Function;
}
interface Menu extends MenuConfig{
    name:String;
    caption:String;
    html?:String;
    icon?:String;
    menuList?:MenuList;
}
interface MenuList extends MenuConfig{
    items:Menu[];
    radiusStep?:number;
    offsetRadius?:number;
}
interface AnnularMenuOption{
    menuList:MenuList;
    centerSize?:number;
    collapsible?:boolean;
    draggable?:boolean;
}
interface Point{
    x:number;
    y:number;
}
class AnnularMenu implements AnnularMenuOption{
    _el:SVGElement;
    menuList:MenuList = {
        items:[]
    };
    collapsible:boolean = true;
    draggable:boolean = true;
    centerSize = defaultConstant.centerSize;
    private contentEl;
    constructor(option:AnnularMenuOption){
        this.assignOption(option);
    }
    private assignOption(option:AnnularMenuOption){
        if(!option){
            return;
        }
        Object.keys(option).forEach((key) => {
            var value = option[key];
            if(typeof value === typeof this[key]){
                this[key] = value;
            }
        });
    }

    /**
     * render menu center
     */
    private _renderMenuCenter(){
        var centerSize = this.centerSize;
        var center = util.createSvgElement('circle');
        center.setAttribute('class',classNames.center);
        center.setAttribute('r','' + centerSize);
        center.setAttribute('cx','0');
        center.setAttribute('cy','0');
        return center;
    }
    private _renderContentEl(){
        var contentEl = util.createSvgElement('g');
        contentEl.setAttribute('class',classNames.position)
        return contentEl;
    }
    private _renderRootEl(){
        var svg = util.createSvgElement('svg');
        svg.setAttribute('class',classNames.root);
        return svg;
    }
    private renderMenuContent(menu:Menu,offsetAngle:number,baseRadius:number,offsetRadius:number){

        var tempDeg = offsetAngle;
        var arcCenterX = (baseRadius + offsetRadius/2) * Math.cos(tempDeg) - offsetRadius / 2,
            arcCenterY = -(baseRadius + offsetRadius/2) * Math.sin(tempDeg) - offsetRadius / 2;
        var objectEle = util.createSvgElement('foreignObject');
        objectEle.setAttribute('width','' + offsetRadius);
        objectEle.setAttribute('height','' + offsetRadius);
        objectEle.setAttribute('x','' + arcCenterX);
        objectEle.setAttribute('y','' + arcCenterY);


        var html = util.createElement('div');
        html.className = classNames.menuContent;
        objectEle.appendChild(html);

        if(menu.html){
            html.innerHTML = menu.html;
        }else{
            let icon,img;
            if(menu.icon){
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
    private renderMenus(menuList:MenuList,startDeg:number = 0,baseRadius:number = this.centerSize){


        var offsetRadius = util.valueOf(menuList.offsetRadius,defaultConstant.offsetRadius);
        var radiusStep = util.valueOf(menuList.radiusStep,defaultConstant.radiusStep);

        baseRadius += radiusStep;

        var pg = util.createSvgElement('g');
        pg.setAttribute('class',classNames.menuItems);
        var menus = menuList.items;
        var offsetAngle = 0;
        menus.forEach((menu) => {

            var angle = menu.angle;
            var tempDeg = startDeg + angle + offsetAngle;
            var arcG = <SVGElement>(util.createSvgElement('g'));
            arcG.setAttribute('class',classNames.menuPathGroup);
            arcG.__menuData__ = {
                menu:menu,
                angle:angle,
                radius:baseRadius + offsetRadius,
                offsetAngle:startDeg + offsetAngle
            };
            var p = util.createSvgElement('path');
            p.setAttribute('class',classNames.menuPath);
            var paths = [];
            var pointA = {
                x:Math.cos(tempDeg) * baseRadius,
                y:-Math.sin(tempDeg) * baseRadius
            };
            paths.push('M' + pointA.x + ' ' + pointA.y);
            var radius = baseRadius + offsetRadius;
            var pointB = {
                x:Math.cos(tempDeg) * radius,
                y:-Math.sin(tempDeg) * radius
            };
            paths.push('L' + pointB.x + ' ' + pointB.y);
            tempDeg = startDeg + offsetAngle;
            var pointC = {
                x:Math.cos(tempDeg) * radius,
                y:-Math.sin(tempDeg) * radius
            };
            paths.push('A' + radius + ' ' + radius + ' 0 0 1 ' + pointC.x + ' ' + pointC.y);
            var pointD = {
                x:Math.cos(tempDeg) * baseRadius,
                y:-Math.sin(tempDeg) * baseRadius
            };
            paths.push('L' + pointD.x + ' ' + pointD.y);
            paths.push('A' + baseRadius + ' ' + baseRadius + ' 0 0 0 ' + pointA.x + ' ' + pointA.y);

            p.setAttribute('d',paths.join(''))


            //create text area
            var contentAngle = startDeg + offsetAngle + angle / 2;
            var menuContent = this.renderMenuContent(menu,contentAngle,baseRadius,offsetRadius);

            arcG.appendChild(p);
            arcG.appendChild(menuContent);

            if(util.isFunction(menu.callback)){
                menu.callback.call(undefined,arcG);
            }
            pg.appendChild(arcG);

            offsetAngle += angle;
        });

        if(util.isFunction(menuList.callback)){
            menuList.callback.call(undefined,pg);
        }

        return pg;
    }
    protected render(position:Point):SVGElement{

        var rootEl = this._renderRootEl(),
            contentEl = this._renderContentEl(),
            menuCenter = this._renderMenuCenter();

        contentEl.appendChild(menuCenter);
        rootEl.appendChild(contentEl);

        this._el = rootEl;
        this.contentEl = contentEl;
        this.contentEl.setAttribute('transform','translate(' + position.x + ',' + position.y + ')');

        var menuList = this.menuList;
        var menus = menuList && menuList.items;
        if(!menus || menus.length === 0){
            return;
        }
        var angle = menuList.angle;
        angle = angle || 2 * Math.PI / menus.length;
        menus.forEach((menu:Menu) => {
            menu.angle = menu.angle || angle;
        });
        var pg = this.renderMenus(this.menuList);
        util.preAppend(contentEl,pg);

        this.bindEvent();

        return this._el;

    }
    toggleCollapse(collapse?:boolean){

        if(collapse === void 0){
            collapse = !this.contentEl.hasAttribute('collapse');
        }
        if(collapse){
            this.contentEl.setAttribute('collapse','');
            this.collapseAllSubMenus();
        }else{
            this.contentEl.removeAttribute('collapse');
        }

    }
    private _findMenuTarget(target:HTMLElement){
        while(true){
            if(target.__menuData__){
                return target;
            }
            if(target === this._el){
                break;
            }
            if(target = util.parent(target)){
            }else{
                break;
            }
        }
        return null;
    }
    private bindEvent(){

        // bind collapse event
        if(this.collapsible){
            this.bindCollapseEvent();
        }

        if(this.draggable){
            this.bindDragEvent();
        }

        // bind mouse over event
       this.bindHoverEvent();

    }
    protected bindDragEvent(){

    }
    protected bindCollapseEvent(){
        var circleEl = this.contentEl.querySelector(this._selector(classNames.center));
        circleEl.addEventListener('click', () => {
            this.toggleCollapse();
        });
    }
    protected bindHoverEvent(){
        var currentMenuEl,subMenuRenderTimeout;
        var renderSubMenus = (menuTarget) => {
            if(currentMenuEl === menuTarget){
                return;
            }
            subMenuRenderTimeout && clearTimeout(subMenuRenderTimeout);
            subMenuRenderTimeout = setTimeout(() => {
                currentMenuEl = menuTarget;
                this.renderSubMenus(menuTarget);
            },30);
        }
        this._el.addEventListener('mouseover',(e) => {
            var target = <HTMLElement>e.target;
            var menuTarget = this._findMenuTarget(target);
            renderSubMenus(menuTarget);
        });
    }
    private _findMenuTargetPath(target:HTMLElement){
        var pathElements = [];
        while(target && target !== this._el){
            if(target.__menuData__){
                pathElements.unshift(target);
            }
            target = util.parent(target)
        }
        return pathElements;
    }
    private _className(className:String,prefix?:String){
        if(!prefix){
            return className;
        }
        return prefix + '-' + className;
    }
    private _selector(className:String,prefix?:String){
        className = this._className(className,prefix);
        return '.' + className;
    }
    getAllMenuEl(){
        var selector = this._selector(classNames.menuPathGroup);
        var slice = Array.prototype.slice;
        return slice.call(this._el.querySelectorAll(selector));
    }
    private collapseAllSubMenus(){
        this.getAllMenuEl().forEach((el) => {
            util.toggleVisible(el,false);
        });
    }
    private renderSubMenus(target:HTMLElement, visible:boolean = true){


        this.collapseAllSubMenus();

        if(!target){
            return;
        }

        var menusElSelector = this._selector(classNames.menuItems);
        var pathElements = this._findMenuTargetPath(target);
        pathElements.forEach((el,index) => {
            if(!visible && index === pathElements.length - 1){
                return;
            }
            util.toggleVisible(el,true);
        });

        var menuGroupEl:HTMLElement = <HTMLElement>target.querySelector(menusElSelector);
        if(!menuGroupEl){
            let menuData = <MenuData>target.__menuData__;
            let currentMenu = menuData.menu;
            let menuList = currentMenu.menuList;
            let menus = menuList && menuList.items;
            if(!menus || menus.length === 0){
                return;
            }
            let angle = menuList.angle || currentMenu.angle || defaultConstant.arcAngle;
            let totalAngle = 0;
            menus.forEach((menu:Menu) => {
                menu.angle = menu.angle || angle;
                totalAngle += menu.angle;
            });
            var startAngle = menuData.offsetAngle - (totalAngle - menuData.angle) / 2;

            menuGroupEl = this.renderMenus(currentMenu.menuList,startAngle,menuData.radius);
            util.preAppend(target,menuGroupEl);
        }

        if(menuGroupEl){
            util.toggleVisible(menuGroupEl,true);
        }

    }
}
export { AnnularMenu };