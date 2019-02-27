export { parseComponent } from './compiler/sfc/parser'
export { compile, compileToFunctions, registerElement } from './compiler/index'


// register all components
require('./compiler/element-registry');


