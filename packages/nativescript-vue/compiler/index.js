"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("vue/src/compiler/index");
const util_1 = require("vue/src/shared/util");
const element_registry_1 = require("../element-registry");
exports.registerElement = element_registry_1.registerElement;
const index_2 = require("./modules/index");
const index_3 = require("./directives/index");
const index_4 = require("../util/index");
exports.baseOptions = {
    modules: index_2.default,
    directives: index_3.default,
    isUnaryTag: index_4.isUnaryTag,
    mustUseProp: index_4.mustUseProp,
    canBeLeftOpenTag: index_4.canBeLeftOpenTag,
    isReservedTag: index_4.isReservedTag,
    getTagNamespace: index_4.getTagNamespace,
    preserveWhitespace: false,
    staticKeys: util_1.genStaticKeys(index_2.default)
};
const { compile, compileToFunctions } = index_1.createCompiler(exports.baseOptions);
exports.compile = compile;
exports.compileToFunctions = compileToFunctions;
//# sourceMappingURL=index.js.map