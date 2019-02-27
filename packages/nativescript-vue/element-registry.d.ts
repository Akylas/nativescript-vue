export declare function normalizeElementName(elementName: any): string;
export declare function registerElement(elementName: any, resolver: any, meta?: any): void;
export declare function getElementMap(): any;
export declare function getViewClass(elementName: any): any;
export declare function getViewMeta(elementName: any): {
    skipAddToDom: boolean;
    isUnaryTag: boolean;
    tagNamespace: string;
    canBeLeftOpenTag: boolean;
    model: any;
    component: any;
};
export declare function isKnownView(elementName: any): any;
