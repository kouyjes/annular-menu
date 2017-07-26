namespace util{
    
    export var namespaces = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: 'http://www.w3.org/1999/xhtml',
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/'
    };
    export function isDefined(value){
        return value !== undefined;
    }
    export function valueOf(value,defaultValue = value){
        return isDefined(value) ? value : defaultValue;
    }
    export function isFunction(fn){
        return typeof fn === 'function';
    }
    export function createSvgElement(qualifiedName):SVGElement{
        var namespaceURI = namespaces.svg;
        return <SVGElement>document.createElementNS(namespaceURI,qualifiedName);
    }
    export function createElement(qualifiedName):HTMLElement{
        var el = <HTMLElement>document.createElement(qualifiedName);
        return el;
    }
    export function style(el:HTMLElement,name:String|Object,value?:String|number){
        var style = el.style;
        if(typeof name === 'object'){
            Object.keys(name).forEach((key) => {
                if(key in style){
                    style[key] = name[key];
                }
            });
        }else if(typeof name === 'string'){
            if(value === undefined){
                return style[name];
            }
            style[name] = value;
        }
    };
    export function parent(target:HTMLElement){
        return target.parentElement || target.parentNode;
    }
}
export default util;