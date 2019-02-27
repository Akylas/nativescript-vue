"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("vue/src/compiler/helpers");
const text_parser_1 = require("vue/src/compiler/parser/text-parser");
function transformNode(el, options) {
    const warn = options.warn || helpers_1.baseWarn;
    const staticClass = helpers_1.getAndRemoveAttr(el, 'class');
    if (process.env.NODE_ENV !== 'production' && staticClass) {
        const expression = text_parser_1.parseText(staticClass, options.delimiters);
        if (expression) {
            warn(`class="${staticClass}": ` +
                'Interpolation inside attributes has been removed. ' +
                'Use v-bind or the colon shorthand instead. For example, ' +
                'instead of <div class="{{ val }}">, use <div :class="val">.');
        }
    }
    if (staticClass) {
        el.staticClass = JSON.stringify(staticClass);
    }
    const classBinding = helpers_1.getBindingAttr(el, 'class', false);
    if (classBinding) {
        el.classBinding = classBinding;
    }
}
function genData(el) {
    let data = '';
    if (el.staticClass) {
        data += `staticClass:${el.staticClass},`;
    }
    if (el.classBinding) {
        data += `class:${el.classBinding},`;
    }
    return data;
}
exports.default = {
    staticKeys: ['staticClass'],
    transformNode,
    genData
};
//# sourceMappingURL=class.js.map