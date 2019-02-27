"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElementNode_1 = require("./ElementNode");
class CommentNode extends ElementNode_1.default {
    constructor(text) {
        super('comment');
        this.nodeType = 8;
        this.text = text;
    }
}
exports.default = CommentNode;
//# sourceMappingURL=CommentNode.js.map