declare const _default: {
    props: {
        id: {
            default: string;
        };
        transition: {
            type: (ObjectConstructor | StringConstructor)[];
            required: boolean;
            default: any;
        };
        'ios:transition': {
            type: (ObjectConstructor | StringConstructor)[];
            required: boolean;
            default: any;
        };
        'android:transition': {
            type: (ObjectConstructor | StringConstructor)[];
            required: boolean;
            default: any;
        };
        hasRouterView: {
            default: boolean;
        };
    };
    data(): {
        properties: {};
    };
    created(): void;
    destroyed(): void;
    render(h: any): any;
    methods: {
        _getFrame(): any;
        _ensureTransitionObject(transition: any): any;
        _composeTransition(entry: any): any;
        notifyPageMounted(pageVm: any): void;
        navigate(entry: any, back?: boolean): any;
        back(backstackEntry?: any): void;
    };
};
export default _default;
