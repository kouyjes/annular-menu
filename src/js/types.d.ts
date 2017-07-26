declare interface MenuData{
    menu:any;
    angle:number;
    radius:number;
    offsetAngle:number
}
declare interface HTMLElement{
    src:String;
    contentPanel:SVGElement;
    addEventListener:Function;
    __menuData__:Object;
}
declare interface SVGElement extends HTMLElement{
}