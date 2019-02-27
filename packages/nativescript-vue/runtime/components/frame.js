"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frame_1 = require("../../util/frame");
const platform_1 = require("tns-core-modules/platform");
let idCounter = 1;
exports.default = {
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
        hasRouterView: {
            default: false
        }
    },
    data() {
        return {
            properties: {}
        };
    },
    created() {
        let properties = {};
        if (frame_1.getFrame(this.$props.id)) {
            properties.id = this.$props.id + idCounter++;
        }
        this.properties = Object.assign({}, this.$attrs, this.$props, properties);
        frame_1.setFrame(this.properties.id, this);
    },
    destroyed() {
        frame_1.deleteFrame(this.properties.id);
    },
    render(h) {
        return h('NativeFrame', {
            attrs: this.properties,
            on: this.$listeners
        }, this.$slots.default);
    },
    methods: {
        _getFrame() {
            return this.$el.nativeView;
        },
        _ensureTransitionObject(transition) {
            if (typeof transition === 'string') {
                return { name: transition };
            }
            return transition;
        },
        _composeTransition(entry) {
            const platformEntryProp = `transition${platform_1.isAndroid ? 'Android' : 'iOS'}`;
            const entryProp = entry[platformEntryProp]
                ? platformEntryProp
                : 'transition';
            const platformProp = `${platform_1.isAndroid ? 'android' : 'ios'}:transition`;
            const prop = this[platformProp] ? platformProp : 'transition';
            if (entry[entryProp]) {
                entry[entryProp] = this._ensureTransitionObject(entry[entryProp]);
            }
            else if (this[prop]) {
                entry[entryProp] = this._ensureTransitionObject(this[prop]);
            }
            return entry;
        },
        notifyPageMounted(pageVm) {
            this.$nextTick(() => {
                this.navigate({
                    create: () => pageVm.$el.nativeView
                });
            });
        },
        navigate(entry, back = false) {
            const frame = this._getFrame();
            if (back) {
                return frame.goBack(entry);
            }
            const page = entry.create();
            page.once('navigatedTo', () => {
                this.$emit('navigated', entry);
            });
            const handler = args => {
                if (args.isBackNavigation) {
                    page.off('navigatedFrom', handler);
                    this.$emit('navigatedBack', entry);
                }
            };
            page.on('navigatedFrom', handler);
            entry.create = () => page;
            this._composeTransition(entry);
            frame.navigate(entry);
        },
        back(backstackEntry = null) {
            this.navigate(backstackEntry, true);
        }
    }
};
//# sourceMappingURL=frame.js.map