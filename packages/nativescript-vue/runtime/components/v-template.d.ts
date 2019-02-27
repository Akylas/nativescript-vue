export declare const VUE_VIEW = "__vueVNodeRef__";
declare const _default: {
    props: {
        name: {
            type: StringConstructor;
        };
        if: {
            type: StringConstructor;
        };
    };
    mounted(): void;
    render(h: any): void;
};
export default _default;
export declare class TemplateBag {
    _templateMap: Map<any, any>;
    constructor();
    registerTemplate(name: any, condition: any, scopedFn: any): void;
    readonly selectorFn: (item: any) => any;
    getConditionFn(condition: any): Function;
    getKeyedTemplate(name: any): any;
    patchTemplate(name: any, context: any, oldVnode: any): any;
    getAvailable(): any[];
    getKeyedTemplates(): any[];
}
export declare class VueKeyedTemplate {
    _key: any;
    _scopedFn: any;
    constructor(key: any, scopedFn: any);
    readonly key: any;
    createView(): any;
}
