import { createCompiler } from 'compiler/index'
import { genStaticKeys } from 'shared/util'
import { registerElement } from '../element-register'
import modules from './modules/index'
import directives from './directives/index'

import {
  isUnaryTag,
  mustUseProp,
  isReservedTag,
  canBeLeftOpenTag,
  getTagNamespace
} from '../util/index'

export const baseOptions = {
  modules,
  directives,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  preserveWhitespace: false,
  staticKeys: genStaticKeys(modules)
}

const { compile, compileToFunctions } = createCompiler(baseOptions)
export { compile, compileToFunctions, registerElement }
