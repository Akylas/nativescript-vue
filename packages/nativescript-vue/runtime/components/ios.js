"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { isIOS } = require('tns-core-modules/platform');
exports.default = {
    functional: true,
    render(h, { children }) {
        if (isIOS) {
            return children;
        }
    }
};
//# sourceMappingURL=ios.js.map