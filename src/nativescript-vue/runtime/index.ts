import { run, on, launchEvent } from 'tns-core-modules/application'
import { warn } from 'vue/src/core/util/index'
import { patch } from './patch'
import { mountComponent } from 'vue/src/core/instance/lifecycle'
import { compileToFunctions } from '../compiler'
import { registerElement, getElementMap } from '../element-registry'

import Vue from 'vue'
import DocumentNode from '../renderer/DocumentNode'
import platformDirectives from './directives/index'

import { mustUseProp, isReservedTag, isUnknownElement } from '../util/index'

export const VUE_VM_REF = '__vue_vm_ref__'

const config  = Vue.config as any;
const VueAny  = Vue as any;
config.mustUseProp = mustUseProp
config.isReservedTag = isReservedTag
config.isUnknownElement = isUnknownElement

VueAny.$document = Vue.prototype.$document = new DocumentNode()

Vue.compile = compileToFunctions
VueAny.registerElement = registerElement

Object.assign(VueAny.options.directives, platformDirectives)

Vue.prototype.__patch__ = patch

Vue.prototype.$mount = function(el, hydrating) {
  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template && typeof template !== 'string') {
      warn('invalid template option: ' + template, this)
      return this
    }

    if (template) {
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          delimiters: options.delimiters,
          comments: options.comments
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }

  return mountComponent(this, el, hydrating)
}

Vue.prototype.$start = function() {
  let self = this
  const AppConstructor = Vue.extend(this.$options)

  // register NS components into Vue
  Object.values(getElementMap()).forEach((entry: any) => {
    Vue.component(entry.meta.component.name, entry.meta.component)
  })

  on(launchEvent, args => {
    if (self.$el) {
      self.$destroy()
      self = new AppConstructor()
    }

    self.$mount()
    args.root = self.$el.nativeView
  })

  run()
}

// Define a `nativeView` getter in every NS vue instance
Object.defineProperty(Vue.prototype, 'nativeView', {
  get() {
    return this.$el.nativeView
  }
})

export default Vue
