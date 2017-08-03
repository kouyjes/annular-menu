interface MenuConfig {
    angle?:number;
    angleStep?:number;
    callback?:Function;
}
interface Menu extends MenuConfig {
    name:String;
    caption:String;
    html?:String;
    icon?:String;
    menuList?:MenuList;
}
interface MenuListData{
    totalAngle?:number;
}
interface MenuList extends MenuConfig {
    items:Menu[];
    radiusStep?:number;
    offsetRadius?:number;
    __data__:MenuListData;
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
interface Size{
    width:number;
    height:number;
}
interface EventListeners {
    click:Function[],
    mouseover:Function[],
    menuClick:Function[],
    menuHover:Function[]
}
interface MenuEvent{
    type:String;
    target:any;
    data?:any;
    native?:Event
}
export { MenuConfig,Menu,MenuList,AnnularMenuOption,Point,Size,EventListeners,MenuEvent }