"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layout_base_1 = require("tns-core-modules/ui/layouts/layout-base");
const content_view_1 = require("tns-core-modules/ui/content-view");
const view_1 = require("tns-core-modules/ui/core/view");
function isView(view) {
    return view instanceof view_1.View;
}
exports.isView = isView;
function isLayout(view) {
    return view instanceof layout_base_1.LayoutBase;
}
exports.isLayout = isLayout;
function isContentView(view) {
    return view instanceof content_view_1.ContentView;
}
exports.isContentView = isContentView;
function insertChild(parentNode, childNode, atIndex = -1) {
    if (!parentNode) {
        return;
    }
    if (parentNode.meta && typeof parentNode.meta.insertChild === 'function') {
        return parentNode.meta.insertChild(parentNode, childNode, atIndex);
    }
    if (childNode.meta.skipAddToDom) {
        return;
    }
    const parentView = parentNode.nativeView;
    const childView = childNode.nativeView;
    if (isLayout(parentView)) {
        if (childView.parent === parentView) {
            let index = parentView.getChildIndex(childView);
            if (index !== -1) {
                parentView.removeChild(childView);
            }
        }
        if (atIndex !== -1) {
            parentView.insertChild(childView, atIndex);
        }
        else {
            parentView.addChild(childView);
        }
    }
    else if (isContentView(parentView)) {
        if (childNode.nodeType === 8) {
            parentView._addView(childView, atIndex);
        }
        else {
            parentView.content = childView;
        }
    }
    else if (parentView && parentView._addChildFromBuilder) {
        parentView._addChildFromBuilder(childNode._nativeView.constructor.name, childView);
    }
    else {
    }
}
exports.insertChild = insertChild;
function removeChild(parentNode, childNode) {
    if (!parentNode) {
        return;
    }
    if (parentNode.meta && typeof parentNode.meta.removeChild === 'function') {
        return parentNode.meta.removeChild(parentNode, childNode);
    }
    if (childNode.meta.skipAddToDom) {
        return;
    }
    const parentView = parentNode.nativeView;
    const childView = childNode.nativeView;
    if (isLayout(parentView)) {
        parentView.removeChild(childView);
    }
    else if (isContentView(parentView)) {
        if (parentView.content === childView) {
            parentView.content = null;
        }
        if (childNode.nodeType === 8) {
            parentView._removeView(childView);
        }
    }
    else if (isView(parentView)) {
        parentView._removeView(childView);
    }
    else {
    }
}
exports.removeChild = removeChild;
//# sourceMappingURL=utils.js.map