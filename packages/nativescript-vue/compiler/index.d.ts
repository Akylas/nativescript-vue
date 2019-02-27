import { registerElement } from '../element-registry';
import { mustUseProp, getTagNamespace } from '../util/index';
export declare const baseOptions: {
    modules: ({
        staticKeys: string[];
        transformNode: (el: any, options: any) => void;
        genData: (el: any) => string;
    } | {
        preTransformNode: (el: any) => void;
    } | {
        transformNode: (el: any) => void;
    })[];
    directives: {
        model: typeof import("./directives/model").default;
    };
    isUnaryTag: (el: any) => boolean;
    mustUseProp: typeof mustUseProp;
    canBeLeftOpenTag: (el: any) => boolean;
    isReservedTag: any;
    getTagNamespace: typeof getTagNamespace;
    preserveWhitespace: boolean;
    staticKeys: any;
};
declare const compile: any, compileToFunctions: any;
export { compile, compileToFunctions, registerElement };
