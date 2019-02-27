declare const _default: {
    show: {
        bind(el: any, { value }: {
            value: any;
        }, vnode: any): void;
        update(el: any, { value, oldValue }: {
            value: any;
            oldValue: any;
        }, vnode: any): void;
        unbind(el: any, binding: any, vnode: any, oldVnode: any, isDestroy: any): void;
    };
    view: {
        inserted(el: any, { arg, modifiers }: {
            arg: any;
            modifiers: any;
        }): void;
    };
};
export default _default;
