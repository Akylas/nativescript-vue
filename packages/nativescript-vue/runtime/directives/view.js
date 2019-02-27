"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    inserted(el, { arg, modifiers }) {
        const parent = el.parentNode.nativeView;
        if (parent) {
            if (modifiers.array) {
                parent[arg] = (parent[arg] || []).push(el.nativeView);
            }
            else {
                parent[arg] = el.nativeView;
            }
        }
    }
};
//# sourceMappingURL=view.js.map