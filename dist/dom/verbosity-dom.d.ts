import { VerbosityTemplate } from "../template/verbosity-template";
import { VerbosityTemplateHydrater } from "../template/verbosity-template-hydrater";
import { VerbosityTemplateLoadOptions } from "./verbosity-template-load-options";
export declare class VerbosityDom {
    private templateHydrater;
    private templateLoader;
    private componentsMap;
    private componentInfoMap;
    constructor(templateHydrater?: VerbosityTemplateHydrater);
    replaceElementWithTemplateById<T extends HTMLElement>(mountId: string, component: VerbosityTemplate<T>, options?: VerbosityTemplateLoadOptions): T;
    /**
     * Replaces the given element with the given Template.
     *
     * @param element The element to replace with the Template
     * @param component The Template to replace the element with
     * @param options Load options to attach to the Template
     * @returns The HTMLElement of the Template
     */
    replaceElementWithTemplate<T extends HTMLElement>(element: HTMLElement, component: VerbosityTemplate<T>, options?: VerbosityTemplateLoadOptions): T;
    replaceTemplateWithElement(component: VerbosityTemplate<HTMLElement>, element: HTMLElement): void;
    replaceTemplateWithTemplate<T extends HTMLElement>(currentVerbosityTemplate: VerbosityTemplate<HTMLElement>, newVerbosityTemplate: VerbosityTemplate<T>, options?: VerbosityTemplateLoadOptions): T;
    appendTemplateToElement<T extends HTMLElement>(element: HTMLElement, verbosityTemplate: VerbosityTemplate<T>, options?: VerbosityTemplateLoadOptions): T;
    appendChildTemplateToElementById<T extends HTMLElement>(mountId: string, parentVerbosityTemplate: VerbosityTemplate<HTMLElement>, childVerbosityTemplate: VerbosityTemplate<T>, options?: VerbosityTemplateLoadOptions): T;
    appendChildTemplateToElement<T extends HTMLElement>(mount: HTMLElement, parentVerbosityTemplate: VerbosityTemplate<HTMLElement>, childVerbosityTemplate: VerbosityTemplate<T>, options?: VerbosityTemplateLoadOptions): T;
    removeTemplate(verbosityTemplate: VerbosityTemplate<HTMLElement>): void;
    removeChildTemplate(parentVerbosityTemplate: VerbosityTemplate<HTMLElement>, childVerbosityTemplate: VerbosityTemplate<HTMLElement>): void;
    removeAllChildren(parentVerbosityTemplate: VerbosityTemplate<HTMLElement>): void;
    private hydrateVerbosityTemplate;
    private recursiveBeforeVerbosityTemplateRemoved;
    private recursiveAfterVerbosityTemplateRemoved;
    private clearVerbosityTemplateFromDom;
}
