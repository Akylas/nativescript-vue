"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const element_registry_1 = require("../element-registry");
const util_1 = require("vue/src/shared/util");
const runtime_1 = require("../runtime");
exports.isReservedTag = util_1.makeMap('template', true);
let _Vue;
function setVue(Vue) {
    _Vue = Vue;
}
exports.setVue = setVue;
exports.canBeLeftOpenTag = function (el) {
    return element_registry_1.getViewMeta(el).canBeLeftOpenTag;
};
exports.isUnaryTag = function (el) {
    return element_registry_1.getViewMeta(el).isUnaryTag;
};
function mustUseProp() {
}
exports.mustUseProp = mustUseProp;
function getTagNamespace(el) {
    return element_registry_1.getViewMeta(el).tagNamespace;
}
exports.getTagNamespace = getTagNamespace;
function isUnknownElement(el) {
    return !element_registry_1.isKnownView(el);
}
exports.isUnknownElement = isUnknownElement;
function isPage(el) {
    return el && el.tagName === 'nativepage';
}
exports.isPage = isPage;
function ensurePage(el, vm) {
    if (!isPage(el)) {
        const page = new (element_registry_1.getViewClass('page'))();
        page.content = el.nativeView;
        if (vm) {
            page[runtime_1.VUE_VM_REF] = vm;
            page.disposeNativeView = after(page.disposeNativeView, page, () => vm.$destroy());
        }
        return page;
    }
    if (vm) {
        el.nativeView[runtime_1.VUE_VM_REF] = vm;
        el.disposeNativeView = after(el.disposeNativeView, el, () => vm.$destroy());
    }
    return el.nativeView;
}
exports.ensurePage = ensurePage;
function query(el, renderer, document) {
}
exports.query = query;
exports.VUE_VERSION = process.env.VUE_VERSION;
exports.NS_VUE_VERSION = process.env.NS_VUE_VERSION;
const infoTrace = util_1.once(() => {
    console.log(`NativeScript-Vue has "Vue.config.silent" set to true, to see output logs set it to false.`);
});
function trace(message) {
    if (_Vue && _Vue.config.silent) {
        return infoTrace();
    }
    console.log(`{NSVue (Vue: ${exports.VUE_VERSION} | NSVue: ${exports.NS_VUE_VERSION})} -> ${message}`);
}
exports.trace = trace;
function before(original, thisArg, wrap) {
    return function (...args) {
        wrap.call(null, ...args);
        original.call(thisArg, ...args);
    };
}
exports.before = before;
function after(original, thisArg, wrap) {
    return function (...args) {
        original.call(thisArg, ...args);
        wrap.call(null, ...args);
    };
}
exports.after = after;
function deepProxy(object, depth = 0) {
    return new Proxy(object, {
        get(target, key) {
            if (key === 'toString' || key === 'valueOf') {
                return () => '';
            }
            if (key === Symbol.toPrimitive) {
                return hint => hint;
            }
            if (depth > 10) {
                throw new Error('deepProxy over 10 deep.');
            }
            return deepProxy({}, depth + 1);
        }
    });
}
exports.deepProxy = deepProxy;
//# sourceMappingURL=index.js.map