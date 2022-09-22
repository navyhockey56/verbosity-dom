import { VerbosityTemplate } from "../template/verbosity-template";
import { VerbosityTemplateHydrater } from "../template/verbosity-template-hydrater";
import { VerbosityTemplateLoadOptions } from "./verbosity-template-load-options";
import { VerbosityTemplateLoader } from "./verbosity-template-loader";

interface VerbosityTemplateInformation {
  isMountedAsChild: boolean;
  mount?: HTMLElement;
}

export class VerbosityDom {
  private templateHydrater : VerbosityTemplateHydrater;
  private templateLoader : VerbosityTemplateLoader;
  private componentsMap : Map<VerbosityTemplate<HTMLElement>, VerbosityTemplate<HTMLElement>[]>;
  private componentInfoMap : Map<VerbosityTemplate<HTMLElement>, VerbosityTemplateInformation>;

  constructor(templateHydrater?: VerbosityTemplateHydrater) {
    this.templateHydrater = templateHydrater;
    this.componentsMap = new Map();
    this.componentInfoMap = new Map();
    this.templateLoader = new VerbosityTemplateLoader();
  }

  replaceElementWithTemplateById<T extends HTMLElement>(
    mountId: string,
    component: VerbosityTemplate<T>,
    options?: VerbosityTemplateLoadOptions
  ): T {
    const mount: HTMLElement = document.getElementById(mountId);
    if (!mount) {
      throw Error(`Unable to mount to element with ID=${mountId} because the element is not on the page.`)
    }

    return this.replaceElementWithTemplate(mount, component, options);
  }

  /**
   * Replaces the given element with the given Template.
   *
   * @param element The element to replace with the Template
   * @param component The Template to replace the element with
   * @param options Load options to attach to the Template
   * @returns The HTMLElement of the Template
   */
  replaceElementWithTemplate<T extends HTMLElement>(
    element: HTMLElement,
    component: VerbosityTemplate<T>,
    options?: VerbosityTemplateLoadOptions
  ): T {
    this.hydrateVerbosityTemplate(component);
    const template : T = this.templateLoader.loadTemplate(component, options);

    this.componentInfoMap.set(component, { isMountedAsChild: false })
    this.componentsMap.set(component, []);

    if (component.beforeTemplateAdded) component.beforeTemplateAdded();
    element.parentElement.replaceChild(template, element);
    if (component.onTemplateAdded) component.onTemplateAdded();

    return template;
  }

  replaceTemplateWithElement(
    component: VerbosityTemplate<HTMLElement>,
    element : HTMLElement
  ) {
    this.recursiveBeforeVerbosityTemplateRemoved(component);
    const parentElement = component.element.parentElement;
    parentElement.replaceChild(element, component.element);
    this.recursiveAfterVerbosityTemplateRemoved(component);
    this.clearVerbosityTemplateFromDom(component);
  }

  replaceTemplateWithTemplate<T extends HTMLElement>(
    currentVerbosityTemplate: VerbosityTemplate<HTMLElement>,
    newVerbosityTemplate: VerbosityTemplate<T>,
    options?: VerbosityTemplateLoadOptions
  ) : T {
    this.hydrateVerbosityTemplate(newVerbosityTemplate);
    const parentElement = currentVerbosityTemplate.element.parentElement;

    this.recursiveBeforeVerbosityTemplateRemoved(currentVerbosityTemplate);
    const newElement : T = this.templateLoader.loadTemplate(newVerbosityTemplate, options);

    this.componentInfoMap.set(newVerbosityTemplate, { isMountedAsChild: false })
    this.componentsMap.set(newVerbosityTemplate, []);

    if (newVerbosityTemplate.beforeTemplateAdded) newVerbosityTemplate.beforeTemplateAdded();
    parentElement.replaceChild(newElement, currentVerbosityTemplate.element);

    this.recursiveAfterVerbosityTemplateRemoved(currentVerbosityTemplate);
    this.clearVerbosityTemplateFromDom(currentVerbosityTemplate);
    if (newVerbosityTemplate.onTemplateAdded) newVerbosityTemplate.onTemplateAdded();

    return newElement;
  }

  appendTemplateToElement<T extends HTMLElement>(
    element : HTMLElement,
    verbosityTemplate : VerbosityTemplate<T>,
    options?: VerbosityTemplateLoadOptions
  ) : T {
    this.hydrateVerbosityTemplate(verbosityTemplate);
    const template : T = this.templateLoader.loadTemplate(verbosityTemplate, options);

    this.componentInfoMap.set(verbosityTemplate, { isMountedAsChild: false })
    this.componentsMap.set(verbosityTemplate, []);

    if (verbosityTemplate.beforeTemplateAdded) verbosityTemplate.beforeTemplateAdded();
    element.appendChild(template);
    if (verbosityTemplate.onTemplateAdded) verbosityTemplate.onTemplateAdded();

    return template;
  }

  appendChildTemplateToElementById<T extends HTMLElement>(
    mountId: string,
    parentVerbosityTemplate: VerbosityTemplate<HTMLElement>,
    childVerbosityTemplate: VerbosityTemplate<T>,
    options?: VerbosityTemplateLoadOptions
  ): T {
    const mount: HTMLElement = document.getElementById(mountId);
    if (!mount) {
      throw Error(`Unable to append to element with ID=${mountId} because the element is not on the page.`)
    }

    return this.appendChildTemplateToElement(mount, parentVerbosityTemplate, childVerbosityTemplate, options);
  }

