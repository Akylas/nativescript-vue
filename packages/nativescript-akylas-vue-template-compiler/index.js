
/*!
 * NativeScript-Akylas-Vue-Template-Compiler v2.5.0-alpha.2
 * (Using Vue v2.6.10)
 * (c) 2017-2019 rigor789
 * Released under the MIT license.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deindent = _interopDefault(require('de-indent'));
var htmlParser = require('compiler/parser/html-parser');
var util = require('shared/util');
var index = require('compiler/index');
var helpers = require('compiler/helpers');
var textParser = require('compiler/parser/text-parser');
var debug = require('core/util/debug');
var patch$1 = require('core/vdom/patch');
var baseModules = _interopDefault(require('core/vdom/modules/index'));
var index$1 = require('web/util/index');
var updateListeners = require('core/vdom/helpers/update-listeners');
var index$2 = require('core/util/index');
var index$3 = require('core/vdom/helpers/index');
var lifecycle = require('core/instance/lifecycle');
var transitionUtil = require('web/runtime/transition-util');
var Transition = require('web/runtime/components/transition');
var Transition__default = _interopDefault(Transition);
var index$4 = require('compiler/parser/index');
var model$1 = require('compiler/directives/model');

/*  */

var splitRE = /\r?\n/g;
var replaceRE = /./g;
var isSpecialTag = util.makeMap('script,style,template', true);



/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
function parseComponent(
  content,
  options
) {
  if ( options === void 0 ) options = {};

  var sfc = {
    template: null,
    templates: [],
    script: null,
    scripts: [],
    styles: [],
    customBlocks: []
  };
  var depth = 0;
  var currentBlock = null;

  function start(
    tag,
    attrs,
    unary,
    start,
    end
  ) {
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce(function (cumulated, ref) {
          var name = ref.name;
          var value = ref.value;

          cumulated[name] = value || true;
          return cumulated
        }, {})
      };
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs);
        if (tag === 'style') {
          sfc.styles.push(currentBlock);
        } else if (tag === 'script') {
          sfc.scripts.push(currentBlock);
        } else if (tag === 'template') {
          sfc.templates.push(currentBlock);
        }
      } else {
        // custom blocks
        sfc.customBlocks.push(currentBlock);
      }
    }
    if (!unary) {
      depth++;
    }
  }

  function checkAttrs(block, attrs) {
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
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
      var text = deindent(content.slice(currentBlock.start, currentBlock.end));
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
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
      return content.slice(0, block.start).replace(replaceRE, ' ')
    } else {
      var offset = content.slice(0, block.start).split(splitRE).length;
      var padChar = block.type === 'script' && !block.lang ? '//\n' : '\n';
      return Array(offset).join(padChar)
    }
  }

  htmlParser.parseHTML(content, {
    start: start,
    end: end
  });

  // set template property for backwards compat
  if (sfc.templates.length) {
    sfc.template = sfc.templates[sfc.templates.length - 1];
  }

  // set script property for backwards compat
  if (sfc.scripts.length) {
    sfc.script = sfc.scripts[sfc.scripts.length - 1];
  }

  return sfc
}

function transformNode(el, options) {
  var warn = options.warn || helpers.baseWarn;
  var staticClass = helpers.getAndRemoveAttr(el, 'class');
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    var expression = textParser.parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = helpers.getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData(el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var class_ = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

var normalize = util.cached(util.camelize);

function transformNode$1(el, options) {
  var warn = options.warn || helpers.baseWarn;
  var staticStyle = helpers.getAndRemoveAttr(el, 'style');
  var ref = parseStaticStyle(staticStyle, options);
  var dynamic = ref.dynamic;
  var styleResult = ref.styleResult;
  if (process.env.NODE_ENV !== 'production' && dynamic) {
    warn(
      "style=\"" + (String(staticStyle)) + "\": " +
        'Interpolation inside attributes has been deprecated. ' +
        'Use v-bind or the colon shorthand instead.'
    );
  }
  if (!dynamic && styleResult) {
    el.staticStyle = styleResult;
  }
  var styleBinding = helpers.getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  } else if (dynamic) {
    el.styleBinding = styleResult;
  }
}

function genData$1(el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:" + (el.styleBinding) + ",";
  }
  return data
}

function parseStaticStyle(staticStyle, options) {
  // "width: 200px; height: 200px;" -> {width: 200, height: 200}
  // "width: 200px; height: {{y}}" -> {width: 200, height: y}
  var dynamic = false;
  var styleResult = '';
  if (staticStyle) {
    var styleList = staticStyle
      .trim()
      .split(';')
      .map(function (style) {
        var result = style.trim().split(':');
        if (result.length !== 2) {
          return
        }
        var key = normalize(result[0].trim());
        var value = result[1].trim();
        var dynamicValue = textParser.parseText(value, options.delimiters);
        if (dynamicValue) {
          dynamic = true;
          return key + ':' + dynamicValue
        }
        return key + ':' + JSON.stringify(value)
      })
      .filter(function (result) { return result; });
    if (styleList.length) {
      styleResult = '{' + styleList.join(',') + '}';
    }
  }
  return { dynamic: dynamic, styleResult: styleResult }
}

var style = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

var actionBar = {
  template: "\n    <NativeActionBar ~actionBar v-bind=\"$attrs\" v-on=\"$listeners\">\n      <slot />\n    </NativeActionBar>\n  "
};

var android = {
  functional: true,
  render: function render(h, ref) {
    var children = ref.children;

    if (require('tns-core-modules/platform').isAndroid) {
      return children
    }
  }
};

var frames = new Map();

function setFrame(id, frame) {
  return frames.set(id, frame)
}

function deleteFrame(id) {
  return frames.delete(id)
}

