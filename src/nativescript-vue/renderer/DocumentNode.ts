import CommentNode from './CommentNode'
import ElementNode from './ElementNode'
import ViewNode from './ViewNode'
import TextNode from './TextNode'

export default class DocumentNode extends ViewNode {
  documentElement: ElementNode
  createComment
  createElement
  createElementNS
  createTextNode
  constructor() {
    super()

    this.nodeType = 9
    this.documentElement = new ElementNode('document')

    // make static methods accessible via this
    this.createComment = DocumentNode.createComment
    this.createElement = DocumentNode.createElement
    this.createElementNS = DocumentNode.createElementNS
    this.createTextNode = DocumentNode.createTextNode
  }

  static createComment(text) {
    return new CommentNode(text)
  }

  static createElement(tagName) {
    return new ElementNode(tagName)
  }

  static createElementNS(namespace, tagName) {
    return new ElementNode(namespace + ':' + tagName)
  }

  static createTextNode(text) {
    return new TextNode(text)
  }
}
