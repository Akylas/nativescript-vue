"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var parser_1 = require("./compiler/sfc/parser");
exports.parseComponent = parser_1.parseComponent;
var index_1 = require("./compiler/index");
exports.compile = index_1.compile;
exports.compileToFunctions = index_1.compileToFunctions;
var element_registry_1 = require("./element-registry");
exports.registerElement = element_registry_1.registerElement;
//# sourceMappingURL=compiler.js.map