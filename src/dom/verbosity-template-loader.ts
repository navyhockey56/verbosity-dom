import { VerbosityTemplate } from "../template/verbosity-template";
import { VerbosityTemplateLoadOptions } from "./verbosity-template-load-options";

export interface MountConfiguration {
  templateMountReference : string;
  mountToElement : HTMLElement;
}

export interface LoadedTemplateDefinition<T extends HTMLElement> {
  verbosityTemplate     : VerbosityTemplate<T>;
  htmlElement           : T;

  template_replacements : MountConfiguration[];
  template_child        : MountConfiguration[];
  template_children     : MountConfiguration[];
}


export class VerbosityTemplateLoader {

  loadTemplate<T extends HTMLElement>(
    verbosityTemplate: VerbosityTemplate<T>,
    options?: VerbosityTemplateLoadOptions
  ) : LoadedTemplateDefinition<T> {

    const templateParent = document.createElement('template');

    // Load the component's HTML into the template
    templateParent.innerHTML = verbosityTemplate.readTemplate();

    // Store a reference to the root node of the template to the component
    const template : T = templateParent.content.firstChild as T;
    verbosityTemplate.element = template;

    const template_definition : LoadedTemplateDefinition<T> = {
      verbosityTemplate: verbosityTemplate,
      htmlElement: template,
      template_replacements: [],
      template_child: [],
      template_children: []
    };

    if (verbosityTemplate.hasBindings && verbosityTemplate.hasBindings()) {
      this.attachVbsBindings(template_definition);
    }

    if (!options) return template_definition;
    if (options.id) template.id = options.id;

    return template_definition;
  }

  private attachVbsBindings<T extends HTMLElement>(templateDefinition: LoadedTemplateDefinition<T>) : LoadedTemplateDefinition<T> {
    return this.attachVbsBindingsFor(templateDefinition.htmlElement, templateDefinition);
  }

  private attachVbsBindingsFor<T extends HTMLElement>(
    currentElement : HTMLElement,
    templateDefinition: LoadedTemplateDefinition<T>
  ) : LoadedTemplateDefinition<T> {

    Object.keys(currentElement.dataset).forEach((key : string) => {
      if (key.startsWith('vbsEvent')) {

        this.attachEventListener(key, currentElement, templateDefinition.verbosityTemplate);

      } else if (key === 'vbsAssign') {

        this.bindAssingment(currentElement.dataset[key], currentElement, templateDefinition.verbosityTemplate);

      } if (key === 'vbsReplace') {

        templateDefinition.template_replacements.push(this.mountConfigurationFor(key, currentElement))

      } else if (key === 'vbsChild') {

        templateDefinition.template_child.push(this.mountConfigurationFor(key, currentElement))

      } else if (key === 'vbsChildren') {

        templateDefinition.template_children.push(this.mountConfigurationFor(key, currentElement))

      }
    });

    for (let i = 0; i < currentElement.children.length; i++) {
      const child : any = currentElement.children[i];

      if (child['children'] && child['dataset']) {
        this.attachVbsBindingsFor(child as HTMLElement, templateDefinition);
      }
    }

    return templateDefinition;
  }

  private mountConfigurationFor(bindingKey: string, htmlElement : HTMLElement) : MountConfiguration {
    return {
      templateMountReference: htmlElement.dataset[bindingKey],
      mountToElement: htmlElement
    };
  }

  private attachEventListener(key: string, template: HTMLElement, component: VerbosityTemplate<HTMLElement>) {
    const eventListenerFunctionName = template.dataset[key];
    const eventListener : (event : Event) => void = (component as any)[eventListenerFunctionName];
    if (!eventListener) {
      throw new Error(`Cannot find event listener ${eventListenerFunctionName}`);
    }

    const eventListenerName : string = key.slice(8, key.length).toLocaleLowerCase();
    (template as any)[eventListenerName] = eventListener.bind(component);
  }

  private bindAssingment(fieldName: string, template: HTMLElement, component: VerbosityTemplate<HTMLElement>) {
    (component as any)[fieldName] = template;
  }
}
