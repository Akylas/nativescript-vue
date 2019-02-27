"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _findParentModalEntry(vm) {
    if (!vm) {
        return false;
    }
    let entry = vm.$parent;
    while (entry && entry.$options.name !== 'ModalEntry') {
        entry = entry.$parent;
    }
    return entry;
}
exports.default = {
    install(Vue) {
        Vue.mixin({
            created() {
                const self = this;
                this.$modal = {
                    close(data) {
                        const entry = _findParentModalEntry(self);
                        if (entry) {
                            entry.closeCb(data);
                        }
                    }
                };
            }
        });
        Vue.prototype.$showModal = function (component, options) {
            const defaultOptions = {
                fullscreen: false
            };
            options = Object.assign({}, defaultOptions, options);
            return new Promise(resolve => {
                let resolved = false;
                const closeCb = data => {
                    if (resolved)
                        return;
                    resolved = true;
                    resolve(data);
                    modalPage.closeModal();
                    navEntryInstance.$emit('modal:close', data);
                    navEntryInstance.$destroy();
                };
                const navEntryInstance = new Vue({
                    name: 'ModalEntry',
                    parent: this.$root,
                    methods: {
                        closeCb
                    },
                    render: h => h(component, {
                        props: options.props
                    })
                });
                const modalPage = navEntryInstance.$mount().$el.nativeView;
                this.$el.nativeView.showModal(modalPage, null, closeCb, options.fullscreen);
            });
        };
    }
};
//# sourceMappingURL=modal-plugin.js.map