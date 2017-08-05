declare interface MenuData{
    menu:any;
    radius:number;
    offsetAngle:number
}
declare interface HTMLElement extends Node{
    src:String;
    _parent:HTMLElement;
    _child:HTMLElement;
    moved:boolean;
    addEventListener:Function;
    __menuData__:Object;
}
declare interface SVGElement extends HTMLElement{
}