/**
 * Represents an object that is directly tied to an HTMLElement.
 *
 * #################################################################
 * Template's HTML *
 * *****************
 * The #readTemplate() method is responsible for returning the
 * String representation of the HMTL that is associated with this
 * Template. When the Template's HTML is added to the page by the
 * Verbosity Dom (details below), the Template's `template` attribute
 * will be populated with the javascript HTMLElement representing the
 * Template's HTML.
 *
 * #################################################################
 * Verbosity Bindings *
 * ********************
 * Verobisty provides a minimal set of bindings that can be added to the HTML
 * for a Template. These bindings inform Verbosity to perform special actions
 * when attaching the HTML for a template to a page.
 *
 * The #hasBindings() method is responsible for informing the dom that a Verbosity
 * template intends to use one or more of the available bindings.
 *
 * Note: When the #hasBindings() method returns `true`, the Verbosity Dom will have
 * to walk the template's HTML tree in order to discover which elements have bindings
 * attached. As such, if your template does not make use of bindings, then you should
 * NOT return `true` from the #hasBindings() method in order to get more performant
 * loads.
 *
 * -----------------------------------------------------------------
 * Avaiable Bindings *
 * *******************
 * 1. Event Binding
 *    Verbosity allows you to attach any arbitrary event listener to any
 *    element within your Template's HTML through the Event Binding.
 *
 *    HTML Attribute Name: `data-vbs-event-${eventName}`
 *      Where ${eventName} is the name of a javascript event listener.
 *
 *    HTML Attribute Value:
 *      The method name or attribute within your Template that defines the event
 *      listener's method. Note: Verbosity is capable of using private methods
 *      and attributes.
 *
 *    Example Usage:
 *      class ExampleTemplate implements VerbosityTemplate<HTMLButtonElement> {
 *        template : HTMLButtonElement;
 *        readTemplate() {
 *          return `<button data-vbs-event-onclick="myOnClick">Press Me</button>`;
 *        }
 *        myOnClick(event: MouseEvent) {
 *          console.log("Received a verbosity onclick event");
 *        }
 *        hasBindings() {
 *          return true;
 *        }
 *      }
 *
 * -----------------------------------------------------------------
 * 2. Assignment Binding
 *      Verbosity allows you to assign child HMTL elements within the HTML
 *      of your template to attributes within your template through the
 *      Assignment Binding.
 *
 *   HTML Attribute Name: `data-vbs-assign`
 *
 *   HTML Attribute Value:
 *      The name of the attribute within your Template that the bound HTMLElement
 *      should be assigned to.
 *
 *   Example Usage:
 *      class ExampleTemplate implements VerbosityTemplate<HTMLDivElement> {
 *        template : HTMLDivElement;
 *        myButton : HTMLButtonElement;
 *        readTemplate() {
 *          return `<div><button data-vbs-assign="myButton"></button></div>`;
 *        }
 *        hasBindings() {
 *          return true;
 *        }
 *        beforeTemplateAdded() {
 *          this.myButton.text = 'Press Me';
 *        }
 *      }
 *
 * -----------------------------------------------------------------
 * 3. Replacement Binding
 *      Verbosity allows you to replace HTML elements within the HTML of
 *      your template with other Verbosity templates stored as attributes
 *      within your template.
 *
 *   HTML Attribute Name: `data-vbs-replace`
 *
 *   HTML Attribute Value:
 *      The name of the attribute within your Template that bound HTMLElement should
 *      be replaced with. This attribute should be a VerbosityTemplate.
 *
 *   Example Usage:
 *      class GenericDivTemplate implements VerbosityTemplate<HTMLDivElement> {
 *        template : HTMLDivElement;
 *        divContent : VerbosityTemplate<HTMLElement>;
 *        constructor(divContent: VerbosityTemplate<HTMLElement>) {
 *          this.divContent = divContent;
 *        }
 *        readTemplate() {
 *          return `<div><template data-vbs-replace="divContent"></div>`;
 *        }
 *        hasBindings() {
 *          return true;
 *        }
 *      }
 *
 * -----------------------------------------------------------------
 * 4. Child Binding
 *      Verbosity allows you to append an encapsulated Verbosity Template as a child to an
 *      HTML element within the HTML of your template.
 *
 *   HTML Attribute Name: `data-vbs-child`
 *
 *   HTML Attribute Value:
 *      The name of the attribute within your Template that bound HTMLElement should
 *      use as its child element. This attribute should be a VerbosityTemplate.
 *
 *   Example Usage:
 *      class GenericDivTemplate implements VerbosityTemplate<HTMLDivElement> {
 *        template : HTMLDivElement;
 *        divContent : VerbosityTemplate<HTMLElement>;
 *        constructor(divContent: VerbosityTemplate<HTMLElement>) {
 *          this.divContent = divContent;
 *        }
 *        readTemplate() {
 *          return `<div data-vbs-child="divContent"></div>`;
 *        }
 *        hasBindings() {
 *          return true;
 *        }
 *      }
 *
 * -----------------------------------------------------------------
 * 5. Child Binding
 *      Verbosity allows you to append an encapsulated list of Verbosity Templates as
 *      children to an HTML element within the HTML of your template.
 *
 *   HTML Attribute Name: `data-vbs-children`
 *
 *   HTML Attribute Value:
 *      The name of the attribute within your Template that bound HTMLElement should
 *      use as its children elements. This attribute should be a list of VerbosityTemplates.
 *
 *   Example Usage:
 *      class GenericListTemplate implements VerbosityTemplate<HTMLUListElement> {
 *        template : HTMLUListElement;
 *        listElements : VerbosityTemplate<HTMLLIElement>;
 *        constructor(listElements: VerbosityTemplate<HTMLLIElement>) {
 *          this.listElements = listElements;
 *        }
 *        readTemplate() {
 *          return `<ul data-vbs-children="listElements"></ul>`;
 *        }
 *        hasBindings() {
 *          return true;
 *        }
 *      }
 *
 * #################################################################
 * Verbosity Templates and the Verobsity DOM *
 * *******************************************
 * VerbosityTemplate's can be added and removed from the page using
 * the VerbosityDom object. When the dom adds/removes a Template from
 * the page, it invokes the Template's lifecycle, as described below.
 *
 * #################################################################
 * Life Cycle *
 * ************
 * 1. beforeTemplateAdded()
 *    Called when the HTML for this object is about to be added to the page.
 *    At this point in the lifecycle, the `template` attribute is populated.
 *    Furthermore, any Verbosity Bindings have been set; as such, any Verbosity
 *    Assignments will be available to the object.
 *
 * 2. onTemplateAdded()
 *    Called directly after the HTML for this object is added to the page.
 *    At this point in the lifecycle, you can now start accessing content
 *    related to this element using the `document` object.
 *
 * 3. beforeTemplateRemoved()
 *    Called when the HTML for this object is about to be removed from the page.
 *    At this point in the lifecycle, you should shut down any background processes
 *    that are utilizing the elements associated with this Template.
 *
 * 4. afterTemplateRemoved()
 *    Called when the HTML for this object has been removed from the page.
 *    At this point in the lifecycle, you will no longer be able to access
 *    content related to this element using the `document` object.
 */
