"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const de_indent_1 = require("de-indent");
const html_parser_1 = require("vue/src/compiler/parser/html-parser");
const util_1 = require("vue/src/shared/util");
const splitRE = /\r?\n/g;
const replaceRE = /./g;
const isSpecialTag = util_1.makeMap('script,style,template', true);
function parseComponent(content, options = {}) {
    const sfc = {
        template: null,
        templates: [],
        script: null,
        scripts: [],
        styles: [],
        customBlocks: []
    };
    let depth = 0;
    let currentBlock = null;
    function start(tag, attrs, unary, start, end) {
        if (depth === 0) {
            currentBlock = {
                type: tag,
                content: '',
                start: end,
                attrs: attrs.reduce((cumulated, { name, value }) => {
                    cumulated[name] = value || true;
                    return cumulated;
                }, {})
            };
            if (isSpecialTag(tag)) {
                checkAttrs(currentBlock, attrs);
                if (tag === 'style') {
                    sfc.styles.push(currentBlock);
                }
                else if (tag === 'script') {
                    sfc.scripts.push(currentBlock);
                }
                else if (tag === 'template') {
                    sfc.templates.push(currentBlock);
                }
            }
            else {
                sfc.customBlocks.push(currentBlock);
            }
        }
        if (!unary) {
            depth++;
        }
    }
    function checkAttrs(block, attrs) {
        for (let i = 0; i < attrs.length; i++) {
            const attr = attrs[i];
            if (attr.name === 'lang') {
                block.lang = attr.value;
            }
            if (attr.name === 'scoped') {
                block.scoped = true;
            }
            if (attr.name === 'module') {
                block.module = attr.value || true;
            }
            if (attr.name === 'src') {
                block.src = attr.value;
            }
        }
    }
    function end(tag, start, end) {
        if (depth === 1 && currentBlock) {
            currentBlock.end = start;
            let text = de_indent_1.default(content.slice(currentBlock.start, currentBlock.end));
            if (currentBlock.type !== 'template' && options.pad) {
                text = padContent(currentBlock, options.pad) + text;
            }
            currentBlock.content = text;
            currentBlock = null;
        }
        depth--;
    }
    function padContent(block, pad) {
        if (pad === 'space') {
            return content.slice(0, block.start).replace(replaceRE, ' ');
        }
        else {
            const offset = content.slice(0, block.start).split(splitRE).length;
            const padChar = block.type === 'script' && !block.lang ? '//\n' : '\n';
            return Array(offset).join(padChar);
        }
    }
    html_parser_1.parseHTML(content, {
        start,
        end
    });
    if (sfc.templates.length) {
        sfc.template = sfc.templates[sfc.templates.length - 1];
    }
    if (sfc.scripts.length) {
        sfc.script = sfc.scripts[sfc.scripts.length - 1];
    }
    return sfc;
}
exports.parseComponent = parseComponent;
//# sourceMappingURL=parser.js.map