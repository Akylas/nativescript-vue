export declare function enter(vnode: any, toggleDisplay?: any): void;
export declare function leave(vnode: any, rm: any): any;
declare function _enter(_: any, vnode: any): void;
declare const _default: {
    create: typeof _enter;
    activate: typeof _enter;
    remove(vnode: any, rm: any): void;
};
export default _default;
