"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("vue/src/compiler/directives/model");
const element_registry_1 = require("../../element-registry");
const helpers_1 = require("vue/src/compiler/helpers");
function model(el, dir) {
    if (el.type === 1 && element_registry_1.isKnownView(el.tag)) {
        genDefaultModel(el, dir.value, dir.modifiers);
    }
    else {
        model_1.genComponentModel(el, dir.value, dir.modifiers);
    }
}
exports.default = model;
function genDefaultModel(el, value, modifiers) {
    const { trim, number } = modifiers || {};
    const { prop, event } = element_registry_1.getViewMeta(el.tag).model;
    let valueExpression = `$event.value${trim ? '.trim()' : ''}`;
    if (number) {
        valueExpression = `_n(${valueExpression})`;
    }
    const code = model_1.genAssignmentCode(value, valueExpression);
    helpers_1.addAttr(el, prop, `(${value})`);
    helpers_1.addHandler(el, event, code, null, true);
}
//# sourceMappingURL=model.js.map