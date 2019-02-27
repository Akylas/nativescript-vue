"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frames = new Map();
function setFrame(id, frame) {
    return frames.set(id, frame);
}
exports.setFrame = setFrame;
function getFrame(id) {
    return frames.get(id);
}
exports.getFrame = getFrame;
function deleteFrame(id) {
    return frames.delete(id);
}
exports.deleteFrame = deleteFrame;
//# sourceMappingURL=frame.js.map