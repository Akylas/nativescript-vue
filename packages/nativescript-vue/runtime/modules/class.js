"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("vue/src/platforms/web/util/index");
function updateClass(oldVnode, vnode) {
    const el = vnode.elm;
    const data = vnode.data;
    const oldData = oldVnode.data;
    if (!data.staticClass &&
        !data.class &&
        (!oldData || (!oldData.staticClass && !oldData.class))) {
        return;
    }
    let cls = index_1.genClassForVnode(vnode);
    const transitionClass = el._transitionClasses;
    if (transitionClass) {
        cls = index_1.concat(cls, index_1.stringifyClass(transitionClass));
    }
    if (cls !== el._prevClass) {
        el.setAttribute('class', cls);
        el._prevClass = cls;
    }
}
exports.default = {
    create: updateClass,
    update: updateClass
};
//# sourceMappingURL=class.js.map