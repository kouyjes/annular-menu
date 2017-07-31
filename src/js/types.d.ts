declare interface MenuData{
    menu:any;
    angle:number;
    radius:number;
    offsetAngle:number
}
declare interface HTMLElement extends Node{
    src:String;
    moved:boolean;
    addEventListener:Function;
    __menuData__:Object;
}
declare interface SVGElement extends HTMLElement{
}