import util from './util';
var defaultConstant = {
    fontSize:12,
    centerSize:30,
    offsetRadius:80
};
interface MenuOption{
    name:String;
    caption:String;
    icon?:String;
    fontSize?:number;
    menuList?:MenuList;
}
class Menu implements MenuOption{
    name:String;
    caption:String;
    menuList:MenuList = {
        items:[]
    };
    fontSize = defaultConstant.fontSize;
    constructor(option:MenuOption){
        if(option.menuList){
            this.menuList = option.menuList;
        }
        this.name = option.name;
        this.caption = option.caption;
    }
}
interface MenuList{
    items:Menu[];
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
    private renderMenuCenter(){
        var centerSize = this.centerSize;
        var center = util.createSvgElement('circle');
        center.setAttribute('r','' + centerSize);
        center.setAttribute('cx','0');
        center.setAttribute('cy','0');
        center.setAttribute('fill','#ccc');
        this.contentEl.appendChild(center);
    }
    private renderMenuRoot(){
        var svg = util.createSvgElement('svg');
        svg.setAttribute('class','here-ui-menus');
        this.el = <SVGElement>svg;

        var contentEl = util.createSvgElement('g');
        contentEl.setAttribute('class','menu-position')
        this.contentEl = contentEl;
        svg.appendChild(contentEl);
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

        var fontSize = menu.fontSize || defaultConstant.fontSize;
        fontSize = Math.max(Number(fontSize),defaultConstant.fontSize);
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
    }
    private renderMenus(menuList:MenuList,angle:number,startDeg:number = 0,baseRadius:number = this.centerSize){


        var offsetRadius = menuList.offsetRadius || defaultConstant.offsetRadius;

        var pg = util.createSvgElement('g');
        var menus = menuList.items;
        menus.forEach((menu,index) => {

            var tempDeg = startDeg + angle + index * angle;
            var arcG = <SVGElement>(util.createSvgElement('g'));
            arcG.__menuData__ = {
                menu:menu,
                angle:angle,
                radius:baseRadius + offsetRadius,
                offsetAngle:startDeg + index * angle
            };
            var p = util.createSvgElement('path');
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
            tempDeg = startDeg + angle + (index - 1) * angle;
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
            p.setAttribute('stroke','blue');


            //create text area
            var contentAngle = startDeg + index * angle + angle / 2;
            var menuContent = this.renderMenuContent(menu,contentAngle,baseRadius,offsetRadius)

            arcG.appendChild(p);
            arcG.appendChild(menuContent);
            pg.appendChild(arcG);
        });

        return pg;
    }
    protected render(){

        this.renderMenuRoot();
        this.renderMenuCenter();

        var menus = this.menuList.items;
        var angle = 2 * Math.PI / menus.length;
        var pg = this.renderMenus(this.menuList,angle);
        this.contentEl.appendChild(pg);

        this.bindEvent();

    }
    private bindEvent(){
        this.el.addEventListener('click',(e) => {
            var target = <HTMLElement>e.target;
            while(true){
                if(target.__menuData__){
                    this.menuClick(target);
                    break;
                }
                if(target === this.el){
                    break;
                }
                if(target = target.parentElement){
                }else{
                    break;
                }
            }
        });
    }
    private menuClick(target:HTMLElement){
        var menuData = target.__menuData__;
        var currentMenu = menuData.menu;
        var menus = currentMenu.menuList && currentMenu.menuList.items;
        if(!menus || menus.length === 0){
            return;
        }
        var angle = Math.PI / 3;

        var totalAngle = angle * menus.length;
        var startAngle = menuData.offsetAngle - (Math.abs(totalAngle) - Math.abs(menuData.angle)) / 2;

        var pg = this.renderMenus(currentMenu.menuList,angle,startAngle,menuData.radius);
        target.appendChild(pg);
    }
}
export { ContextMenu };