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
    export function preAppend(parent:HTMLElement,element:HTMLElement){
        var children = parent.children;
        if(children && children.length > 0){
            parent.insertBefore(element,children[0]);
        }else if(parent.firstChild){
            parent.insertBefore(element,parent.firstChild);
        }else{
            parent.appendChild(element);
        }
    }
    export function toggleVisible(el:HTMLElement,visible?:boolean){
        var className = 'active';
        if(visible === void 0){
            visible = !hasClass(el,className);
        }
        if(visible){
            addClass(el,className);
        }else{
            removeClass(el,className);
        }
    }
    function getClassNames(el:HTMLElement){
        var clazz = el.getAttribute('class') || '';
        var classNames = clazz.split(/\s+/);
        return classNames;
    }
    export function addClass(el:HTMLElement,className:String){
        className = className.trim();
        var classNames = getClassNames(el)
        if(classNames.indexOf(className) >= 0){
            return;
        }
        classNames.push(className);
        el.setAttribute('class',classNames.join(' '));
    }
    export function removeClass(el:HTMLElement,className:String){
        className = className.trim();
        var classNames = getClassNames(el);
        var index = classNames.indexOf(className);
        if(index >= 0){
            classNames.splice(index,1);
        }
        el.setAttribute('class',classNames.join(' '));
    }
    export function hasClass(el:HTMLElement,className:String){
        className = className.trim();
        var classNames = getClassNames(el);
        return classNames.indexOf(className) >= 0;
    }
    export function toggleClass(el:HTMLElement,className:String){
        className = className.trim();
        var classNames = getClassNames(el);
        var index = classNames.indexOf(className);
        if(index >= 0){
            classNames.splice(index,1);
        }else{
            classNames.push(className);
        }
    }
    export function style(el:HTMLElement,name:String|Object,value?:String|number){
        var style = el.style;
        if(isObject(name)){
            Object.keys(name).forEach((key) => {
                if(key in style){
                    style[key] = name[key];
                }
            });
        }else if(isString(name)){
            if(value === undefined){
                return style[name];
            }
            style[name] = <String>value;
        }
    };
    export function parent(target:HTMLElement){
        return target.parentElement || target.parentNode;
    }
    export function isObject(value):boolean{
        return typeof value === 'object' && null != value;
    }
    export function isString(value):boolean{
        return typeof value === 'string';
    }
}
export var nextFrame = window.requestAnimationFrame || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFram'] || function(executor){
        return setTimeout(executor,1000/60);
    };
export var cancelFrame = window.cancelAnimationFrame || window['webkitCancelAnimationFrame'] || window['mozCancelAnimationFrame'] || clearTimeout;
export default util;