  appendChildTemplateToElement<T extends HTMLElement>(
    mount: HTMLElement,
    parentVerbosityTemplate: VerbosityTemplate<HTMLElement>,
    childVerbosityTemplate: VerbosityTemplate<T>,
    options?: VerbosityTemplateLoadOptions
  ): T {
    if (!parentVerbosityTemplate.element.contains(mount)) {
      throw Error(`You cannot append a child to a mount that does not belong to the parent component`);
    }

    const childrenVerbosityTemplates : VerbosityTemplate<HTMLElement>[] = this.componentsMap.get(parentVerbosityTemplate);
    childrenVerbosityTemplates.push(childVerbosityTemplate);
    this.componentsMap.set(childVerbosityTemplate, []);

    this.componentInfoMap.set(childVerbosityTemplate, { isMountedAsChild: true, mount })

    this.hydrateVerbosityTemplate(childVerbosityTemplate);
    const childElement : T = this.templateLoader.loadTemplate(childVerbosityTemplate, options);

    if (childVerbosityTemplate.beforeTemplateAdded) childVerbosityTemplate.beforeTemplateAdded();
    mount.appendChild(childElement);
    if (childVerbosityTemplate.onTemplateAdded) childVerbosityTemplate.onTemplateAdded();

    return childElement;
  }

  removeTemplate(verbosityTemplate : VerbosityTemplate<HTMLElement>) : void {
    this.removeAllChildren(verbosityTemplate);

    if (verbosityTemplate.beforeTemplateRemoved) verbosityTemplate.beforeTemplateRemoved();
    const template = verbosityTemplate.element;
    template.parentElement?.removeChild(template);
    if (verbosityTemplate.afterTemplateRemoved) verbosityTemplate.afterTemplateRemoved();

    this.clearVerbosityTemplateFromDom(verbosityTemplate);
  }

  removeChildTemplate(parentVerbosityTemplate: VerbosityTemplate<HTMLElement>, childVerbosityTemplate: VerbosityTemplate<HTMLElement>) {
    const childVerbosityTemplateInfo : VerbosityTemplateInformation = this.componentInfoMap.get(childVerbosityTemplate);
    if (!childVerbosityTemplateInfo.isMountedAsChild) {
      throw Error(`You cannot remove a child component that was not added as a child`);
    }

    const childrenVerbosityTemplates : VerbosityTemplate<HTMLElement>[] = this.componentsMap.get(parentVerbosityTemplate);
    this.componentsMap.set(parentVerbosityTemplate, childrenVerbosityTemplates.filter(component => component !== childVerbosityTemplate));
    this.componentInfoMap.delete(childVerbosityTemplate);

    this.recursiveBeforeVerbosityTemplateRemoved(childVerbosityTemplate);
    childVerbosityTemplateInfo.mount.removeChild(childVerbosityTemplate.element);
    this.recursiveAfterVerbosityTemplateRemoved(childVerbosityTemplate);
    this.clearVerbosityTemplateFromDom(childVerbosityTemplate);
  }

  removeAllChildren(parentVerbosityTemplate: VerbosityTemplate<HTMLElement>) : void {
    const childrenVerbosityTemplates : VerbosityTemplate<HTMLElement>[] = this.componentsMap.get(parentVerbosityTemplate);
    if (!childrenVerbosityTemplates) return;

    childrenVerbosityTemplates.forEach(childVerbosityTemplate => {
      const childVerbosityTemplateInfo : VerbosityTemplateInformation = this.componentInfoMap.get(childVerbosityTemplate);
      this.componentInfoMap.delete(childVerbosityTemplate);

      this.recursiveBeforeVerbosityTemplateRemoved(childVerbosityTemplate);
      childVerbosityTemplateInfo.mount.removeChild(childVerbosityTemplate.element);
      this.recursiveAfterVerbosityTemplateRemoved(childVerbosityTemplate);
      this.clearVerbosityTemplateFromDom(childVerbosityTemplate);
    })

    this.componentsMap.set(parentVerbosityTemplate, []);
  }

  private hydrateVerbosityTemplate(component : VerbosityTemplate<HTMLElement>) {
    if (this.templateHydrater) this.templateHydrater(component);
  }

  private recursiveBeforeVerbosityTemplateRemoved(component: VerbosityTemplate<HTMLElement>) : void {
    const childrenVerbosityTemplates = this.componentsMap.get(component);
    childrenVerbosityTemplates.forEach(childVerbosityTemplate => this.recursiveBeforeVerbosityTemplateRemoved(childVerbosityTemplate));
    if (component.beforeTemplateRemoved) component.beforeTemplateRemoved();
  }

  private recursiveAfterVerbosityTemplateRemoved(component: VerbosityTemplate<HTMLElement>) : void {
    const childrenVerbosityTemplates = this.componentsMap.get(component);
    childrenVerbosityTemplates.forEach(childVerbosityTemplate => this.recursiveAfterVerbosityTemplateRemoved(childVerbosityTemplate));
    if (component.afterTemplateRemoved) component.afterTemplateRemoved();
  }

  private clearVerbosityTemplateFromDom(component : VerbosityTemplate<HTMLElement>) : void {
    const childrenVerbosityTemplates = this.componentsMap.get(component);
    childrenVerbosityTemplates.forEach(childVerbosityTemplate => this.clearVerbosityTemplateFromDom(childVerbosityTemplate));
    this.componentInfoMap.delete(component);
    this.componentsMap.delete(component);
  }
}
