"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("vue/src/core/util/index");
const index_2 = require("vue/src/core/vdom/helpers/index");
const lifecycle_1 = require("vue/src/core/instance/lifecycle");
const util_1 = require("vue/src/shared/util");
const transition_util_1 = require("vue/src/platforms/web/runtime/transition-util");
function enter(vnode, toggleDisplay) {
    const el = vnode.elm;
    if (util_1.isDef(el._leaveCb)) {
        el._leaveCb.cancelled = true;
        el._leaveCb();
    }
    const data = transition_util_1.resolveTransition(vnode.data.transition);
    if (util_1.isUndef(data)) {
        return;
    }
    if (util_1.isDef(el._enterCb) || el.nodeType !== 1) {
        return;
    }
    const { css, type, enterClass, enterToClass, enterActiveClass, appearClass, appearToClass, appearActiveClass, beforeEnter, enter, afterEnter, enterCancelled, beforeAppear, appear, afterAppear, appearCancelled, duration } = data;
    let context = lifecycle_1.activeInstance;
    let transitionNode = lifecycle_1.activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
        transitionNode = transitionNode.parent;
        context = transitionNode.context;
    }
    const isAppear = !context._isMounted || !vnode.isRootInsert;
    if (isAppear && !appear && appear !== '') {
        return;
    }
    const startClass = isAppear && appearClass ? appearClass : enterClass;
    const activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
    const toClass = isAppear && appearToClass ? appearToClass : enterToClass;
    const beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
    const enterHook = isAppear
        ? typeof appear === 'function' ? appear : enter
        : enter;
    const afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
    const enterCancelledHook = isAppear
        ? appearCancelled || enterCancelled
        : enterCancelled;
    const explicitEnterDuration = util_1.toNumber(util_1.isObject(duration) ? duration.enter : duration);
    if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
        checkDuration(explicitEnterDuration, 'enter', vnode);
    }
    const expectsCSS = css !== false;
    const userWantsControl = getHookArgumentsLength(enterHook);
    const cb = (el._enterCb = util_1.once(() => {
        if (expectsCSS) {
            transition_util_1.removeTransitionClass(el, toClass);
            transition_util_1.removeTransitionClass(el, activeClass);
        }
        if (cb.cancelled) {
            if (expectsCSS) {
                transition_util_1.removeTransitionClass(el, startClass);
            }
            enterCancelledHook && enterCancelledHook(el);
        }
        else {
            afterEnterHook && afterEnterHook(el);
        }
        el._enterCb = null;
    }));
    if (!vnode.data.show) {
        index_2.mergeVNodeHook(vnode, 'insert', () => {
            const parent = el.parentNode;
            const pendingNode = parent && parent._pending && parent._pending[vnode.key];
            if (pendingNode &&
                pendingNode.tag === vnode.tag &&
                pendingNode.elm._leaveCb) {
                pendingNode.elm._leaveCb();
            }
            enterHook && enterHook(el, cb);
        });
    }
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
        transition_util_1.addTransitionClass(el, startClass);
        transition_util_1.addTransitionClass(el, activeClass);
        transition_util_1.nextFrame(() => {
            transition_util_1.removeTransitionClass(el, startClass);
            if (!cb.cancelled) {
                transition_util_1.addTransitionClass(el, toClass);
                if (!userWantsControl) {
                    if (isValidDuration(explicitEnterDuration)) {
                        setTimeout(cb, explicitEnterDuration);
                    }
                    else {
                    }
                }
            }
        });
    }
    if (vnode.data.show) {
        toggleDisplay && toggleDisplay();
        enterHook && enterHook(el, cb);
    }
    if (!expectsCSS && !userWantsControl) {
        cb();
    }
}
exports.enter = enter;
function leave(vnode, rm) {
    const el = vnode.elm;
    if (util_1.isDef(el._enterCb)) {
        el._enterCb.cancelled = true;
        el._enterCb();
    }
    const data = transition_util_1.resolveTransition(vnode.data.transition);
    if (util_1.isUndef(data) || el.nodeType !== 1) {
        return rm();
    }
    if (util_1.isDef(el._leaveCb)) {
        return;
    }
    const { css, type, leaveClass, leaveToClass, leaveActiveClass, beforeLeave, leave, afterLeave, leaveCancelled, delayLeave, duration } = data;
    const expectsCSS = css !== false;
    const userWantsControl = getHookArgumentsLength(leave);
    const explicitLeaveDuration = util_1.toNumber(util_1.isObject(duration) ? duration.leave : duration);
    if (process.env.NODE_ENV !== 'production' && util_1.isDef(explicitLeaveDuration)) {
        checkDuration(explicitLeaveDuration, 'leave', vnode);
    }
    const cb = (el._leaveCb = util_1.once(() => {
        if (el.parentNode && el.parentNode._pending) {
            el.parentNode._pending[vnode.key] = null;
        }
        if (expectsCSS) {
            transition_util_1.removeTransitionClass(el, leaveToClass);
            transition_util_1.removeTransitionClass(el, leaveActiveClass);
        }
        if (cb.cancelled) {
            if (expectsCSS) {
                transition_util_1.removeTransitionClass(el, leaveClass);
            }
            leaveCancelled && leaveCancelled(el);
        }
        else {
            rm();
            afterLeave && afterLeave(el);
        }
        el._leaveCb = null;
    }));
    if (delayLeave) {
        delayLeave(performLeave);
    }
    else {
        performLeave();
    }
    function performLeave() {
        if (cb.cancelled) {
            return;
        }
        if (!vnode.data.show) {
            ;
            (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
        }
        beforeLeave && beforeLeave(el);
        if (expectsCSS) {
            transition_util_1.addTransitionClass(el, leaveClass);
            transition_util_1.addTransitionClass(el, leaveActiveClass);
            transition_util_1.nextFrame(() => {
                transition_util_1.removeTransitionClass(el, leaveClass);
                if (!cb.cancelled) {
                    transition_util_1.addTransitionClass(el, leaveToClass);
                    if (!userWantsControl) {
                        if (isValidDuration(explicitLeaveDuration)) {
                            setTimeout(cb, explicitLeaveDuration);
                        }
                        else {
                        }
                    }
                }
            });
        }
        leave && leave(el, cb);
        if (!expectsCSS && !userWantsControl) {
            cb();
        }
    }
}
exports.leave = leave;
function checkDuration(val, name, vnode) {
    if (typeof val !== 'number') {
        index_1.warn(`<transition> explicit ${name} duration is not a valid number - ` +
            `got ${JSON.stringify(val)}.`, vnode.context);
    }
    else if (isNaN(val)) {
        index_1.warn(`<transition> explicit ${name} duration is NaN - ` +
            'the duration expression might be incorrect.', vnode.context);
    }
}
function isValidDuration(val) {
    return typeof val === 'number' && !isNaN(val);
}
function getHookArgumentsLength(fn) {
    if (util_1.isUndef(fn)) {
        return false;
    }
    const invokerFns = fn.fns;
    if (util_1.isDef(invokerFns)) {
        return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
    }
    else {
        return (fn._length || fn.length) > 1;
    }
}
function _enter(_, vnode) {
    if (vnode.data.show !== true) {
        enter(vnode);
    }
}
exports.default = {
    create: _enter,
    activate: _enter,
    remove(vnode, rm) {
        if (vnode.data.show !== true) {
            leave(vnode, rm);
        }
        else {
            rm();
        }
    }
};
//# sourceMappingURL=transition.js.map