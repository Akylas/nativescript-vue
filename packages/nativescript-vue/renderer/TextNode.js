"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ViewNode_1 = require("./ViewNode");
class TextNode extends ViewNode_1.default {
    constructor(text) {
        super();
        this.nodeType = 3;
        this.text = text;
        this._meta = {
            skipAddToDom: true
        };
    }
    setText(text) {
        this.text = text;
        this.parentNode.setText(text);
    }
}
exports.default = TextNode;
//# sourceMappingURL=TextNode.js.map