"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommentNode_1 = require("./CommentNode");
const ElementNode_1 = require("./ElementNode");
const ViewNode_1 = require("./ViewNode");
const TextNode_1 = require("./TextNode");
class DocumentNode extends ViewNode_1.default {
    constructor() {
        super();
        this.nodeType = 9;
        this.documentElement = new ElementNode_1.default('document');
        this.createComment = DocumentNode.createComment;
        this.createElement = DocumentNode.createElement;
        this.createElementNS = DocumentNode.createElementNS;
        this.createTextNode = DocumentNode.createTextNode;
    }
    static createComment(text) {
        return new CommentNode_1.default(text);
    }
    static createElement(tagName) {
        return new ElementNode_1.default(tagName);
    }
    static createElementNS(namespace, tagName) {
        return new ElementNode_1.default(namespace + ':' + tagName);
    }
    static createTextNode(text) {
        return new TextNode_1.default(text);
    }
}
exports.default = DocumentNode;
//# sourceMappingURL=DocumentNode.js.map