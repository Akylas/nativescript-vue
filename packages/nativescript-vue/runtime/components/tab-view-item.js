"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("vue/src/core/util/debug");
exports.default = {
    template: `<NativeTabViewItem><slot /></NativeTabViewItem>`,
    mounted() {
        if (this.$el.childNodes.length > 1) {
            debug_1.warn('TabViewItem should contain only 1 root element', this);
        }
        let _nativeView = this.$el.nativeView;
        _nativeView.view = this.$el.childNodes[0].nativeView;
        this.$parent.registerTab(_nativeView);
    }
};
//# sourceMappingURL=tab-view-item.js.map