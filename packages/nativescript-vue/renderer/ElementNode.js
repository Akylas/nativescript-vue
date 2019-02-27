"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_registry_1 = require("../element-registry");
const ViewNode_1 = require("./ViewNode");
exports.VUE_ELEMENT_REF = '__vue_element_ref__';
class ElementNode extends ViewNode_1.default {
    constructor(tagName) {
        super();
        this.nodeType = 1;
        this.tagName = tagName;
        const viewClass = element_registry_1.getViewClass(tagName);
        this._nativeView = new viewClass();
        this._nativeView[exports.VUE_ELEMENT_REF] = this;
    }
    appendChild(childNode) {
        super.appendChild(childNode);
        if (childNode.nodeType === 3) {
            this.setText(childNode.text);
        }
    }
    insertBefore(childNode, referenceNode) {
        super.insertBefore(childNode, referenceNode);
        if (childNode.nodeType === 3) {
            this.setText(childNode.text);
        }
    }
    removeChild(childNode) {
        super.removeChild(childNode);
        if (childNode.nodeType === 3) {
            this.setText('');
        }
    }
}
exports.default = ElementNode;
//# sourceMappingURL=ElementNode.js.map