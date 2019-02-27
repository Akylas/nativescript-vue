export declare type Attribute = {
    name: string;
    value: string;
};
export interface StartOfSourceMap {
    file?: string;
    sourceRoot?: string;
}
export interface RawSourceMap extends StartOfSourceMap {
    version: string;
    sources: string[];
    names: string[];
    sourcesContent?: string[];
    mappings: string;
}
export interface SFCCustomBlock {
    type: string;
    content: string;
    attrs: {
        [key: string]: string | true;
    };
    start: number;
    end?: number;
    map?: RawSourceMap;
}
export interface SFCBlock extends SFCCustomBlock {
    lang?: string;
    src?: string;
    scoped?: boolean;
    module?: string | boolean;
}
export interface SFCDescriptor {
    template: SFCBlock | null;
    templates: SFCBlock[] | null;
    script: SFCBlock | null;
    scripts: SFCBlock[] | null;
    styles: SFCBlock[];
    customBlocks: SFCCustomBlock[];
}
export declare function parseComponent(content: string, options?: any): SFCDescriptor;
