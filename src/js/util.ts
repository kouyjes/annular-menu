namespace util{
    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: xhtml,
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/"
    };
    export function createSvgElement(qualifiedName){
        var namespaceURI = namespaces.svg;
        return document.createElementNS(namespaceURI,qualifiedName);
    }
}
export default util;