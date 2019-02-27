"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("vue/src/shared/util");
const normalize = util_1.cached(util_1.camelize);
function createStyle(oldVnode, vnode) {
    if (!vnode.data.staticStyle) {
        updateStyle(oldVnode, vnode);
        return;
    }
    const elm = vnode.elm;
    const staticStyle = vnode.data.staticStyle;
    for (const name in staticStyle) {
        if (staticStyle[name]) {
            elm.setStyle(normalize(name), staticStyle[name]);
        }
    }
    updateStyle(oldVnode, vnode);
}
function updateStyle(oldVnode, vnode) {
    if (!oldVnode.data.style && !vnode.data.style) {
        return;
    }
    let cur, name;
    const elm = vnode.elm;
    const oldStyle = oldVnode.data.style || {};
    let style = vnode.data.style || {};
    const needClone = style.__ob__;
    if (Array.isArray(style)) {
        style = vnode.data.style = toObject(style);
    }
    if (needClone) {
        style = vnode.data.style = util_1.extend({}, style);
    }
    for (name in oldStyle) {
        if (!style[name]) {
            elm.setStyle(normalize(name), '');
        }
    }
    for (name in style) {
        cur = style[name];
        elm.setStyle(normalize(name), cur);
    }
}
function toObject(arr) {
    const res = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
            util_1.extend(res, arr[i]);
        }
    }
    return res;
}
exports.default = {
    create: createStyle,
    update: updateStyle
};
//# sourceMappingURL=style.js.map