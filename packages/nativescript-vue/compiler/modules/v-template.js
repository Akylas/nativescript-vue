"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function preTransformNode(el) {
    if (el.parent && el.parent.tag === 'v-template') {
        let alias = el.parent.parent.attrsMap['+alias'] || 'item';
        let index = el.parent.parent.attrsMap['+index'] || '$index';
        el.slotScope = buildScopeString(alias, index);
    }
}
exports.default = {
    preTransformNode
};
function buildScopeString(alias, index) {
    return `{ ${alias}, ${index}, $even, $odd }`;
}
exports.buildScopeString = buildScopeString;
//# sourceMappingURL=v-template.js.map