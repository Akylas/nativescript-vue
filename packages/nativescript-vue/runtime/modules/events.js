"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const update_listeners_1 = require("vue/src/core/vdom/helpers/update-listeners");
let target;
function add(event, handler, once, capture) {
    if (capture) {
        console.log('bubble phase not supported');
        return;
    }
    if (once) {
        const oldHandler = handler;
        handler = (...args) => {
            const res = oldHandler.call(null, ...args);
            if (res !== null) {
                remove(event, null, null, target);
            }
        };
    }
    target.addEventListener(event, handler);
}
function remove(event, handler, capture, _target = target) {
    _target.removeEventListener(event);
}
function updateDOMListeners(oldVnode, vnode) {
    if (!oldVnode.data.on && !vnode.data.on) {
        return;
    }
    const on = vnode.data.on || {};
    const oldOn = oldVnode.data.on || {};
    target = vnode.elm;
    update_listeners_1.updateListeners(on, oldOn, add, remove, vnode.context);
}
exports.default = {
    create: updateDOMListeners,
    update: updateDOMListeners
};
//# sourceMappingURL=events.js.map