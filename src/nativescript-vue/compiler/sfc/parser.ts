/* @flow */

/**
 * This file is a fork of https://github.com/vuejs/vue/blob/dev/src/sfc/parser.js
 * which allows multiple template and script blocks in a SFC
 */
import deindent from 'de-indent'
import { parseHTML } from 'vue/src/compiler/parser/html-parser'
import { makeMap } from 'vue/src/shared/util'

const splitRE = /\r?\n/g
const replaceRE = /./g
const isSpecialTag = makeMap('script,style,template', true)

export type Attribute = {
  name: string,
  value: string
}

export interface StartOfSourceMap {
  file?: string
  sourceRoot?: string
}

export interface RawSourceMap extends StartOfSourceMap {
  version: string
  sources: string[]
  names: string[]
  sourcesContent?: string[]
  mappings: string
}


export interface SFCCustomBlock {
  type: string
  content: string
  attrs: { [key: string]: string | true }
  start: number
  end?: number
  map?: RawSourceMap
}

export interface SFCBlock extends SFCCustomBlock {
  lang?: string
  src?: string
  scoped?: boolean
  module?: string | boolean
}
export interface SFCDescriptor {
  template: SFCBlock | null
  templates: SFCBlock[] | null
  script: SFCBlock | null
  scripts: SFCBlock[] | null
  styles: SFCBlock[]
  customBlocks: SFCCustomBlock[]
}

/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
export function parseComponent(
  content: string,
  options: any = {}
): SFCDescriptor {
  const sfc: SFCDescriptor = {
    template: null,
    templates: [],
    script: null,
    scripts: [],
    styles: [],
    customBlocks: []
  }
  let depth = 0
  let currentBlock: SFCBlock = null

  function start(
    tag: string,
    attrs: Array<Attribute>,
    unary: boolean,
    start: number,
    end: number
  ) {
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce((cumulated, { name, value }) => {
          cumulated[name] = value || true
          return cumulated
        }, {})
      }
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs)
        if (tag === 'style') {
          sfc.styles.push(currentBlock)
        } else if (tag === 'script') {
          sfc.scripts.push(currentBlock)
        } else if (tag === 'template') {
          sfc.templates.push(currentBlock)
        }
      } else {
        // custom blocks
        sfc.customBlocks.push(currentBlock)
      }
    }
    if (!unary) {
      depth++
    }
  }

  function checkAttrs(block: SFCBlock, attrs: Array<Attribute>) {
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i]
      if (attr.name === 'lang') {
        block.lang = attr.value
      }
      if (attr.name === 'scoped') {
        block.scoped = true
      }
      if (attr.name === 'module') {
        block.module = attr.value || true
      }
      if (attr.name === 'src') {
        block.src = attr.value
      }
    }
  }

  function end(tag: string, start: number, end: number) {
    if (depth === 1 && currentBlock) {
      currentBlock.end = start
      let text = deindent(content.slice(currentBlock.start, currentBlock.end))
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text
      }
      currentBlock.content = text
      currentBlock = null
    }
    depth--
  }

  function padContent(block: SFCBlock, pad: true | 'line' | 'space') {
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ')
    } else {
      const offset = content.slice(0, block.start).split(splitRE).length
      const padChar = block.type === 'script' && !block.lang ? '//\n' : '\n'
      return Array(offset).join(padChar)
    }
  }

  parseHTML(content, {
    start,
    end
  })

  // set template property for backwards compat
  if (sfc.templates.length) {
    sfc.template = sfc.templates[sfc.templates.length - 1]
  }

  // set script property for backwards compat
  if (sfc.scripts.length) {
    sfc.script = sfc.scripts[sfc.scripts.length - 1]
  }

  return sfc
}
