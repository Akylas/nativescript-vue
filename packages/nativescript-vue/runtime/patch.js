"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const patch_1 = require("vue/src/core/vdom/patch");
const index_1 = require("vue/src/core/vdom/modules/index");
const index_2 = require("./modules/index");
const nodeOps = require("./node-ops");
const modules = index_2.default.concat(index_1.default);
exports.patch = patch_1.createPatchFunction({
    nodeOps,
    modules
});
//# sourceMappingURL=patch.js.map