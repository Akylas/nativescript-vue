"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const set_value_1 = require("set-value");
const element_registry_1 = require("../element-registry");
const viewUtil = require("./utils");
const platform_1 = require("tns-core-modules/platform");
const types = require("tns-core-modules/utils/types");
const xml_1 = require("tns-core-modules/xml");
const XML_ATTRIBUTES = Object.freeze([
    'style',
    'rows',
    'columns',
    'fontAttributes'
]);
class ViewNode {
    constructor() {
        this.nodeType = null;
        this._tagName = null;
        this.parentNode = null;
        this.childNodes = [];
        this.prevSibling = null;
        this.nextSibling = null;
        this._ownerDocument = null;
        this._nativeView = null;
        this._meta = null;
        this.hasAttribute = this.removeAttribute = () => false;
    }
    toString() {
        return `${this.constructor.name}(${this.tagName})`;
    }
    set tagName(name) {
        this._tagName = element_registry_1.normalizeElementName(name);
    }
    get tagName() {
        return this._tagName;
    }
    get firstChild() {
        return this.childNodes.length ? this.childNodes[0] : null;
    }
    get lastChild() {
        return this.childNodes.length
            ? this.childNodes[this.childNodes.length - 1]
            : null;
    }
    get nativeView() {
        return this._nativeView;
    }
    set nativeView(view) {
        if (this._nativeView) {
            throw new Error(`Can't override native view.`);
        }
        this._nativeView = view;
    }
    get meta() {
        if (this._meta) {
            return this._meta;
        }
        return (this._meta = element_registry_1.getViewMeta(this.tagName));
    }
    get ownerDocument() {
        if (this._ownerDocument) {
            return this._ownerDocument;
        }
        let el = this;
        while ((el = el.parentNode).nodeType !== 9) {
        }
        return (this._ownerDocument = el);
    }
    getAttribute(key) {
        return this.nativeView[key];
    }
    setAttribute(key, value) {
        const nv = this.nativeView;
        try {
            if (XML_ATTRIBUTES.indexOf(key) !== -1) {
                nv[key] = value;
            }
            else {
                if (types.isBoolean(nv[key]) && value === '') {
                    value = true;
                }
                if (platform_1.isAndroid && key.startsWith('android:')) {
                    set_value_1.default(nv, key.substr(8), value);
                }
                else if (platform_1.isIOS && key.startsWith('ios:')) {
                    set_value_1.default(nv, key.substr(4), value);
                }
                else if (key.endsWith('.decode')) {
                    set_value_1.default(nv, key.slice(0, -7), xml_1.XmlParser._dereferenceEntities(value));
                }
                else {
                    set_value_1.default(nv, key, value);
                }
            }
        }
        catch (e) {
        }
    }
    setStyle(property, value) {
        if (!(value = value.trim()).length) {
            return;
        }
        if (property.endsWith('Align')) {
            property += 'ment';
        }
        this.nativeView.style[property] = value;
    }
    setText(text) {
        if (this.nodeType === 3) {
            this.parentNode.setText(text);
        }
        else {
            this.setAttribute('text', text);
        }
    }
    addEventListener(event, handler) {
        this.nativeView.on(event, handler);
    }
    removeEventListener(event) {
        this.nativeView.off(event);
    }
    insertBefore(childNode, referenceNode) {
        if (!childNode) {
            throw new Error(`Can't insert child.`);
        }
        if (!referenceNode) {
            return this.appendChild(childNode);
        }
        if (referenceNode.parentNode !== this) {
            throw new Error(`Can't insert child, because the reference node has a different parent.`);
        }
        if (childNode.parentNode && childNode.parentNode !== this) {
            throw new Error(`Can't insert child, because it already has a different parent.`);
        }
        if (childNode.parentNode === this) {
        }
        let index = this.childNodes.indexOf(referenceNode);
        childNode.parentNode = this;
        childNode.nextSibling = referenceNode;
        childNode.prevSibling = this.childNodes[index - 1];
        referenceNode.prevSibling = childNode;
        this.childNodes.splice(index, 0, childNode);
        viewUtil.insertChild(this, childNode, index);
    }
    appendChild(childNode) {
        if (!childNode) {
            throw new Error(`Can't append child.`);
        }
        if (childNode.parentNode && childNode.parentNode !== this) {
            throw new Error(`Can't append child, because it already has a different parent.`);
        }
        if (childNode.parentNode === this) {
        }
        childNode.parentNode = this;
        if (this.lastChild) {
            childNode.prevSibling = this.lastChild;
            this.lastChild.nextSibling = childNode;
        }
        this.childNodes.push(childNode);
        viewUtil.insertChild(this, childNode, this.childNodes.length - 1);
    }
    removeChild(childNode) {
        if (!childNode) {
            throw new Error(`Can't remove child.`);
        }
        if (!childNode.parentNode) {
            throw new Error(`Can't remove child, because it has no parent.`);
        }
        if (childNode.parentNode !== this) {
            throw new Error(`Can't remove child, because it has a different parent.`);
        }
        childNode.parentNode = null;
        if (childNode.prevSibling) {
            childNode.prevSibling.nextSibling = childNode.nextSibling;
        }
        if (childNode.nextSibling) {
            childNode.nextSibling.prevSibling = childNode.prevSibling;
        }
        childNode.prevSibling = null;
        childNode.nextSibling = null;
        this.childNodes = this.childNodes.filter(node => node !== childNode);
        viewUtil.removeChild(this, childNode);
    }
}
exports.default = ViewNode;
//# sourceMappingURL=ViewNode.js.map