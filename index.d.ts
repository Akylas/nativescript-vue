// import vue.js typings
// import Vue from 'vue';
import { Vue, VueConstructor } from 'vue/types/vue'
import { Page, NavigationEntry } from '@nativescript/core/ui/frame/frame'
import { View } from '@nativescript/core/ui/core/view'
import { ShowModalOptions } from '@nativescript/core/ui/core/view-base'

export interface NavigationEntryVue extends NavigationEntry {
    props?: Record<string, any>
    resolveOnNavigated?:boolean
}

export type navigateTo = (
    component: VueConstructor,
    options?: NavigationEntryVue,
    cb?: () => Page,
) => Promise<Page>;

export interface ModalOptions extends Partial<ShowModalOptions> {
    props?: Record<string, any>;
}

// create a nativescript vue class that extends vue.js
export interface NativeScriptVue<V = View> extends Vue {
    nativeView: V

    $navigateTo: navigateTo
    $navigateBack: () => void

    $modal?: { close: (data?: any) => Promise<typeof data> };

    /**
     * Open a modal using a component
     * @param {typeof Vue} component
     * @param {ModalOptions} options
     * @returns {any}
     */
    $showModal: (component: typeof Vue, options?: ModalOptions) => Promise<any>;

    /**
     * starts the nativescript application
     */
    $start: () => void
}

export interface NativeScriptVueConstructor extends VueConstructor<NativeScriptVue> {
    navigateTo: navigateTo
    navigateBack: () => void
    /**
     * Registers NativeScript Plugin.
     * @param elementName Name of the element to use in your template
     * @param resolver  function to register the element
     * @param meta meta associated with the element
     */
    registerElement: (elementName: string, resolver: Function, meta?: any) => void
}

export const NativeScriptVue: NativeScriptVueConstructor

// export as namespace NativeScriptVue;
export default NativeScriptVue;
