import util from './util';
var defaultFontSize = 12;
interface MenuOption{
    name:String;
    caption:String;
    icon?:String;
    fontSize?:number;
    subMenus?:Menu[];
}
class Menu implements MenuOption{
    name:String;
    caption:String;
    subMenus:Menu[] = [];
    fontSize = defaultFontSize;
    constructor(option:MenuOption){
        if(option.subMenus){
            this.subMenus = option.subMenus;
        }
        this.name = option.name;
        this.caption = option.caption;
    }
}
interface ContextMenuConfig{
    centerSize:number;
    circleDistance:number;
}
interface ContextMenuOption{
    el:SVGElement;
    menus:Menu[];
    config?:ContextMenuConfig;
}
interface Point{
    x:number;
    y:number;
}
class ContextMenu implements ContextMenuOption{
    el:SVGElement;
    menus:Menu[];
    config:ContextMenuConfig = {
        centerSize:30,
        circleDistance:80
    };
    private contentEl;
    constructor(option:ContextMenuOption){
        this.menus = option.menus;
        this.initConfig(option.config);
    }
    private initConfig(config:ContextMenuConfig){
        if(!config){
            return;
        }
        Object.keys(config).forEach((key) => {
            var value = config[key];
            if(typeof value !== typeof this.config[key]){
                return;
            }
            this.config[key] = value;
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
        var centerSize = this.config.centerSize;
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
    private renderMenus(menus:Menu[],deg:number,diff?:number){

        if(!diff){
            diff = deg;
        }

        var centerSize = this.config.centerSize;
        var radiusDiff = this.config.circleDistance;

        var pg = util.createSvgElement('g');
        menus.forEach((menu,index) => {

            var tempDeg = deg + index * diff;
            var arcG = <SVGAElement>util.createSvgElement('g');
            arcG.menu = menu;
            arcG.diff = index * diff;
            var p = util.createSvgElement('path');
            var paths = [];
            var pointA = {
                x:Math.cos(tempDeg) * centerSize,
                y:-Math.sin(tempDeg) * centerSize
            };
            paths.push('M' + pointA.x + ' ' + pointA.y);
            var radius = centerSize + radiusDiff;
            var pointB = {
                x:Math.cos(tempDeg) * radius,
                y:-Math.sin(tempDeg) * radius
            };
            paths.push('L' + pointB.x + ' ' + pointB.y);
            tempDeg = deg + (index - 1) * diff;
            var pointC = {
                x:Math.cos(tempDeg) * radius,
                y:-Math.sin(tempDeg) * radius
            };
            paths.push('A' + radius + ' ' + radius + ' 0 0 1 ' + pointC.x + ' ' + pointC.y);
            var pointD = {
                x:Math.cos(tempDeg) * centerSize,
                y:-Math.sin(tempDeg) * centerSize
            };
            paths.push('L' + pointD.x + ' ' + pointD.y);
            paths.push('A' + centerSize + ' ' + centerSize + ' 0 0 0 ' + pointA.x + ' ' + pointA.y);

            p.setAttribute('d',paths.join(''))
            p.setAttribute('stroke','blue');


            //create text area
            tempDeg = index * diff + deg / 2;
            var arcCenterX = (centerSize + radiusDiff/2) * Math.cos(tempDeg) - radiusDiff / 2,
                arcCenterY = -(centerSize + radiusDiff/2) * Math.sin(tempDeg) - radiusDiff / 2;
            var objectEle = util.createSvgElement('foreignObject');
            objectEle.setAttribute('width','' + radiusDiff);
            objectEle.setAttribute('height','' + radiusDiff);
            objectEle.setAttribute('x','' + arcCenterX);
            objectEle.setAttribute('y','' + arcCenterY);

            var fontSize = menu.fontSize || defaultFontSize;
            fontSize = Math.max(Number(fontSize),defaultFontSize);
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
    }
    protected render(){

        this.renderMenuRoot();
        this.renderMenuCenter();

        var deg = 2 * Math.PI / this.menus.length,
            diff = deg;
        var pg = this.renderMenus(this.menus,deg,diff);
        this.contentEl.appendChild(pg);

        this.bindEvent();

    }
    private bindEvent(){
        this.el.addEventListener('click',(e) => {
            var target = <HTMLElement>e.target;
            while(true){
                if(target.menu){
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
        var currentMenu = target.menu;
        var menus = currentMenu.subMenus;
        if(!menus || menus.length === 0){
            return;
        }
        var deg = Math.PI / 3,
            diff = currentMenu.diff;
        var pg = this.renderMenus(menus,deg,diff);
        target.appendChild(pg);
    }
}
export { ContextMenu };