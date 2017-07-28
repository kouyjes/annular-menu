declare interface MenuData{
    menu:any;
    angle:number;
    radius:number;
    offsetAngle:number
}
declare interface HTMLElement{
    src:String;
    addEventListener:Function;
    __menuData__:Object;
}
declare interface SVGElement extends HTMLElement{
}