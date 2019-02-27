"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("vue/src/shared/util");
const frame_1 = require("../util/frame");
const frame_2 = require("tns-core-modules/ui/frame");
function getFrameInstance(frame) {
    if (util_1.isObject(frame) && util_1.isDef(frame.$el)) {
        frame = frame.$el.nativeView;
    }
    else if (util_1.isPrimitive(frame)) {
        frame = frame_2.getFrameById(frame);
    }
    else if (util_1.isDef(frame.nativeView)) {
        frame = frame.nativeView;
    }
    return frame_1.getFrame(frame.id);
}
function _findParentNavigationEntry(vm) {
    if (!vm) {
        return false;
    }
    let entry = vm.$parent;
    while (entry && entry.$options.name !== 'NavigationEntry') {
        entry = entry.$parent;
    }
    return entry;
}
exports.default = {
    install(Vue) {
        Vue.prototype.$navigateBack = function (options, backstackEntry = null) {
            const navEntry = _findParentNavigationEntry(this);
            const defaultOptions = {
                frame: navEntry ? navEntry.$options.frame : 'default'
            };
            options = Object.assign({}, defaultOptions, options);
            const frame = getFrameInstance(options.frame);
            frame.back(backstackEntry);
        };
        Vue.prototype.$navigateTo = function (component, options) {
            const defaultOptions = {
                frame: 'default'
            };
            options = Object.assign({}, defaultOptions, options);
            return new Promise(resolve => {
                const frame = getFrameInstance(options.frame);
                const navEntryInstance = new Vue({
                    name: 'NavigationEntry',
                    parent: this.$root,
                    frame,
                    props: {
                        frame: {
                            default: frame.id
                        }
                    },
                    render: h => h(component, { props: options.props })
                });
                const page = navEntryInstance.$mount().$el.nativeView;
                const handler = args => {
                    if (args.isBackNavigation) {
                        page.off('navigatedFrom', handler);
                        navEntryInstance.$destroy();
                    }
                };
                page.on('navigatedFrom', handler);
                const dispose = page.disposeNativeView;
                page.disposeNativeView = (...args) => {
                    navEntryInstance.$destroy();
                    dispose.call(page, args);
                };
                frame.navigate(Object.assign({}, options, { create: () => page }));
                resolve(page);
            });
        };
    }
};
//# sourceMappingURL=navigator-plugin.js.map