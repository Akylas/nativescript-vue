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
const intro = `
if (!global.process) {
  global.process = process = {env:{}}
}
`

const resolveVue = p => {
    return path.resolve(process.cwd(), 'node_modules', 'vue/src/', p) + '/'
}
const aliases = {
    vue: resolveVue('core/index'),
    compiler: resolveVue('compiler'),
    web: resolveVue('platforms/web'),
    core: resolveVue('core'),
    shared: resolveVue('shared'),
    sfc: resolveVue('sfc'),
    //he: path.resolve(__dirname, 'node_modules', 'he', 'he')
    he: path.resolve(__dirname, '..', 'platform/nativescript/util/entity-decoder')
}

const compilerExternals = Object.keys(
  require('../packages/akylas-nativescript-vue-template-compiler/package.json')
    .dependencies
)
const builds = {
  'akylas-nativescript-vue': {
        entry: './platform/nativescript/framework.js',
        dest: './dist/index.js',
        moduleName: 'NativeScript-Vue',
        intro: intro,
        format:'esm',
        banner: banner('NativeScript-Vue'),
        external(id) {
      return /tns-core-modules/.test(id) || /weex/.test(id)
        }
    },
  'akylas-nativescript-vue-template-compiler': {
        entry: './platform/nativescript/compiler.js',
    dest: './packages/akylas-nativescript-vue-template-compiler/index.js',
    moduleName: 'Akylas-NativeScript-Vue-Template-Compiler',
    banner: banner('Akylas-NativeScript-Vue-Template-Compiler'),
    external(id) {
      return compilerExternals.indexOf(id) !== -1 || /weex/.test(id)
    }
  }
}

const genConfig = name => {
    const opts = builds[name]
    const config = {
        input: opts.entry,
        external: opts.external,
    treeshake: false,
        output: {
            intro: opts.intro,
            file: opts.dest,
      intro: opts.intro,
            format: opts.format || 'cjs',
            banner: opts.banner,
            name: opts.moduleName
        },
        treeshake: {
            pureExternalModules: id => id.startsWith('weex')
        },
        watch: {
            chokidar: false
        },
        plugins: [
            replace({
                __WEEX__: false,
                __VERSION__: VueVersion,
                'let _isServer': 'let _isServer = false',
                'process.env.NEW_SLOT_SYNTAX': 'true',
                'process.env.VBIND_PROP_SHORTHAND': 'false',
                'process.env.VUE_VERSION': `process.env.VUE_VERSION || '${VueVersion}'`,
                'process.env.NS_VUE_VERSION': `process.env.NS_VUE_VERSION || '${NSVueVersion}'`
            }),
            flow(),
            buble(),
            alias(aliases),
      resolve({
        preferBuiltins: false
      }),
      commonjs()
    ]
    }

    Object.defineProperty(config, '_name', {
        enumerable: false,
        value: name
    })

  return config
}

if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET)
} else {
    module.exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
