declare interface MenuData{
    menu:any;
    angle:number;
    radius:number;
    offsetAngle:number
}
declare interface HTMLElement{
    addEventListener:Function;
    __menuData__:Object;
}
declare interface SVGElement extends HTMLElement{
}