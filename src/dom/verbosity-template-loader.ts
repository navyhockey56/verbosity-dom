import { VerbosityTemplate } from "../template/verbosity-template";
import { VerbosityTemplateLoadOptions } from "./verbosity-template-load-options";

export class VerbosityTemplateLoader {
  loadTemplate<T extends HTMLElement>(component: VerbosityTemplate<T>, options?: VerbosityTemplateLoadOptions) : T {
    const templateParent = document.createElement('template');
    const htmlContent =  component.readTemplate();
    templateParent.innerHTML = htmlContent;
    const template : T = templateParent.content.firstChild as T;
    component.element = template;

    if (this.hasEventListeners(component) || this.hasAssignments(component)) {
      this.attachVbsBindings(component);
    }

    if (!options) return template;
    if (options.id) template.id = options.id;

    return template;
  }

  private hasAssignments(template : VerbosityTemplate<HTMLElement>) : boolean {
    return template.hasAssignments && template.hasAssignments();
  }

  private hasEventListeners(template : VerbosityTemplate<HTMLElement>) : boolean {
    return template.hasEventListeners && template.hasEventListeners();
  }

  private attachVbsBindings(component: VerbosityTemplate<HTMLElement>) {
    this.attachVbsBindingsFor(component.element, component);
  }

  private attachVbsBindingsFor(template: HTMLElement, component: VerbosityTemplate<HTMLElement>) {
    Object.keys(template.dataset).forEach((key : string) => {
      if (this.hasEventListeners(component) && key.startsWith('vbsEvent')) {
        this.attachEventListener(key, template, component);
      } else if (this.hasAssignments(component) && key === 'vbsAssign') {
        this.bindAssingment(template.dataset[key], template, component)
      }
    });

    for (let i = 0; i < template.children.length; i++) {
      const child : any = template.children[i];
      if (child['children'] && child['dataset']) {
        this.attachVbsBindingsFor(child as HTMLElement, component);
      }
    }
  }

  private attachEventListener(key: string, template: HTMLElement, component: VerbosityTemplate<HTMLElement>) {
    // console.debug('Attaching event listener', key);
    const eventListenerFunctionName = template.dataset[key];
    const eventListener : (event : Event) => void = (component as any)[eventListenerFunctionName];
    if (!eventListener) {
      throw new Error(`Cannot find event listener ${eventListenerFunctionName}`);
    }

    const eventListenerName : string = key.slice(8, key.length).toLocaleLowerCase();
    (template as any)[eventListenerName] = eventListener.bind(component);
  }

  private bindAssingment(fieldName: string, template: HTMLElement, component: VerbosityTemplate<HTMLElement>) {
    // console.debug('Binding for field', fieldName);
    (component as any)[fieldName] = template;
  }
}
