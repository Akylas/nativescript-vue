import { normalizeElementName } from '../../element-registry'
import { addAttr } from 'vue/src/compiler/helpers'

function preTransformNode(el) {
  if (el.tag !== 'router-view') return
  if (normalizeElementName(el.parent.tag) === 'nativeframe') {
    addAttr(el.parent, 'hasRouterView', 'true')
  }
}

export default {
  preTransformNode
}
