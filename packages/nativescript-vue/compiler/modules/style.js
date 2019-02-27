"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("vue/src/compiler/helpers");
const text_parser_1 = require("vue/src/compiler/parser/text-parser");
const util_1 = require("vue/src/shared/util");
const normalize = util_1.cached(util_1.camelize);
function transformNode(el, options) {
    const warn = options.warn || helpers_1.baseWarn;
    const staticStyle = helpers_1.getAndRemoveAttr(el, 'style');
    const { dynamic, styleResult } = parseStaticStyle(staticStyle, options);
    if (process.env.NODE_ENV !== 'production' && dynamic) {
        warn(`style="${String(staticStyle)}": ` +
            'Interpolation inside attributes has been deprecated. ' +
            'Use v-bind or the colon shorthand instead.');
    }
    if (!dynamic && styleResult) {
        el.staticStyle = styleResult;
    }
    const styleBinding = helpers_1.getBindingAttr(el, 'style', false);
    if (styleBinding) {
        el.styleBinding = styleBinding;
    }
    else if (dynamic) {
        el.styleBinding = styleResult;
    }
}
function genData(el) {
    let data = '';
    if (el.staticStyle) {
        data += `staticStyle:${el.staticStyle},`;
    }
    if (el.styleBinding) {
        data += `style:${el.styleBinding},`;
    }
    return data;
}
function parseStaticStyle(staticStyle, options) {
    let dynamic = false;
    let styleResult = '';
    if (staticStyle) {
        const styleList = staticStyle
            .trim()
            .split(';')
            .map(style => {
            const result = style.trim().split(':');
            if (result.length !== 2) {
                return null;
            }
            const key = normalize(result[0].trim());
            const value = result[1].trim();
            const dynamicValue = text_parser_1.parseText(value, options.delimiters);
            if (dynamicValue) {
                dynamic = true;
                return key + ':' + dynamicValue;
            }
            return key + ':' + JSON.stringify(value);
        })
            .filter(result => result);
        if (styleList.length) {
            styleResult = '{' + styleList.join(',') + '}';
        }
    }
    return { dynamic, styleResult };
}
exports.default = {
    staticKeys: ['staticStyle'],
    transformNode,
    genData
};
//# sourceMappingURL=style.js.map