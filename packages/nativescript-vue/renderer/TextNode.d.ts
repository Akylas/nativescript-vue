import ViewNode from './ViewNode';
export default class TextNode extends ViewNode {
    text: string;
    constructor(text: any);
    setText(text: any): void;
}
