"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
global.process = global.process || {};
global.process.env = global.process.env || {};
const frame_1 = require("tns-core-modules/ui/frame");
const application = require("tns-core-modules/application");
const index_1 = require("./runtime/index");
const modal_plugin_1 = require("./plugins/modal-plugin");
const navigator_plugin_1 = require("./plugins/navigator-plugin");
const util_1 = require("./util");
index_1.default.config.silent = true;
util_1.setVue(index_1.default);
index_1.default.use(modal_plugin_1.default);
index_1.default.use(navigator_plugin_1.default);
global.__onLiveSyncCore = () => {
    const frame = frame_1.topmost();
    if (frame) {
        if (frame.currentPage && frame.currentPage.modal) {
            frame.currentPage.modal.closeModal();
        }
        if (frame.currentPage) {
            frame.currentPage.addCssFile(application.getCssFileName());
        }
    }
};
index_1.default.default = index_1.default;
exports.default = index_1.default;
//# sourceMappingURL=index.js.map