import { enter, leave } from '../modules/transition'

// recursively search for possible transition defined inside the component root
function locateNode(vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

export default {
  bind(el, { value }, vnode) {
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    const originalVisibility = (el.__vOriginalVisibility =
      el.getAttribute('visibility') === 'none'
        ? ''
        : el.getAttribute('visibility'))
    if (value && transition) {
      vnode.data.visible = true
      enter(vnode, () => {
        el.setAttribute('visibility', originalVisibility)
      })
    } else {
      el.setAttribute('visibility', value ? originalVisibility : 'hidden')
    }
  },

  update(el, { value, oldValue }, vnode) {
    /* istanbul ignore if */
    if (!value === !oldValue) return
    vnode = locateNode(vnode)
    const transition = vnode.data && vnode.data.transition
    if (transition) {
      vnode.data.visible = true
      if (value) {
        enter(vnode, () => {
          el.setAttribute('visibility', el.__vOriginalVisibility)
        })
      } else {
        leave(vnode, () => {
          el.setAttribute('visibility', 'hidden')
        })
      }
    } else {
      el.setAttribute(
        'visibility',
        value ? el.__vOriginalVisibility : 'hidden'
      )
    }
  },

  unbind(el, binding, vnode, oldVnode, isDestroy) {
    if (!isDestroy) {
      el.setAttribute('visibility', el.__vOriginalVisibility)
    }
  }
}
