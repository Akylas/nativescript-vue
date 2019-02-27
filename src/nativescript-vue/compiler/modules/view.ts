import { getAndRemoveAttr, addDirective } from 'vue/src/compiler/helpers'

// transforms ~test -> v-view:test
function transformNode(el) {
  const attr = Object.keys(el.attrsMap).find(attr => attr.startsWith('~'))

  if (attr) {
    const attrName = attr.substr(1)
    let [arg, ...modifiers] = attrName.split('.')
    modifiers = modifiers.reduce((mods, mod) => {
      mods[mod] = true
      return mods
    }, {} as any)
    getAndRemoveAttr(el, attr)
    addDirective(el, 'view', `v-view:${attrName}`, '', arg, modifiers as any)
  }
}

export default {
  transformNode
}
