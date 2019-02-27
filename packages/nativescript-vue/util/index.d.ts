export declare const isReservedTag: any;
export declare function setVue(Vue: any): void;
export declare const canBeLeftOpenTag: (el: any) => boolean;
export declare const isUnaryTag: (el: any) => boolean;
export declare function mustUseProp(): void;
export declare function getTagNamespace(el: any): string;
export declare function isUnknownElement(el: any): boolean;
export declare function isPage(el: any): boolean;
export declare function ensurePage(el: any, vm: any): any;
export declare function query(el: any, renderer: any, document: any): void;
export declare const VUE_VERSION: string;
export declare const NS_VUE_VERSION: string;
export declare function trace(message: any): any;
export declare function before(original: any, thisArg: any, wrap: any): (...args: any[]) => void;
export declare function after(original: any, thisArg: any, wrap: any): (...args: any[]) => void;
export declare function deepProxy(object: any, depth?: number): any;
