import {Point} from "./interface";
import {Size} from "./interface";
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
    export function isNumber(value){
        return typeof value === 'number';
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
    export function isEventSupport(eventType:String){
        return 'on' + eventType in document;
    }
    export function getPosition(e:MouseEvent|TouchEvent):Point{
        var touches = e['touches'];
        if(touches && touches.length > 0){
            e = touches[0];
        }
        var evt = <MouseEvent>e;
        var x = evt.clientX || evt.pageX,
            y = evt.clientY || evt.pageY;
        return {
            x:x,
            y:y
        };
    }
    export function sizeOf(el:HTMLElement):Size{
        var size:Size = {
            width:el.clientWidth,
            height:el.clientHeight
        };
        return size;
    }
    export function transform(el:SVGElement,name:String,value:Point,defaultValue:Point){
        var attrName = 'transform';
        var transform = el.getAttribute(attrName) || '';
        var reg = new RegExp('\\b(' + name + ')\\s*\\(\\s*([^()]+)\\s*[,|\\s]\\s*([^()]+)\\s*\\)');
        var _reg = new RegExp('\\b(' + name + ')\\s*\\(\\s*([^()]+)\\s*\\)');
        var _value:Point = {
            x:defaultValue.x,
            y:defaultValue.y
        };
        if (transform) {
            let match = transform.match(reg);
            if(!match){
                match = transform.match(_reg);
                reg = _reg;
            }
            if (match) {
                if(parseFloat(match[2])){
                    _value.x = parseFloat(match[2]);
                }
                if(parseFloat(match[3])){
                    _value.y = parseFloat(match[3]);
                }else{
                    _value.y = _value.x;
                }
            }
        }
        if (value === void 0) {
            return _value;
        }
        if(!value.x){
            value.x = _value.x;
        }
        if(!value.y){
            value.y = _value.y;
        }
        var valueStr = '(' + value.x + ',' + value.y + ')';
        if (!reg.test(transform)) {
            transform += ' ' + name + valueStr;
        } else {
            transform = transform.replace(reg, function (all, name) {
                return name + valueStr;
            });
        }
        el.setAttribute(attrName, transform);
    }
}
export var nextFrame = window.requestAnimationFrame || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFram'] || function(executor){
        return setTimeout(executor,1000/60);
    };
export var cancelFrame = window.cancelAnimationFrame || window['webkitCancelAnimationFrame'] || window['mozCancelAnimationFrame'] || clearTimeout;
export default util;