var frame = {
  props: {
    id: {
      default: 'default'
    },
    transition: {
      type: [String, Object],
      required: false,
      default: null
    },
    'ios:transition': {
      type: [String, Object],
      required: false,
      default: null
    },
    'android:transition': {
      type: [String, Object],
      required: false,
      default: null
    },
    clearHistory: {
      type: Boolean,
      required: false,
      default: false
    },
    backstackVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    // injected by the template compiler
    hasRouterView: {
      default: false
    }
  },
  data: function data() {
    return {
      properties: {}
    }
  },
  created: function created() {
    this.properties = Object.assign({}, this.$attrs, this.$props);

    setFrame(this.properties.id, this);
  },
  destroyed: function destroyed() {
    deleteFrame(this.properties.id);
  },
  render: function render(h) {
    var vnode = null;

    // Render slot to ensure default page is displayed
    if (this.$slots.default) {
      if (
        process.env.NODE_ENV !== 'production' &&
        this.$slots.default.length > 1
      ) {
        debug.warn(
          "The <Frame> element can only have a single child element, that is the defaultPage."
        );
      }
      vnode = this.$slots.default[0];
      vnode.key = 'default';
    }

    return h(
      'NativeFrame',
      {
        attrs: this.properties,
        on: this.$listeners
      },
      [vnode]
    )
  },
  methods: {
    _getFrame: function _getFrame() {
      return this.$el.nativeView
    },

    _ensureTransitionObject: function _ensureTransitionObject(transition) {
      if (typeof transition === 'string') {
        return { name: transition }
      }
      return transition
    },

    _composeTransition: function _composeTransition(entry) {
      var isAndroid = require('tns-core-modules/platform').isAndroid;
      var platformEntryProp = "transition" + (isAndroid ? 'Android' : 'iOS');
      var entryProp = entry[platformEntryProp]
        ? platformEntryProp
        : 'transition';
      var platformProp = (isAndroid ? 'android' : 'ios') + ":transition";
      var prop = this[platformProp] ? platformProp : 'transition';

      if (entry[entryProp]) {
        entry[entryProp] = this._ensureTransitionObject(entry[entryProp]);
      } else if (this[prop]) {
        entry[entryProp] = this._ensureTransitionObject(this[prop]);
      }

      return entry
    },

    notifyPageMounted: function notifyPageMounted(pageVm) {
      var this$1 = this;

      var options = {
        backstackVisible: this.backstackVisible,
        clearHistory: this.clearHistory,
        create: function () { return pageVm.$el.nativeView; }
      };

      this.$nextTick(function () {
        if (pageVm.$el.nativeView.__isNavigatedTo) {
          // Ignore pages we've navigated to, since they are already on screen
          return
        }

        this$1.navigate(options);
      });
    },

    navigate: function navigate(entry, back) {
      var this$1 = this;
      if ( back === void 0 ) back = false;

      var frame = this._getFrame();

      if (back) {
        return frame.goBack(entry)
      }

      // resolve the page from the entry and attach a navigatedTo listener
      // to fire the frame events
      var page = entry.create();
      page.once('navigatedTo', function () {
        this$1.$emit('navigated', entry);
      });

      var handler = function (args) {
        if (args.isBackNavigation) {
          page.off('navigatedFrom', handler);

          this$1.$emit('navigatedBack', entry);
        }
      };
      page.on('navigatedFrom', handler);

      entry.create = function () { return page; };

      this._composeTransition(entry);
      frame.navigate(entry);
    },

    back: function back(backstackEntry) {
      if ( backstackEntry === void 0 ) backstackEntry = null;

      this.navigate(backstackEntry, true);
    }
  }
};

var ios = {
  functional: true,
  render: function render(h, ref) {
    var children = ref.children;

    if (require('tns-core-modules/platform').isIOS) {
      return children
    }
  }
};

function updateAttrs(oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = util.extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      elm.setAttribute(key, cur);
    }
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      elm.setAttribute(key);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

function updateClass(oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    !data.staticClass &&
    !data.class &&
    (!oldData || (!oldData.staticClass && !oldData.class))
  ) {
    return
  }

  var cls = index$1.genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (transitionClass) {
    cls = index$1.concat(cls, index$1.stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var class_$1 = {
  create: updateClass,
  update: updateClass
};

var target;

function add(event, handler, once, capture) {
  if (capture) {
    console.log('bubble phase not supported');
    return
  }
  if (once) {
    var oldHandler = handler;
    handler = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var res = oldHandler.call.apply(oldHandler, [ null ].concat( args ));
      if (res !== null) {
        remove(event, null, null, target);
      }
    };
  }
  target.addEventListener(event, handler);
}

function remove(event, handler, capture, _target) {
  if ( _target === void 0 ) _target = target;

  _target.removeEventListener(event);
}

function updateDOMListeners(oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target = vnode.elm;
  updateListeners.updateListeners(on, oldOn, add, remove, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

var normalize$1 = util.cached(util.camelize);

function createStyle(oldVnode, vnode) {
  // console.log(`\t\t ===> createStyle(${oldVnode}, ${vnode})`)
  if (!vnode.data.staticStyle) {
    updateStyle(oldVnode, vnode);
    return
  }
  var elm = vnode.elm;
  var staticStyle = vnode.data.staticStyle;
  for (var name in staticStyle) {
    if (staticStyle[name]) {
      elm.setStyle(normalize$1(name), staticStyle[name]);
    }
  }
  updateStyle(oldVnode, vnode);
}

function updateStyle(oldVnode, vnode) {
  if (!oldVnode.data.style && !vnode.data.style) {
    return
  }
  var cur, name;
  var elm = vnode.elm;
  var oldStyle = oldVnode.data.style || {};
  var style = vnode.data.style || {};

  var needClone = style.__ob__;

  // handle array syntax
  if (Array.isArray(style)) {
    style = vnode.data.style = toObject(style);
  }

  // clone the style for future updates,
  // in case the user mutates the style object in-place.
  if (needClone) {
    style = vnode.data.style = util.extend({}, style);
  }

  for (name in oldStyle) {
    if (!style[name]) {
      elm.setStyle(normalize$1(name), '');
    }
  }
  for (name in style) {
    cur = style[name];
    elm.setStyle(normalize$1(name), cur);
  }
}

function toObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      util.extend(res, arr[i]);
    }
  }
  return res
}

var style$1 = {
  create: createStyle,
  update: updateStyle
};

