interface MenuConfig {
    angle?:number;
    callback?:Function;
}
interface Menu extends MenuConfig {
    name:String;
    caption:String;
    html?:String;
    icon?:String;
    menuList?:MenuList;
}
interface MenuList extends MenuConfig {
    items:Menu[];
    radiusStep?:number;
    offsetRadius?:number;
}
interface AnnularMenuOption {
    menuList:MenuList;
    centerSize?:number;
    collapsible?:boolean;
    draggable?:boolean;
}
interface Point {
    x:number;
    y:number;
}
interface EventListeners {
    click:Function[],
    mouseover:Function[],
    menuClick:Function[],
    menuHover:Function[]
}
export { MenuConfig,Menu,MenuList,AnnularMenuOption,Point,EventListeners }