declare const _default: ({
    staticKeys: string[];
    transformNode: (el: any, options: any) => void;
    genData: (el: any) => string;
} | {
    preTransformNode: (el: any) => void;
} | {
    transformNode: (el: any) => void;
})[];
export default _default;