function enter(vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (util.isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = transitionUtil.resolveTransition(vnode.data.transition);

  if (util.isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (util.isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = lifecycle.activeInstance;
  var transitionNode = lifecycle.activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass ? appearClass : enterClass;
  var activeClass =
    isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
  var toClass = isAppear && appearToClass ? appearToClass : enterToClass;

  var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
  var enterHook = isAppear
    ? typeof appear === 'function'
      ? appear
      : enter
    : enter;
  var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
  var enterCancelledHook = isAppear
    ? appearCancelled || enterCancelled
    : enterCancelled;

  var explicitEnterDuration = util.toNumber(
    util.isObject(duration) ? duration.enter : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = (el._enterCb = util.once(function () {
    if (expectsCSS) {
      transitionUtil.removeTransitionClass(el, toClass);
      transitionUtil.removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        transitionUtil.removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  }));

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    index$3.mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode =
        parent && parent._pending && parent._pending[vnode.key];
      if (
        pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    transitionUtil.addTransitionClass(el, startClass);
    transitionUtil.addTransitionClass(el, activeClass);
    transitionUtil.nextFrame(function () {
      transitionUtil.removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        transitionUtil.addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave(vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (util.isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = transitionUtil.resolveTransition(vnode.data.transition);
  if (util.isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (util.isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = util.toNumber(
    util.isObject(duration) ? duration.leave : duration
  );

  if (process.env.NODE_ENV !== 'production' && util.isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = (el._leaveCb = util.once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      transitionUtil.removeTransitionClass(el, leaveToClass);
      transitionUtil.removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        transitionUtil.removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  }));

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave() {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
(el.parentNode._pending || (el.parentNode._pending = {}))[
        vnode.key
      ] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      transitionUtil.addTransitionClass(el, leaveClass);
      transitionUtil.addTransitionClass(el, leaveActiveClass);
      transitionUtil.nextFrame(function () {
        transitionUtil.removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          transitionUtil.addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration(val, name, vnode) {
  if (typeof val !== 'number') {
    index$2.warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
        "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    index$2.warn(
      "<transition> explicit " + name + " duration is NaN - " +
        'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration(val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength(fn) {
  if (util.isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (util.isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns) ? invokerFns[0] : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter(_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = {
  create: _enter,
  activate: _enter,
  remove: function remove(vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
};

var platformModules = [attrs, class_$1, events, style$1, transition];

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

function isObjectObject(o) {
  return isobject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

var isPlainObject = function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) { return false; }

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') { return false; }

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) { return false; }

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

function set(target, path, value, options) {
  if (!isObject(target)) {
    return target;
  }

  var opts = options || {};
  var isArray = Array.isArray(path);
  if (!isArray && typeof path !== 'string') {
    return target;
  }

  var merge = opts.merge;
  if (merge && typeof merge !== 'function') {
    merge = Object.assign;
  }

  var keys = (isArray ? path : split(path, opts)).filter(isValidKey);
  var len = keys.length;
  var orig = target;

  if (!options && keys.length === 1) {
    result(target, keys[0], value, merge);
    return target;
  }

  for (var i = 0; i < len; i++) {
    var prop = keys[i];

    if (!isObject(target[prop])) {
      target[prop] = {};
    }

    if (i === len - 1) {
      result(target, prop, value, merge);
      break;
    }

    target = target[prop];
  }

  return orig;
}

function result(target, path, value, merge) {
  if (merge && isPlainObject(target[path]) && isPlainObject(value)) {
    target[path] = merge({}, target[path], value);
  } else {
    target[path] = value;
  }
}

function split(path, options) {
  var id = createKey(path, options);
  if (set.memo[id]) { return set.memo[id]; }

  var char = (options && options.separator) ? options.separator : '.';
  var keys = [];
  var res = [];

  if (options && typeof options.split === 'function') {
    keys = options.split(path);
  } else {
    keys = path.split(char);
  }

  for (var i = 0; i < keys.length; i++) {
    var prop = keys[i];
    while (prop && prop.slice(-1) === '\\' && keys[i + 1]) {
      prop = prop.slice(0, -1) + char + keys[++i];
    }
    res.push(prop);
  }
  set.memo[id] = res;
  return res;
}

function createKey(pattern, options) {
  var id = pattern;
  if (typeof options === 'undefined') {
    return id + '';
  }
  var keys = Object.keys(options);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    id += ';' + key + '=' + String(options[key]);
  }
  return id;
}

function isValidKey(key) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}

function isObject(val) {
  return val !== null && (typeof val === 'object' || typeof val === 'function');
}

set.memo = {};
var setValue = set;

function isView(view) {
  return view instanceof require('tns-core-modules/ui/core/view').View
}

function isLayout(view) {
  return (
    view instanceof
    require('tns-core-modules/ui/layouts/layout-base').LayoutBase
  )
}

function isContentView(view) {
  return view instanceof require('tns-core-modules/ui/content-view').ContentView
}

function insertChild(parentNode, childNode, atIndex) {
  if ( atIndex === void 0 ) atIndex = -1;

  if (!parentNode) {
    return
  }

  if (parentNode.meta && typeof parentNode.meta.insertChild === 'function') {
    return parentNode.meta.insertChild(parentNode, childNode, atIndex)
  }

  if (childNode.meta.skipAddToDom) {
    return
  }

  var parentView = parentNode.nativeView;
  var childView = childNode.nativeView;

  if (isLayout(parentView)) {
    if (childView.parent === parentView) {
      var index = parentView.getChildIndex(childView);
      if (index !== -1) {
        parentView.removeChild(childView);
      }
    }
    if (atIndex !== -1) {
      parentView.insertChild(childView, atIndex);
    } else {
      parentView.addChild(childView);
    }
  } else if (isContentView(parentView)) {
    if (childNode.nodeType === 8) {
      parentView._addView(childView, atIndex);
    } else {
      parentView.content = childView;
    }
  } else if (parentView && parentView._addChildFromBuilder) {
    parentView._addChildFromBuilder(
      childNode._nativeView.constructor.name,
      childView
    );
  }
}

function removeChild(parentNode, childNode) {
  if (!parentNode) {
    return
  }

  if (parentNode.meta && typeof parentNode.meta.removeChild === 'function') {
    return parentNode.meta.removeChild(parentNode, childNode)
  }

  if (childNode.meta.skipAddToDom) {
    return
  }

  var parentView = parentNode.nativeView;
  var childView = childNode.nativeView;

  if (isLayout(parentView)) {
    parentView.removeChild(childView);
  } else if (isContentView(parentView)) {
    if (parentView.content === childView) {
      parentView.content = null;
    }

    if (childNode.nodeType === 8) {
      parentView._removeView(childView);
    }
  } else if (isView(parentView)) {
    parentView._removeView(childView);
  }
}

var XML_ATTRIBUTES = Object.freeze([
  'style',
  'rows',
  'columns',
  'fontAttributes'
]);

var ViewNode = function ViewNode() {
  this.nodeType = null;
  this._tagName = null;
  this.parentNode = null;
  this.childNodes = [];
  this.prevSibling = null;
  this.nextSibling = null;

  this._ownerDocument = null;
  this._nativeView = null;
  this._meta = null;

  /* istanbul ignore next
   * make vue happy :)
   */
  this.hasAttribute = this.removeAttribute = function () { return false; };
};

var prototypeAccessors = { tagName: { configurable: true },firstChild: { configurable: true },lastChild: { configurable: true },nativeView: { configurable: true },meta: { configurable: true },ownerDocument: { configurable: true } };

/* istanbul ignore next */
ViewNode.prototype.toString = function toString () {
  return ((this.constructor.name) + "(" + (this.tagName) + ")")
};

prototypeAccessors.tagName.set = function (name) {
  this._tagName = normalizeElementName(name);
};

prototypeAccessors.tagName.get = function () {
  return this._tagName
};

prototypeAccessors.firstChild.get = function () {
  return this.childNodes.length ? this.childNodes[0] : null
};

prototypeAccessors.lastChild.get = function () {
  return this.childNodes.length
    ? this.childNodes[this.childNodes.length - 1]
    : null
};

prototypeAccessors.nativeView.get = function () {
  return this._nativeView
};

prototypeAccessors.nativeView.set = function (view) {
  if (this._nativeView) {
    throw new Error("Can't override native view.")
  }

  this._nativeView = view;
};

prototypeAccessors.meta.get = function () {
  if (this._meta) {
    return this._meta
  }

  return (this._meta = getViewMeta(this.tagName))
};

/* istanbul ignore next */
prototypeAccessors.ownerDocument.get = function () {
  if (this._ownerDocument) {
    return this._ownerDocument
  }

  var el = this;
  while ((el = el.parentNode).nodeType !== 9) {
    // do nothing
  }

  return (this._ownerDocument = el)
};

ViewNode.prototype.getAttribute = function getAttribute (key) {
  return this.nativeView[key]
};

/* istanbul ignore next */
ViewNode.prototype.setAttribute = function setAttribute (key, value) {
  var ref = require('tns-core-modules/platform');
    var isAndroid = ref.isAndroid;
    var isIOS = ref.isIOS;
  var nv = this.nativeView;

  try {
    if (XML_ATTRIBUTES.indexOf(key) !== -1) {
      nv[key] = value;
    } else {
      // detect expandable attrs for boolean values
      // See https://vuejs.org/v2/guide/components-props.html#Passing-a-Boolean
      if (
        require('tns-core-modules/utils/types').isBoolean(nv[key]) &&
        value === ''
      ) {
        value = true;
      }

      if (isAndroid && key.startsWith('android:')) {
        setValue(nv, key.substr(8), value);
      } else if (isIOS && key.startsWith('ios:')) {
        setValue(nv, key.substr(4), value);
      } else if (key.endsWith('.decode')) {
        setValue(
          nv,
          key.slice(0, -7),
          require('tns-core-modules/xml').XmlParser._dereferenceEntities(
            value
          )
        );
      } else {
        setValue(nv, key, value);
      }
    }
  } catch (e) {
    // ignore
  }
};

/* istanbul ignore next */
ViewNode.prototype.setStyle = function setStyle (property, value) {
  if (!(value = value.trim()).length) {
    return
  }

  if (property.endsWith('Align')) {
    // NativeScript uses Alignment instead of Align, this ensures that text-align works
    property += 'ment';
  }
  this.nativeView.style[property] = value;
};

/* istanbul ignore next */
ViewNode.prototype.setText = function setText (text) {
  if (this.nodeType === 3) {
    this.parentNode.setText(text);
  } else {
    this.setAttribute('text', text);
  }
};

/* istanbul ignore next */
ViewNode.prototype.addEventListener = function addEventListener (event, handler) {
  this.nativeView.on(event, handler);
};

/* istanbul ignore next */
ViewNode.prototype.removeEventListener = function removeEventListener (event) {
  this.nativeView.off(event);
};

ViewNode.prototype.insertBefore = function insertBefore (childNode, referenceNode) {
  if (!childNode) {
    throw new Error("Can't insert child.")
  }

  // in some rare cases insertBefore is called with a null referenceNode
  // this makes sure that it get's appended as the last child
  if (!referenceNode) {
    return this.appendChild(childNode)
  }

  if (referenceNode.parentNode !== this) {
    throw new Error(
      "Can't insert child, because the reference node has a different parent."
    )
  }

  if (childNode.parentNode && childNode.parentNode !== this) {
    throw new Error(
      "Can't insert child, because it already has a different parent."
    )
  }

  if (childNode.parentNode === this) ;

  var index = this.childNodes.indexOf(referenceNode);

  childNode.parentNode = this;
  childNode.nextSibling = referenceNode;
  childNode.prevSibling = this.childNodes[index - 1];

  referenceNode.prevSibling = childNode;
  this.childNodes.splice(index, 0, childNode);

  insertChild(this, childNode, index);
};

ViewNode.prototype.appendChild = function appendChild (childNode) {
  if (!childNode) {
    throw new Error("Can't append child.")
  }

  if (childNode.parentNode && childNode.parentNode !== this) {
    throw new Error(
      "Can't append child, because it already has a different parent."
    )
  }

  if (childNode.parentNode === this) ;

  childNode.parentNode = this;

  if (this.lastChild) {
    childNode.prevSibling = this.lastChild;
    this.lastChild.nextSibling = childNode;
  }

  this.childNodes.push(childNode);

  insertChild(this, childNode, this.childNodes.length - 1);
};

ViewNode.prototype.removeChild = function removeChild$1 (childNode) {
  if (!childNode) {
    throw new Error("Can't remove child.")
  }

  if (!childNode.parentNode) {
    throw new Error("Can't remove child, because it has no parent.")
  }

  if (childNode.parentNode !== this) {
    throw new Error("Can't remove child, because it has a different parent.")
  }

  childNode.parentNode = null;

  if (childNode.prevSibling) {
    childNode.prevSibling.nextSibling = childNode.nextSibling;
  }

  if (childNode.nextSibling) {
    childNode.nextSibling.prevSibling = childNode.prevSibling;
  }

  // reset the prevSibling and nextSibling. If not, a keep-alived component will
  // still have a filled nextSibling attribute so vue will not
  // insert the node again to the parent. See #220
  childNode.prevSibling = null;
  childNode.nextSibling = null;

  this.childNodes = this.childNodes.filter(function (node) { return node !== childNode; });

  removeChild(this, childNode);
};

Object.defineProperties( ViewNode.prototype, prototypeAccessors );

var VUE_ELEMENT_REF = '__vue_element_ref__';

var ElementNode = /*@__PURE__*/(function (ViewNode) {
  function ElementNode(tagName) {
    ViewNode.call(this);

    this.nodeType = 1;
    this.tagName = tagName;

    var viewClass = getViewClass(tagName);
    this._nativeView = new viewClass();
    this._nativeView[VUE_ELEMENT_REF] = this;
  }

  if ( ViewNode ) ElementNode.__proto__ = ViewNode;
  ElementNode.prototype = Object.create( ViewNode && ViewNode.prototype );
  ElementNode.prototype.constructor = ElementNode;

  ElementNode.prototype.appendChild = function appendChild (childNode) {
    ViewNode.prototype.appendChild.call(this, childNode);

    if (childNode.nodeType === 3) {
      this.setText(childNode.text);
    }
  };

  ElementNode.prototype.insertBefore = function insertBefore (childNode, referenceNode) {
    ViewNode.prototype.insertBefore.call(this, childNode, referenceNode);

    if (childNode.nodeType === 3) {
      this.setText(childNode.text);
    }
  };

  ElementNode.prototype.removeChild = function removeChild (childNode) {
    ViewNode.prototype.removeChild.call(this, childNode);

    if (childNode.nodeType === 3) {
      this.setText('');
    }
  };

  return ElementNode;
}(ViewNode));

var CommentNode = /*@__PURE__*/(function (ElementNode) {
  function CommentNode(text) {
    ElementNode.call(this, 'comment');

    this.nodeType = 8;
    this.text = text;
  }

  if ( ElementNode ) CommentNode.__proto__ = ElementNode;
  CommentNode.prototype = Object.create( ElementNode && ElementNode.prototype );
  CommentNode.prototype.constructor = CommentNode;

  return CommentNode;
}(ElementNode));

var TextNode = /*@__PURE__*/(function (ViewNode) {
  function TextNode(text) {
    ViewNode.call(this);

    this.nodeType = 3;
    this.text = text;

    this._meta = {
      skipAddToDom: true
    };
  }

  if ( ViewNode ) TextNode.__proto__ = ViewNode;
  TextNode.prototype = Object.create( ViewNode && ViewNode.prototype );
  TextNode.prototype.constructor = TextNode;

  TextNode.prototype.setText = function setText (text) {
    this.text = text;
    this.parentNode.setText(text);
  };

  return TextNode;
}(ViewNode));

var DocumentNode = /*@__PURE__*/(function (ViewNode) {
  function DocumentNode() {
    ViewNode.call(this);

    this.nodeType = 9;
    this.documentElement = new ElementNode('document');

    // make static methods accessible via this
    this.createComment = this.constructor.createComment;
    this.createElement = this.constructor.createElement;
    this.createElementNS = this.constructor.createElementNS;
    this.createTextNode = this.constructor.createTextNode;
  }

  if ( ViewNode ) DocumentNode.__proto__ = ViewNode;
  DocumentNode.prototype = Object.create( ViewNode && ViewNode.prototype );
  DocumentNode.prototype.constructor = DocumentNode;

  DocumentNode.createComment = function createComment (text) {
    return new CommentNode(text)
  };

  DocumentNode.createElement = function createElement (tagName) {
    return new ElementNode(tagName)
  };

  DocumentNode.createElementNS = function createElementNS (namespace, tagName) {
    return new ElementNode(namespace + ':' + tagName)
  };

  DocumentNode.createTextNode = function createTextNode (text) {
    return new TextNode(text)
  };

  return DocumentNode;
}(ViewNode));

var isReservedTag = util.makeMap('template', true);

var _Vue;

var canBeLeftOpenTag = function(el) {
  return getViewMeta(el).canBeLeftOpenTag
};

var isUnaryTag = function(el) {
  return getViewMeta(el).isUnaryTag
};

function mustUseProp() {
  // console.log('mustUseProp')
}

function getTagNamespace(el) {
  return getViewMeta(el).tagNamespace
}

var VUE_VERSION = process.env.VUE_VERSION || '2.6.10';
var NS_VUE_VERSION = process.env.NS_VUE_VERSION || '2.5.0-alpha.2';

var infoTrace = util.once(function () {
  console.log(
    "NativeScript-Vue has \"Vue.config.silent\" set to true, to see output logs set it to false."
  );
});

function trace(message) {
  if (_Vue && _Vue.config.silent) {
    return infoTrace()
  }

  console.log(
    ("{NSVue (Vue: " + VUE_VERSION + " | NSVue: " + NS_VUE_VERSION + ")} -> " + message)
  );
}

function updateDevtools() {
  if (global.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    try {
      global.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('flush');
    } catch (err) {
      //
    }
  }
}

var namespaceMap = {};

function createElement(tagName, vnode) {
  trace(("CreateElement(" + tagName + ")"));
  return DocumentNode.createElement(tagName)
}

function createElementNS(namespace, tagName) {
  trace(("CreateElementNS(" + namespace + "#" + tagName + ")"));
  return DocumentNode.createElementNS(namespace, tagName)
}

function createTextNode(text) {
  trace(("CreateTextNode(" + text + ")"));
  return DocumentNode.createTextNode(text)
}

function createComment(text) {
  trace(("CreateComment(" + text + ")"));

  return DocumentNode.createComment(text)
}

function insertBefore(parentNode, newNode, referenceNode) {
  trace(("InsertBefore(" + parentNode + ", " + newNode + ", " + referenceNode + ")"));
  return parentNode.insertBefore(newNode, referenceNode)
}

function removeChild$1(node, child) {
  trace(("RemoveChild(" + node + ", " + child + ")"));
  return node.removeChild(child)
}

function appendChild(node, child) {
  trace(("AppendChild(" + node + ", " + child + ")"));

  return node.appendChild(child)
}

function parentNode(node) {
  trace(("ParentNode(" + node + ") -> " + (node.parentNode)));

  return node.parentNode
}

function nextSibling(node) {
  trace(("NextSibling(" + node + ") -> " + (node.nextSibling)));

  return node.nextSibling
}

function tagName(elementNode) {
  trace(("TagName(" + elementNode + ") -> " + (elementNode.tagName)));

  return elementNode.tagName
}

function setTextContent(node, text) {
  trace(("SetTextContent(" + node + ", " + text + ")"));

  node.setText(text);
}

function setAttribute(node, key, val) {
  trace(("SetAttribute(" + node + ", " + key + ", " + val + ")"));

  node.setAttribute(key, val);
}

function setStyleScope(node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  __proto__: null,
  namespaceMap: namespaceMap,
  createElement: createElement,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild$1,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setAttribute: setAttribute,
  setStyleScope: setStyleScope
});

var modules = platformModules.concat(baseModules);

var patch = patch$1.createPatchFunction({
  nodeOps: nodeOps,
  modules: modules
});

var VUE_VIEW = '__vueVNodeRef__';

var tid = 0;
var vTemplate = {
  props: {
    name: {
      type: String
    },
    if: {
      type: String
    }
  },

  mounted: function mounted() {
    if (!this.$scopedSlots.default) {
      return
    }

    this.$templates = this.$el.parentNode.$templates = this.$parent.$templates =
      this.$parent.$templates || new TemplateBag();
    this.$templates.registerTemplate(
      this.$props.name || (this.$props.if ? ("v-template-" + (tid++)) : 'default'),
      this.$props.if,
      this.$scopedSlots.default
    );
  },

  render: function render(h) {}
};

var TemplateBag = function TemplateBag() {
  this._templateMap = new Map();
};

var prototypeAccessors$1 = { selectorFn: { configurable: true } };

TemplateBag.prototype.registerTemplate = function registerTemplate (name, condition, scopedFn) {
  this._templateMap.set(name, {
    scopedFn: scopedFn,
    conditionFn: this.getConditionFn(condition),
    keyedTemplate: new VueKeyedTemplate(name, scopedFn)
  });
};

prototypeAccessors$1.selectorFn.get = function () {
  var self = this;
  return function templateSelectorFn(item) {
    var iterator = self._templateMap.entries();
    var curr;
    while ((curr = iterator.next().value)) {
      var name = curr[0];
        var conditionFn = curr[1].conditionFn;
      try {
        if (conditionFn(item)) {
          return name
        }
      } catch (err) {}
    }
    return 'default'
  }
};

TemplateBag.prototype.getConditionFn = function getConditionFn (condition) {
  return new Function('ctx', ("with(ctx) { return !!(" + condition + ") }"))
};

TemplateBag.prototype.getKeyedTemplate = function getKeyedTemplate (name) {
  return this._templateMap.get(name).keyedTemplate
};

TemplateBag.prototype.patchTemplate = function patchTemplate (name, context, oldVnode) {
  var vnode = this._templateMap.get(name).scopedFn(context);
  // in 2.6 scopedFn returns an array!
  if (Array.isArray(vnode)) {
    vnode = vnode[0];
  }

  var nativeView = patch(oldVnode, vnode).nativeView;
  nativeView[VUE_VIEW] = vnode;

  return nativeView
};

TemplateBag.prototype.getAvailable = function getAvailable () {
  return Array.from(this._templateMap.keys())
};

TemplateBag.prototype.getKeyedTemplates = function getKeyedTemplates () {
  return Array.from(this._templateMap.values()).map(
    function (ref) {
        var keyedTemplate = ref.keyedTemplate;

        return keyedTemplate;
    }
  )
};

Object.defineProperties( TemplateBag.prototype, prototypeAccessors$1 );

var VueKeyedTemplate = function VueKeyedTemplate(key, scopedFn) {
  this._key = key;
  this._scopedFn = scopedFn;
};

var prototypeAccessors$1$1 = { key: { configurable: true } };

prototypeAccessors$1$1.key.get = function () {
  return this._key
};

VueKeyedTemplate.prototype.createView = function createView () {
  // we are returning null because we don't have the data here
  // the view will be created in the `patchTemplate` method above.
  // see https://github.com/nativescript-vue/nativescript-vue/issues/229#issuecomment-390330474
  return null
};

Object.defineProperties( VueKeyedTemplate.prototype, prototypeAccessors$1$1 );

var listView = {
  props: {
    items: {
      type: [Array, Object],
      validator: function (val) {
        var ObservableArray = require('tns-core-modules/data/observable-array')
          .ObservableArray;
        return Array.isArray(val) || val instanceof ObservableArray
      },
      required: true
    },
    '+alias': {
      type: String,
      default: 'item'
    },
    '+index': {
      type: String
    }
  },

  template: "\n    <NativeListView\n      ref=\"listView\"\n      :items=\"items\"\n      v-bind=\"$attrs\"\n      v-on=\"listeners\"\n      @itemTap=\"onItemTap\"\n      @itemLoading=\"onItemLoading\"\n    >\n      <slot />\n    </NativeListView>\n  ",

  watch: {
    items: {
      handler: function handler(newVal) {
        this.$refs.listView.setAttribute('items', newVal);
        this.refresh();
      },
      deep: true
    }
  },

  created: function created() {
    // we need to remove the itemTap handler from a clone of the $listeners
    // object because we are emitting the event ourselves with added data.
    var listeners = util.extend({}, this.$listeners);
    delete listeners.itemTap;
    this.listeners = listeners;

    this.getItemContext = getItemContext.bind(this);
  },

  mounted: function mounted() {
    var this$1 = this;

    if (!this.$templates) {
      return
    }

    this.$refs.listView.setAttribute(
      '_itemTemplatesInternal',
      this.$templates.getKeyedTemplates()
    );
    this.$refs.listView.setAttribute('_itemTemplateSelector', function (item, index) {
      return this$1.$templates.selectorFn(this$1.getItemContext(item, index))
    });
  },

  methods: {
    onItemTap: function onItemTap(args) {
      this.$emit('itemTap', util.extend({ item: this.getItem(args.index) }, args));
    },
    onItemLoading: function onItemLoading(args) {
      if (!this.$templates) {
        return
      }

      var index = args.index;
      var items = args.object.items;

      var currentItem = this.getItem(index);

      var name = args.object._itemTemplateSelector(currentItem, index, items);
      var context = this.getItemContext(currentItem, index);
      var oldVnode = args.view && args.view[VUE_VIEW];

      args.view = this.$templates.patchTemplate(name, context, oldVnode);
    },
    refresh: function refresh() {
      this.$refs.listView.nativeView.refresh();
    },
    getItem: function getItem(idx) {
      return typeof this.items.getItem === 'function'
        ? this.items.getItem(idx)
        : this.items[idx]
    }
  }
};

function getItemContext(
  item,
  index,
  alias,
  index_alias
) {
  var obj;

  if ( alias === void 0 ) alias = this.$props['+alias'];
  if ( index_alias === void 0 ) index_alias = this.$props['+index'];
  return ( obj = {}, obj[alias] = item, obj[index_alias || '$index'] = index, obj.$even = index % 2 === 0, obj.$odd = index % 2 !== 0, obj )
}

var PAGE_REF = '__vuePageRef__';

var page = {
  render: function render(h) {
    return h(
      'NativePage',
      {
        attrs: this.$attrs,
        on: this.$listeners
      },
      this.$slots.default
    )
  },
  mounted: function mounted() {
    var this$1 = this;

    this.$el.nativeView[PAGE_REF] = this;

    var frame = this._findParentFrame();

    if (frame) {
      frame.notifyPageMounted(this);
    }

    var handler = function (e) {
      if (e.isBackNavigation) {
        this$1.$el.nativeView.off('navigatedFrom', handler);
        this$1.$parent.$destroy();
      }
    };

    this.$el.nativeView.on('navigatedFrom', handler);

    // ensure that the parent vue instance is destroyed when the
    // page is disposed (clearHistory: true for example)
    var dispose = this.$el.nativeView.disposeNativeView;
    this.$el.nativeView.disposeNativeView = function () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      this$1.$parent.$destroy();
      dispose.call(this$1.$el.nativeView, args);
      updateDevtools();
    };
  },
  methods: {
    _findParentFrame: function _findParentFrame() {
      var frame = this.$parent;

      while (frame && frame.$options.name !== 'Frame') {
        frame = frame.$parent;
      }

      return frame
    }
  }
};

var tabView = {
  model: {
    prop: 'selectedIndex',
    event: 'selectedIndexChange'
  },

  render: function render(h) {
    return h(
      'NativeTabView',
      {
        on: this.$listeners,
        attrs: this.$attrs
      },
      this.$slots.default
    )
  },

  methods: {
    registerTab: function registerTab(tabView) {
      var items = this.$el.nativeView.items || [];

      this.$el.setAttribute('items', items.concat([tabView]));
    }
  }
};

var tabViewItem = {
  template: "<NativeTabViewItem><slot /></NativeTabViewItem>",

  mounted: function mounted() {
    if (this.$el.childNodes.length > 1) {
      debug.warn('TabViewItem should contain only 1 root element', this);
    }

    var _nativeView = this.$el.nativeView;
    _nativeView.view = this.$el.childNodes[0].nativeView;
    this.$parent.registerTab(_nativeView);
  }
};

var bottomNavigation = {
  model: {
    prop: 'selectedIndex',
    event: 'selectedIndexChange'
  },

  render: function render(h) {
    return h(
      'NativeBottomNavigation',
      {
        on: this.$listeners,
        attrs: this.$attrs
      },
      this.$slots.default
    )
  },

  methods: {
    registerTabStrip: function registerTabStrip(tabStrip) {
      this.$el.setAttribute('tabStrip', tabStrip);
    },
    registerTabContentItem: function registerTabContentItem(tabContentItem) {
      var items = this.$el.nativeView.items || [];

      this.$el.setAttribute('items', items.concat([tabContentItem]));
    }
  }
};

var tabs = {
  model: {
    prop: 'selectedIndex',
    event: 'selectedIndexChange'
  },

  render: function render(h) {
    return h(
      'NativeTabs',
      {
        on: this.$listeners,
        attrs: this.$attrs
      },
      this.$slots.default
    )
  },

  methods: {
    registerTabStrip: function registerTabStrip(tabStrip) {
      this.$el.setAttribute('tabStrip', tabStrip);
    },
    registerTabContentItem: function registerTabContentItem(tabContentItem) {
      var items = this.$el.nativeView.items || [];

      this.$el.setAttribute('items', items.concat([tabContentItem]));
    }
  }
};

var tabStrip = {
  render: function render(h) {
    return h(
      'NativeTabStrip',
      {
        on: this.$listeners,
        attrs: this.$attrs
      },
      this.$slots.default
    )
  },

  mounted: function mounted() {
    var _nativeView = this.$el.nativeView;
    this.$parent.registerTabStrip(_nativeView);
  },

  methods: {
    registerTabStripItem: function registerTabStripItem(tabStripItem) {
      var items = this.$el.nativeView.items || [];

      this.$el.setAttribute('items', items.concat([tabStripItem]));
    }
  }
};

var tabStripItem = {
  template: "<NativeTabStripItem><slot /></NativeTabStripItem>",

  mounted: function mounted() {
    var _nativeView = this.$el.nativeView;
    this.$parent.registerTabStripItem(_nativeView);
  }
};

var tabContentItem = {
  template: "<NativeTabContentItem><slot /></NativeTabContentItem>",

  mounted: function mounted() {
    if (this.$el.childNodes.length > 1) {
      debug.warn('TabContentItem should contain only 1 root element', this);
    }

    var _nativeView = this.$el.nativeView;
    _nativeView.view = this.$el.childNodes[0].nativeView;
    this.$parent.registerTabContentItem(_nativeView);
  }
};

var elementMap = {};
var nativeRegExp = /Native/gi;
var dashRegExp = /-/g;

var defaultViewMeta = {
  skipAddToDom: false,
  isUnaryTag: false,
  tagNamespace: '',
  canBeLeftOpenTag: false,
  model: null,
  component: null
};

function normalizeElementName(elementName) {
  return ("native" + (elementName
    .replace(nativeRegExp, '')
    .replace(dashRegExp, '')
    .toLowerCase()))
}

function registerElement(elementName, resolver, meta) {
  var normalizedName = normalizeElementName(elementName);

  meta = Object.assign({}, defaultViewMeta, meta);

  // allow override of elements classes (N ones especially)
  // if (elementMap[normalizedName]) {
  //   throw new Error(`Element for ${elementName} already registered.`)
  // }

  if (!meta.component) {
    // if no Vue component is passed, wrap the simpler vue component
    // which bind the events and attributes to the NS one
    meta.component = {
      functional: true,
      model: meta.model,
      render: function (h, ref) {
        var data = ref.data;
        var children = ref.children;

        return h(normalizedName, data, children)
      }
    };
  }
  meta.component.name = elementName;

  var entry = {
    resolver: resolver,
    meta: meta
  };
  elementMap[normalizedName] = entry;
}

function getViewClass(elementName) {
  var normalizedName = normalizeElementName(elementName);
  var entry = elementMap[normalizedName];

  if (!entry) {
    throw new TypeError(("No known component for element " + elementName + "."))
  }

  try {
    return entry.resolver()
  } catch (e) {
    throw new TypeError(("Could not load view for: " + elementName + ". " + e))
  }
}

function getViewMeta(elementName) {
  var normalizedName = normalizeElementName(elementName);

  var meta = defaultViewMeta;
  var entry = elementMap[normalizedName];

  if (entry && entry.meta) {
    meta = entry.meta;
  }

  return meta
}

function isKnownView(elementName) {
  return elementMap[normalizeElementName(elementName)]
}

registerElement(
  'ActionBar',
  function () { return require('tns-core-modules/ui/action-bar').ActionBar; },
  {
    removeChild: function removeChild(parent, child) {
      try {
        parent.nativeView._removeView(child.nativeView);
      } catch (e) {
        // ignore exception - child is likely already removed/replaced
        // fixes #76
      }
    },
    component: actionBar
  }
);

registerElement(
  'ActionItem',
  function () { return require('tns-core-modules/ui/action-bar').ActionItem; }
);

registerElement('android', null, {
  component: android
});

registerElement('ios', null, {
  component: ios
});

registerElement(
  'ListView',
  function () { return require('tns-core-modules/ui/list-view').ListView; },
  {
    component: listView
  }
);

registerElement(
  'NavigationButton',
  function () { return require('tns-core-modules/ui/action-bar').NavigationButton; }
);

registerElement(
  'TabView',
  function () { return require('tns-core-modules/ui/tab-view').TabView; },
  {
    model: {
      prop: 'selectedIndex',
      event: 'selectedIndexChange'
    },
    component: tabView
  }
);

registerElement(
  'TabViewItem',
  function () { return require('tns-core-modules/ui/tab-view').TabViewItem; },
  {
    skipAddToDom: true,
    component: tabViewItem
  }
);

registerElement(
  'BottomNavigation',
  function () { return require('tns-core-modules/ui/bottom-navigation').BottomNavigation; },
  {
    model: {
      prop: 'selectedIndex',
      event: 'selectedIndexChange'
    },
    component: bottomNavigation
  }
);

registerElement('Tabs', function () { return require('tns-core-modules/ui/tabs').Tabs; }, {
  model: {
    prop: 'selectedIndex',
    event: 'selectedIndexChange'
  },
  component: tabs
});

registerElement(
  'TabStrip',
  function () { return require('tns-core-modules/ui/tab-navigation-base/tab-strip').TabStrip; },
  {
    skipAddToDom: true,
    component: tabStrip
  }
);

registerElement(
  'TabStripItem',
  function () { return require('tns-core-modules/ui/tab-navigation-base/tab-strip-item')
      .TabStripItem; },
  {
    skipAddToDom: true,
    component: tabStripItem
  }
);

registerElement(
  'TabContentItem',
  function () { return require('tns-core-modules/ui/tab-navigation-base/tab-content-item')
      .TabContentItem; },
  {
    skipAddToDom: true,
    component: tabContentItem
  }
);

registerElement('transition', null, {
  component: Transition__default
});

registerElement('v-template', null, {
  component: vTemplate
});

// NS components which uses the automatic registerElement Vue wrapper
// as they do not need any special logic

registerElement('Label', function () { return require('tns-core-modules/ui/label').Label; }, {
  model: {
    prop: 'text',
    event: 'textChange'
  }
});

registerElement(
  'DatePicker',
  function () { return require('tns-core-modules/ui/date-picker').DatePicker; },
  {
    model: {
      prop: 'date',
      event: 'dateChange'
    }
  }
);

registerElement(
  'AbsoluteLayout',
  function () { return require('tns-core-modules/ui/layouts/absolute-layout').AbsoluteLayout; }
);
registerElement(
  'ActivityIndicator',
  function () { return require('tns-core-modules/ui/activity-indicator').ActivityIndicator; }
);
registerElement('Border', function () { return require('tns-core-modules/ui/border').Border; });
registerElement('Button', function () { return require('tns-core-modules/ui/button').Button; });
registerElement(
  'ContentView',
  function () { return require('tns-core-modules/ui/content-view').ContentView; }
);
registerElement(
  'DockLayout',
  function () { return require('tns-core-modules/ui/layouts/dock-layout').DockLayout; }
);
registerElement(
  'GridLayout',
  function () { return require('tns-core-modules/ui/layouts/grid-layout').GridLayout; }
);
registerElement(
  'HtmlView',
  function () { return require('tns-core-modules/ui/html-view').HtmlView; }
);
registerElement('Image', function () { return require('tns-core-modules/ui/image').Image; });
registerElement('img', function () { return require('tns-core-modules/ui/image').Image; });
registerElement(
  'ListPicker',
  function () { return require('tns-core-modules/ui/list-picker').ListPicker; },
  {
    model: {
      prop: 'selectedIndex',
      event: 'selectedIndexChange'
    }
  }
);
registerElement('Page', function () { return require('tns-core-modules/ui/page').Page; }, {
  skipAddToDom: true,
  component: page
});

registerElement(
  'Placeholder',
  function () { return require('tns-core-modules/ui/placeholder').Placeholder; }
);
registerElement(
  'Progress',
  function () { return require('tns-core-modules/ui/progress').Progress; },
  {
    model: {
      prop: 'value',
      event: 'valueChange'
    }
  }
);
registerElement(
  'ProxyViewContainer',
  function () { return require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer; }
);
// registerElement(
//   'Repeater',
//   () => require('tns-core-modules/ui/repeater').Repeater
// )
registerElement(
  'ScrollView',
  function () { return require('tns-core-modules/ui/scroll-view').ScrollView; }
);
registerElement(
  'SearchBar',
  function () { return require('tns-core-modules/ui/search-bar').SearchBar; },
  {
    model: {
      prop: 'text',
      event: 'textChange'
    }
  }
);
registerElement(
  'SegmentedBar',
  function () { return require('tns-core-modules/ui/segmented-bar').SegmentedBar; },
  {
    model: {
      prop: 'selectedIndex',
      event: 'selectedIndexChange'
    }
  }
);
registerElement(
  'SegmentedBarItem',
  function () { return require('tns-core-modules/ui/segmented-bar').SegmentedBarItem; }
);
registerElement('Slider', function () { return require('tns-core-modules/ui/slider').Slider; }, {
  model: {
    prop: 'value',
    event: 'valueChange'
  }
});
registerElement(
  'StackLayout',
  function () { return require('tns-core-modules/ui/layouts/stack-layout').StackLayout; }
);
registerElement(
  'FlexboxLayout',
  function () { return require('tns-core-modules/ui/layouts/flexbox-layout').FlexboxLayout; }
);
registerElement('Switch', function () { return require('tns-core-modules/ui/switch').Switch; }, {
  model: {
    prop: 'checked',
    event: 'checkedChange'
  }
});

registerElement(
  'TextField',
  function () { return require('tns-core-modules/ui/text-field').TextField; },
  {
    model: {
      prop: 'text',
      event: 'textChange'
    }
  }
);
registerElement(
  'TextView',
  function () { return require('tns-core-modules/ui/text-view').TextView; },
  {
    model: {
      prop: 'text',
      event: 'textChange'
    }
  }
);
registerElement(
  'TimePicker',
  function () { return require('tns-core-modules/ui/time-picker').TimePicker; },
  {
    model: {
      prop: 'time',
      event: 'timeChange'
    }
  }
);
registerElement(
  'WebView',
  function () { return require('tns-core-modules/ui/web-view').WebView; }
);
registerElement(
  'WrapLayout',
  function () { return require('tns-core-modules/ui/layouts/wrap-layout').WrapLayout; }
);
registerElement(
  'FormattedString',
  function () { return require('tns-core-modules/text/formatted-string').FormattedString; }
);
registerElement('Span', function () { return require('tns-core-modules/text/span').Span; });

registerElement(
  'DetachedContainer',
  function () { return require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer; },
  {
    skipAddToDom: true
  }
);
registerElement(
  'DetachedText',
  function () { return require('tns-core-modules/ui/placeholder').Placeholder; },
  {
    skipAddToDom: true
  }
);
registerElement(
  'Comment',
  function () { return require('tns-core-modules/ui/placeholder').Placeholder; }
);

registerElement(
  'Document',
  function () { return require('tns-core-modules/ui/proxy-view-container').ProxyViewContainer; },
  {
    skipAddToDom: true
  }
);

registerElement('Frame', function () { return require('tns-core-modules/ui/frame').Frame; }, {
  insertChild: function insertChild(parentNode, childNode, atIndex) {
    // if (normalizeElementName(childNode.tagName) === 'nativepage') {
    // parentNode.nativeView.navigate({ create: () => childNode.nativeView })
    // }
  },
  component: frame
});

function preTransformNode(el) {
  var vfor;

  if (normalizeElementName(el.tag) === 'nativelistview') {
    vfor = helpers.getAndRemoveAttr(el, 'v-for');
    delete el.attrsMap['v-for'];
    if (process.env.NODE_ENV !== 'production' && vfor) {
      debug.warn(
        "The v-for directive is not supported on a " + (el.tag) + ", " +
          'Use the "for" attribute instead. For example, instead of ' +
          "<" + (el.tag) + " v-for=\"" + vfor + "\"> use <" + (el.tag) + " for=\"" + vfor + "\">."
      );
    }
  }

  var exp = helpers.getAndRemoveAttr(el, 'for') || vfor;
  if (!exp) { return }

  var res = index$4.parseFor(exp);
  if (!res) {
    if (process.env.NODE_ENV !== 'production') {
      debug.warn(("Invalid for expression: " + exp));
    }
    return
  }

  helpers.addRawAttr(el, ':items', res.for);
  helpers.addRawAttr(el, '+alias', res.alias);

  if (res.iterator1) {
    helpers.addRawAttr(el, '+index', res.iterator1);
  }
}

var for_ = {
  preTransformNode: preTransformNode
};

function preTransformNode$1(el) {
  if (el.tag !== 'router-view') { return }
  if (
    el.parent &&
    el.parent.tag &&
    normalizeElementName(el.parent.tag) === 'nativeframe'
  ) {
    helpers.addAttr(el.parent, 'hasRouterView', 'true');
  }
}

var router = {
  preTransformNode: preTransformNode$1
};

function preTransformNode$2(el) {
  if (el.parent && el.parent.tag === 'v-template') {
    var alias = el.parent.parent.attrsMap['+alias'] || 'item';
    var index = el.parent.parent.attrsMap['+index'] || '$index';
    el.slotScope = buildScopeString(alias, index);
  }
}

var vTemplate$1 = {
  preTransformNode: preTransformNode$2
};

function buildScopeString(alias, index) {
  return ("{ " + alias + ", " + index + ", $even, $odd }")
}

// transforms ~test -> v-view:test
function transformNode$2(el) {
  var attr = Object.keys(el.attrsMap).find(function (attr) { return attr.startsWith('~'); });

  if (attr) {
    var attrName = attr.substr(1);
    var ref = attrName.split('.');
    var arg = ref[0];
    var modifiers = ref.slice(1);
    modifiers = modifiers.reduce(function (mods, mod) {
      mods[mod] = true;
      return mods
    }, {});
    helpers.getAndRemoveAttr(el, attr, true);
    helpers.addDirective(el, 'view', ("v-view:" + attrName), '', arg, false, modifiers);
  }
}

var view = {
  transformNode: transformNode$2
};

var modules$1 = [class_, style, vTemplate$1, for_, router, view];

function model(el, dir) {
  if (el.type === 1 && isKnownView(el.tag)) {
    genDefaultModel(el, dir.value, dir.modifiers);
  } else {
    model$1.genComponentModel(el, dir.value, dir.modifiers);
  }
}

function genDefaultModel(el, value, modifiers) {
  var ref = modifiers || {};
  var trim = ref.trim;
  var number = ref.number;
  var ref$1 = getViewMeta(el.tag).model;
  var prop = ref$1.prop;
  var event = ref$1.event;

  var valueExpression = "$event.value" + (trim ? '.trim()' : '');

  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = model$1.genAssignmentCode(value, valueExpression);

  helpers.addAttr(el, prop, ("(" + value + ")"));
  helpers.addHandler(el, event, code, null, true);
}

var directives = {
  model: model
};

var baseOptions = {
  modules: modules$1,
  directives: directives,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  preserveWhitespace: false,
  staticKeys: util.genStaticKeys(modules$1)
};

var ref = index.createCompiler(baseOptions);
var compile = ref.compile;
var compileToFunctions = ref.compileToFunctions;

exports.compile = compile;
exports.compileToFunctions = compileToFunctions;
exports.parseComponent = parseComponent;
exports.registerElement = registerElement;
