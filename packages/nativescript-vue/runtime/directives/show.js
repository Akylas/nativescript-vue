"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_1 = require("../modules/transition");
function locateNode(vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
        ? locateNode(vnode.componentInstance._vnode)
        : vnode;
}
exports.default = {
    bind(el, { value }, vnode) {
        vnode = locateNode(vnode);
        const transition = vnode.data && vnode.data.transition;
        const originalVisibility = (el.__vOriginalVisibility =
            el.getAttribute('visibility') === 'none'
                ? ''
                : el.getAttribute('visibility'));
        if (value && transition) {
            vnode.data.show = true;
            transition_1.enter(vnode, () => {
                el.setAttribute('visibility', originalVisibility);
            });
        }
        else {
            el.setAttribute('visibility', value ? originalVisibility : 'collapsed');
        }
    },
    update(el, { value, oldValue }, vnode) {
        if (!value === !oldValue)
            return;
        vnode = locateNode(vnode);
        const transition = vnode.data && vnode.data.transition;
        if (transition) {
            vnode.data.show = true;
            if (value) {
                transition_1.enter(vnode, () => {
                    el.setAttribute('visibility', el.__vOriginalVisibility);
                });
            }
            else {
                transition_1.leave(vnode, () => {
                    el.setAttribute('visibility', 'collapsed');
                });
            }
        }
        else {
            el.setAttribute('visibility', value ? el.__vOriginalVisibility : 'collapsed');
        }
    },
    unbind(el, binding, vnode, oldVnode, isDestroy) {
        if (!isDestroy) {
            el.setAttribute('visibility', el.__vOriginalVisibility);
        }
    }
};
//# sourceMappingURL=show.js.map