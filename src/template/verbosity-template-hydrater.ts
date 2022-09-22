import { VerbosityTemplate } from "./verbosity-template";

/**
 * A VerbosityTemplateHydrater is a function that can be applied to any VerbosityTemplate
 * within your project.
 *
 * Supply a VerbosityTemplateHydrater to your VerbosityDom object and the VerbosityDom
 * will pass each of your VerbosityTemplate's to your VerbosityTemplateHydrater function
 * before the beforeTemplateAdded lifecycle hook is called.
 */
export type VerbosityTemplateHydrater = (template: VerbosityTemplate<HTMLElement>) => any;
