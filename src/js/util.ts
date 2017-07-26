namespace util{
    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: xhtml,
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
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
    export function createSvgElement(qualifiedName){
        var namespaceURI = namespaces.svg;
        return document.createElementNS(namespaceURI,qualifiedName);
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
}
export default util;