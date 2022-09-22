import { VerbosityTemplate } from "../template/verbosity-template";
import { VerbosityTemplateLoadOptions } from "./verbosity-template-load-options";
export declare class VerbosityTemplateLoader {
    loadTemplate<T extends HTMLElement>(component: VerbosityTemplate<T>, options?: VerbosityTemplateLoadOptions): T;
    private hasAssignments;
    private hasEventListeners;
    private attachVbsBindings;
    private attachVbsBindingsFor;
    private attachEventListener;
    private bindAssingment;
}
