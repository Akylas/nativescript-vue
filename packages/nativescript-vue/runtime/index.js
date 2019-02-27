"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("tns-core-modules/application");
const index_1 = require("vue/src/core/util/index");
const patch_1 = require("./patch");
const lifecycle_1 = require("vue/src/core/instance/lifecycle");
const compiler_1 = require("../compiler");
const element_registry_1 = require("../element-registry");
const vue_1 = require("vue");
const DocumentNode_1 = require("../renderer/DocumentNode");
const index_2 = require("./directives/index");
const index_3 = require("../util/index");
exports.VUE_VM_REF = '__vue_vm_ref__';
const config = vue_1.default.config;
const VueAny = vue_1.default;
config.mustUseProp = index_3.mustUseProp;
config.isReservedTag = index_3.isReservedTag;
config.isUnknownElement = index_3.isUnknownElement;
VueAny.$document = vue_1.default.prototype.$document = new DocumentNode_1.default();
vue_1.default.compile = compiler_1.compileToFunctions;
VueAny.registerElement = element_registry_1.registerElement;
Object.assign(VueAny.options.directives, index_2.default);
vue_1.default.prototype.__patch__ = patch_1.patch;
vue_1.default.prototype.$mount = function (el, hydrating) {
    const options = this.$options;
    if (!options.render) {
        let template = options.template;
        if (template && typeof template !== 'string') {
            index_1.warn('invalid template option: ' + template, this);
            return this;
        }
        if (template) {
            const { render, staticRenderFns } = compiler_1.compileToFunctions(template, {
                delimiters: options.delimiters,
                comments: options.comments
            }, this);
            options.render = render;
            options.staticRenderFns = staticRenderFns;
        }
    }
    return lifecycle_1.mountComponent(this, el, hydrating);
};
vue_1.default.prototype.$start = function () {
    let self = this;
    const AppConstructor = vue_1.default.extend(this.$options);
    Object.values(element_registry_1.getElementMap()).forEach((entry) => {
        vue_1.default.component(entry.meta.component.name, entry.meta.component);
    });
    application_1.on(application_1.launchEvent, args => {
        if (self.$el) {
            self.$destroy();
            self = new AppConstructor();
        }
        self.$mount();
        args.root = self.$el.nativeView;
    });
    application_1.run();
};
Object.defineProperty(vue_1.default.prototype, 'nativeView', {
    get() {
        return this.$el.nativeView;
    }
});
exports.default = vue_1.default;
//# sourceMappingURL=index.js.map