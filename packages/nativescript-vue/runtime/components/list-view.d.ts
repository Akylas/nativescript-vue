declare const _default: {
    props: {
        items: {
            type: ArrayConstructor;
            required: boolean;
        };
        '+alias': {
            type: StringConstructor;
            default: string;
        };
        '+index': {
            type: StringConstructor;
        };
    };
    template: string;
    watch: {
        items: {
            handler(newVal: any): void;
            deep: boolean;
        };
    };
    created(): void;
    mounted(): void;
    methods: {
        onItemTap(args: any): void;
        onItemLoading(args: any): void;
        refresh(): void;
    };
};
export default _default;