export interface VerbosityTemplate<T extends HTMLElement> {
  // BEGIN TEMPLATE DEFINITION

  /**
   * A Reference to the HTMLElement defined by the readTemplate() method. On
   * initialization, the `template` attribute is not populated. Instead, the
   * first time the `template` attribute is available is once the
   * beforeVerbosityTempalteAdded() Life Cycle method is invoked.
   */
  element : T;

  /**
   * Provides a String representation of the HTML associated with this Template.
   */
  readTemplate() : string;

  // END TEMPLATE DEFINITION
  // BEGIN LIFECYCLE METHODS

  /**
   * Lifecycle hook called directly before the HTML for the Template
   * is added to the page.
   *
   * At this point, all Verbosity Bindings have been set, but none of
   * the HTML associated with this Template has been added to the page.
   */
  beforeTemplateAdded?(): void;

  /**
   * Lifecycle hook called directly after the HTML for the Template is
   * added to the page.
   *
   * At this point, the HTML associated with the element is within the page;
   * as such, it can be accessed via the `document` object.
   */
  onTemplateAdded?(): void;

  /**
   * Lifecycle hook called directly before the HTML for the Template is removed
   * from the page.
   *
   * At this point, you should halt any background processes that are utilizing
   * the HTML associated with this element.
   */
  beforeTemplateRemoved?(): void;

  /**
   * Lifecycle hook called directly after the HTML for the Template is removed
   * from the page.
   *
   * At this point, you can no longer access the HTML associated with this Template
   * using the `document` object.
   */
  afterTemplateRemoved?(): void;

  // END LIFECYCLE METHODS
  // BEGIN VERBOSITY BINDING FEATURE TOGGLE METHODS

  /**
   * Determines if this template uses any of the verbosity bindings:
   * * data-vbs-event-{name}
   * * data-vbs-assign
   * * data-vbs-replace
   * * data-vbs-child
   * * data-vbs-children
   *
   * @returns true if this template uses any of the verbosity bindings, false otherwise.
   */
  hasBindings?() : boolean;

  // END VERBOSITY BINDING FEATURE TOGGLE METHODS
}
