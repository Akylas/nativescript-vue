import ViewNode from './ViewNode';
export declare const VUE_ELEMENT_REF = "__vue_element_ref__";
export default class ElementNode extends ViewNode {
    constructor(tagName: any);
    appendChild(childNode: any): void;
    insertBefore(childNode: any, referenceNode: any): void;
    removeChild(childNode: any): void;
}
