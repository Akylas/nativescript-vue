declare const _default: ({
    create: (oldVnode: any, vnode: any) => void;
    update: (oldVnode: any, vnode: any) => void;
} | {
    create: (_: any, vnode: any) => void;
    activate: (_: any, vnode: any) => void;
    remove(vnode: any, rm: any): void;
})[];
export default _default;
