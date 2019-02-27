"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("vue/src/shared/util");
function updateAttrs(oldVnode, vnode) {
    if (!oldVnode.data.attrs && !vnode.data.attrs) {
        return;
    }
    let key, cur, old;
    const elm = vnode.elm;
    const oldAttrs = oldVnode.data.attrs || {};
    let attrs = vnode.data.attrs || {};
    if (attrs.__ob__) {
        attrs = vnode.data.attrs = util_1.extend({}, attrs);
    }
    for (key in attrs) {
        cur = attrs[key];
        old = oldAttrs[key];
        if (old !== cur) {
            elm.setAttribute(key, cur);
        }
    }
    for (key in oldAttrs) {
        if (attrs[key] == null) {
            elm.setAttribute(key);
        }
    }
}
exports.default = {
    create: updateAttrs,
    update: updateAttrs
};
//# sourceMappingURL=attrs.js.map