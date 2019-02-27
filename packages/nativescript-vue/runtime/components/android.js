"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { isAndroid } = require('tns-core-modules/platform');
exports.default = {
    functional: true,
    render(h, { children }) {
        if (isAndroid) {
            return children;
        }
    }
};
//# sourceMappingURL=android.js.map