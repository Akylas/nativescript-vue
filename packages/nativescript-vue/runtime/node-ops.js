"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocumentNode_1 = require("../renderer/DocumentNode");
const util_1 = require("../util");
const CommentNode_1 = require("../renderer/CommentNode");
exports.CommentNode = CommentNode_1.default;
const ElementNode_1 = require("../renderer/ElementNode");
exports.ElementNode = ElementNode_1.default;
const ViewNode_1 = require("../renderer/ViewNode");
exports.ViewNode = ViewNode_1.default;
const TextNode_1 = require("../renderer/TextNode");
exports.TextNode = TextNode_1.default;
exports.namespaceMap = {};
function createElement(tagName, vnode) {
    util_1.trace(`CreateElement(${tagName})`);
    return DocumentNode_1.default.createElement(tagName);
}
exports.createElement = createElement;
function createElementNS(namespace, tagName) {
    util_1.trace(`CreateElementNS(${namespace}#${tagName})`);
    return DocumentNode_1.default.createElementNS(namespace, tagName);
}
exports.createElementNS = createElementNS;
function createTextNode(text) {
    util_1.trace(`CreateTextNode(${text})`);
    return DocumentNode_1.default.createTextNode(text);
}
exports.createTextNode = createTextNode;
function createComment(text) {
    util_1.trace(`CreateComment(${text})`);
    return DocumentNode_1.default.createComment(text);
}
exports.createComment = createComment;
function insertBefore(parentNode, newNode, referenceNode) {
    util_1.trace(`InsertBefore(${parentNode}, ${newNode}, ${referenceNode})`);
    return parentNode.insertBefore(newNode, referenceNode);
}
exports.insertBefore = insertBefore;
function removeChild(node, child) {
    util_1.trace(`RemoveChild(${node}, ${child})`);
    return node.removeChild(child);
}
exports.removeChild = removeChild;
function appendChild(node, child) {
    util_1.trace(`AppendChild(${node}, ${child})`);
    return node.appendChild(child);
}
exports.appendChild = appendChild;
function parentNode(node) {
    util_1.trace(`ParentNode(${node}) -> ${node.parentNode}`);
    return node.parentNode;
}
exports.parentNode = parentNode;
function nextSibling(node) {
    util_1.trace(`NextSibling(${node}) -> ${node.nextSibling}`);
    return node.nextSibling;
}
exports.nextSibling = nextSibling;
function tagName(elementNode) {
    util_1.trace(`TagName(${elementNode}) -> ${elementNode.tagName}`);
    return elementNode.tagName;
}
exports.tagName = tagName;
function setTextContent(node, text) {
    util_1.trace(`SetTextContent(${node}, ${text})`);
    node.setText(text);
}
exports.setTextContent = setTextContent;
function setAttribute(node, key, val) {
    util_1.trace(`SetAttribute(${node}, ${key}, ${val})`);
    node.setAttribute(key, val);
}
exports.setAttribute = setAttribute;
function setStyleScope(node, scopeId) {
    node.setAttribute(scopeId, '');
}
exports.setStyleScope = setStyleScope;
//# sourceMappingURL=node-ops.js.map