"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("vue/src/compiler/helpers");
function transformNode(el) {
    const attr = Object.keys(el.attrsMap).find(attr => attr.startsWith('~'));
    if (attr) {
        const attrName = attr.substr(1);
        let [arg, ...modifiers] = attrName.split('.');
        modifiers = modifiers.reduce((mods, mod) => {
            mods[mod] = true;
            return mods;
        }, {});
        helpers_1.getAndRemoveAttr(el, attr);
        helpers_1.addDirective(el, 'view', `v-view:${attrName}`, '', arg, modifiers);
    }
}
exports.default = {
    transformNode
};
//# sourceMappingURL=view.js.map