import util from './util';
var defaultConstant = {
    centerSize:30,
    radiusStep:0,
    offsetRadius:80,
    arcAngle:Math.PI / 3
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
interface ContextMenuOption{
    el:SVGElement;
    menuList:MenuList;
    centerSize?:number;
}
interface Point{
    x:number;
    y:number;
}
class ContextMenu implements ContextMenuOption{
    el:SVGElement;
    menuList:MenuList = {
        items:[]
    };
    centerSize = defaultConstant.centerSize;
    private contentEl;
    constructor(option:ContextMenuOption){
        this.assignOption(option);
    }
    private assignOption(option:ContextMenuOption){
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
    show(position:Point,parent?:HTMLElement){
        parent = parent || document.body;
        if(!this.el){
            this.render();
            parent.appendChild(this.el);
        }
        this.contentEl.setAttribute('transform','translate(' + position.x + ',' + position.y + ')');

    }

    /**
     * render menu center
     */
    private _renderMenuCenter(){
        var centerSize = this.centerSize;
        var center = util.createSvgElement('circle');
        center.setAttribute('class','menu-center');
        center.setAttribute('r','' + centerSize);
        center.setAttribute('cx','0');
        center.setAttribute('cy','0');
        return center;
    }
    private _renderContentEl(){
        var contentEl = util.createSvgElement('g');
        contentEl.setAttribute('class','menu-position')
        return contentEl;
    }
    private _renderRootEl(){
        var svg = util.createSvgElement('svg');
        svg.setAttribute('class','here-ui-menus');
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
        html.className = 'menu-panel';
        objectEle.appendChild(html);

        if(menu.html){
            html.innerHTML = menu.html;
        }else{
            let icon,img;
            if(menu.icon){
                icon = util.createElement('div');
                icon.className = 'menu-icon';

                img = util.createElement('img');
                img.src = menu.icon;
                icon.appendChild(img);
                html.appendChild(icon);
            }

            let text = util.createElement('div');
            text.className = 'menu-text';
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
        pg.setAttribute('class','menu-items');
        var menus = menuList.items;
        var offsetAngle = 0;
        menus.forEach((menu) => {

            var angle = menu.angle;
            var tempDeg = startDeg + angle + offsetAngle;
            var arcG = <SVGElement>(util.createSvgElement('g'));
            arcG.setAttribute('class','menu-path-g');
            arcG.__menuData__ = {
                menu:menu,
                angle:angle,
                radius:baseRadius + offsetRadius,
                offsetAngle:startDeg + offsetAngle
            };
            var p = util.createSvgElement('path');
            p.setAttribute('class','menu-path');
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
    protected render(){

        var rootEl = this._renderRootEl(),
            contentEl = this._renderContentEl(),
            menuCenter = this._renderMenuCenter();

        contentEl.appendChild(menuCenter);
        rootEl.appendChild(contentEl);

        this.el = rootEl;
        this.contentEl = contentEl;

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

    }
    private _findMenuTarget(target:HTMLElement){
        while(true){
            if(target.__menuData__){
                return target;
            }
            if(target === this.el){
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
        this.el.addEventListener('mouseover',(e) => {
            var target = <HTMLElement>e.target;
            var menuTarget = this._findMenuTarget(target);
            if(menuTarget){
                this.renderMenu(menuTarget);
            }
        });

    }
    private _findMenuTargetPath(target:HTMLElement){
        var className = 'menu-items';
        var pathElements = [];
        while((target = util.parent(target)) && target !== this.el){
            let classNames = (target.getAttribute('class') || '').split(/\s+/);
            if(classNames.indexOf(className) >= 0){
                pathElements.unshift(target);
            }
        }
        return pathElements;
    }
    getAllMenuElements(){
        var selector = '.menu-items';
        var slice = Array.prototype.slice;
        return slice.call(this.el.querySelectorAll(selector));
    }
    private renderMenu(target:HTMLElement, visible:boolean = true){

        var pathElements = this._findMenuTargetPath(target);
        this.getAllMenuElements().forEach((el) => {
            var existIndex = pathElements.indexOf(el);
            if(existIndex >= 0){
                util.toggleVisible(el,true);
                pathElements.splice(existIndex,1);
                return;
            }
            util.toggleVisible(el,false);
        });
        pathElements.forEach((el,index) => {
            if(!visible && index === pathElements.length - 1){
                return;
            }
            util.toggleVisible(el,true);
        });

        if(target.querySelector('.menu-items')){
            return;
        }

        var menuData = <MenuData>target.__menuData__;
        var currentMenu = menuData.menu;
        var menuList = currentMenu.menuList;
        var menus = menuList && menuList.items;
        if(!menus || menus.length === 0){
            return;
        }
        var angle = menuList.angle || defaultConstant.arcAngle;
        var totalAngle = 0;
        menus.forEach((menu:Menu) => {
            menu.angle = menu.angle || angle;
            totalAngle += menu.angle;
        });
        var startAngle = menuData.offsetAngle - (totalAngle - menuData.angle) / 2;

        var pg = this.renderMenus(currentMenu.menuList,startAngle,menuData.radius);
        util.preAppend(target,pg);
    }
}
export { ContextMenu };