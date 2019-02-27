"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_registry_1 = require("../../element-registry");
const helpers_1 = require("vue/src/compiler/helpers");
function preTransformNode(el) {
    if (el.tag !== 'router-view')
        return;
    if (element_registry_1.normalizeElementName(el.parent.tag) === 'nativeframe') {
        helpers_1.addAttr(el.parent, 'hasRouterView', 'true');
    }
}
exports.default = {
    preTransformNode
};
//# sourceMappingURL=router.js.map