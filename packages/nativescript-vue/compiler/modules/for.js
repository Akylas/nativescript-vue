"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("vue/src/compiler/helpers");
const element_registry_1 = require("../../element-registry");
const index_1 = require("vue/src/compiler/parser/index");
const debug_1 = require("vue/src/core/util/debug");
function preTransformNode(el) {
    let vfor;
    if (element_registry_1.normalizeElementName(el.tag) === 'nativelistview') {
        vfor = helpers_1.getAndRemoveAttr(el, 'v-for');
        delete el.attrsMap['v-for'];
        if (process.env.NODE_ENV !== 'production' && vfor) {
            debug_1.warn(`The v-for directive is not supported on a ${el.tag}, ` +
                'Use the "for" attribute instead. For example, instead of ' +
                `<${el.tag} v-for="${vfor}"> use <${el.tag} for="${vfor}">.`);
        }
    }
    const exp = helpers_1.getAndRemoveAttr(el, 'for') || vfor;
    if (!exp)
        return;
    const res = index_1.parseFor(exp);
    if (!res) {
        if (process.env.NODE_ENV !== 'production') {
            debug_1.warn(`Invalid for expression: ${exp}`);
        }
        return;
    }
    helpers_1.addRawAttr(el, ':items', res.for);
    helpers_1.addRawAttr(el, '+alias', res.alias);
    if (res.iterator1) {
        helpers_1.addRawAttr(el, '+index', res.iterator1);
    }
}
exports.default = {
    preTransformNode
};
//# sourceMappingURL=for.js.map