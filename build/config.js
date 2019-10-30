const alias = require('rollup-plugin-alias')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const flow = require('rollup-plugin-flow-no-whitespace')
const path = require('path')

const VueVersion = require('vue/package.json').version
const NSVueVersion = process.env.VERSION || require('../package.json').version

const banner = (name, version) => `
/*!
 * ${name} v${version || NSVueVersion}
 * (Using Vue v${VueVersion})
 * (c) 2017-${new Date().getFullYear()} rigor789
 * Released under the MIT license.
 */
`

// This is required because some of the third party plugins rely on this
// and cause errors since there is no process variable in {N}.
const intro = `
global.process = global.process || {}
global.process.env = global.process.env || {}
`

const resolveVue = p => {
  return path.resolve(process.cwd(), 'node_modules', 'vue/src/', p) + '/'
}
const aliases = {
  entries:[
    {find:'vue'  , replacement: resolveVue('core/index')},
    {find:'compiler'  , replacement: resolveVue('compiler')},
    {find:'web'  , replacement: resolveVue('platforms/web')},
    {find:'core'  , replacement: resolveVue('core')},
    {find:'shared'  , replacement: resolveVue('shared')},
    {find:'sfc'  , replacement: resolveVue('sfc')},
    {find:'he'  , replacement: path.resolve(__dirname, '..', 'platform/nativescript/util/entity-decoder')}
  ]
}

const builds = {
  'nativescript-akylas-vue': {
    entry: './platform/nativescript/framework.js',
    dest: './dist/index.js',
    moduleName: 'NativeScript-Akylas-Vue',
    banner: banner('NativeScript-Akylas-VVue'),
    intro,
    external(id) {
      return /@nativescript\/core/.test(id) || /weex/.test(id)
    },
  },
  'nativescript-akylas-vue-template-compiler': {
    entry: './platform/nativescript/compiler.js',
    dest: './packages/nativescript-akylas-vue-template-compiler/index.js',
    moduleName: 'NativeScript-Akylas-Vue-Template-Compiler',
    banner: banner('NativeScript-Akylas-Vue-Template-Compiler'),
    external: Object.keys(require('../packages/nativescript-akylas-vue-template-compiler/package.json').dependencies)
  }
}


const genConfig = (name) => {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    output: {
      intro: opts.intro,
      file: opts.dest,
      format: opts.format || 'cjs',
      banner: opts.banner,
      name: opts.moduleName
    },
    // https://github.com/rollup/rollup/issues/2271#issuecomment-455129819
    onwarn(warning) {
      if (
        warning.code === 'CIRCULAR_DEPENDENCY' && [
          'vue',
          'element-registry',
          'patch' // v-template
        ].some(d => warning.importer.includes(d))
      ) {
        return
      } else if (
        warning.message.includes('weex')
      ) {
        return
      }

      console.warn(warning.message)
    },
    treeshake: {
      pureExternalModules: id => id.startsWith('weex')
    },
    plugins: [
      replace({
        delimiters: ['', ''],
        // Patch devtools flush calls to use the global hook
        // rather than the devtools variable
        // which is undefined in most cases
        // and non-reactive
        'devtools && config.devtools': 'global.__VUE_DEVTOOLS_GLOBAL_HOOK__ && config.devtools',
        'devtools.emit(\'flush\')': 'global.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit(\'flush\')',

        // Replace empty .vue file components default element to avoid crashes
        '_c("div")': '_c("NativeContentView")'
      }),
      replace({
        __WEEX__: false,
        __VERSION__: VueVersion,
        // 'process.env.NODE_ENV': "'development'",
        'let _isServer': 'let _isServer = false',
        // Vue 2.6 new slot syntax must be enabled via env.
        'process.env.NEW_SLOT_SYNTAX': `true`,
        'process.env.VBIND_PROP_SHORTHAND': `false`,
        'process.env.VUE_VERSION': `process.env.VUE_VERSION || '${VueVersion}'`,
        'process.env.NS_VUE_VERSION': `process.env.NS_VUE_VERSION || '${NSVueVersion}'`
      }),
      flow(),
      buble({
        transforms: { asyncAwait: false }
      }),
      alias(aliases),
      resolve(),
      commonjs(),
    ],
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config;
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  module.exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
