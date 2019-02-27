import ElementNode from './ElementNode'

export default class CommentNode extends ElementNode {
  text: string
  constructor(text) {
    super('comment')

    this.nodeType = 8
    this.text = text
  }
}
