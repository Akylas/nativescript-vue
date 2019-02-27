import CommentNode from './CommentNode';
import ElementNode from './ElementNode';
import ViewNode from './ViewNode';
import TextNode from './TextNode';
export default class DocumentNode extends ViewNode {
    documentElement: ElementNode;
    createComment: any;
    createElement: any;
    createElementNS: any;
    createTextNode: any;
    constructor();
    static createComment(text: any): CommentNode;
    static createElement(tagName: any): ElementNode;
    static createElementNS(namespace: any, tagName: any): ElementNode;
    static createTextNode(text: any): TextNode;
}
