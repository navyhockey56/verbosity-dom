!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["verbosity-dom"]=t():e["verbosity-dom"]=t()}(self,(()=>(()=>{"use strict";var e={d:(t,o)=>{for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{VerbosityDom:()=>n});class o{loadTemplate(e,t){const o=document.createElement("template"),n=e.readTemplate();o.innerHTML=n;const s=o.content.firstChild;return e.element=s,(this.hasEventListeners(e)||this.hasAssignments(e))&&this.attachVbsBindings(e),t?(t.id&&(s.id=t.id),s):s}hasAssignments(e){return e.hasAssignments&&e.hasAssignments()}hasEventListeners(e){return e.hasEventListeners&&e.hasEventListeners()}attachVbsBindings(e){this.attachVbsBindingsFor(e.element,e)}attachVbsBindingsFor(e,t){Object.keys(e.dataset).forEach((o=>{this.hasEventListeners(t)&&o.startsWith("vbsEvent")?this.attachEventListener(o,e,t):this.hasAssignments(t)&&"vbsAssign"===o&&this.bindAssingment(e.dataset[o],e,t)}));for(let o=0;o<e.children.length;o++){const n=e.children[o];n.children&&n.dataset&&this.attachVbsBindingsFor(n,t)}}attachEventListener(e,t,o){const n=t.dataset[e],s=o[n];if(!s)throw new Error(`Cannot find event listener ${n}`);t[e.slice(8,e.length).toLocaleLowerCase()]=s.bind(o)}bindAssingment(e,t,o){o[e]=t}}class n{constructor(e){this.templateHydrater=e,this.componentsMap=new Map,this.componentInfoMap=new Map,this.templateLoader=new o}replaceElementWithTemplateById(e,t,o){const n=document.getElementById(e);if(!n)throw Error(`Unable to mount to element with ID=${e} because the element is not on the page.`);return this.replaceElementWithTemplate(n,t,o)}replaceElementWithTemplate(e,t,o){this.hydrateVerbosityTemplate(t);const n=this.templateLoader.loadTemplate(t,o);return this.componentInfoMap.set(t,{isMountedAsChild:!1}),this.componentsMap.set(t,[]),t.beforeTemplateAdded&&t.beforeTemplateAdded(),e.parentElement.replaceChild(n,e),t.onTemplateAdded&&t.onTemplateAdded(),n}replaceTemplateWithElement(e,t){this.recursiveBeforeVerbosityTemplateRemoved(e),e.element.parentElement.replaceChild(t,e.element),this.recursiveAfterVerbosityTemplateRemoved(e),this.clearVerbosityTemplateFromDom(e)}replaceTemplateWithTemplate(e,t,o){this.hydrateVerbosityTemplate(t);const n=e.element.parentElement;this.recursiveBeforeVerbosityTemplateRemoved(e);const s=this.templateLoader.loadTemplate(t,o);return this.componentInfoMap.set(t,{isMountedAsChild:!1}),this.componentsMap.set(t,[]),t.beforeTemplateAdded&&t.beforeTemplateAdded(),n.replaceChild(s,e.element),this.recursiveAfterVerbosityTemplateRemoved(e),this.clearVerbosityTemplateFromDom(e),t.onTemplateAdded&&t.onTemplateAdded(),s}appendTemplateToElement(e,t,o){this.hydrateVerbosityTemplate(t);const n=this.templateLoader.loadTemplate(t,o);return this.componentInfoMap.set(t,{isMountedAsChild:!1}),this.componentsMap.set(t,[]),t.beforeTemplateAdded&&t.beforeTemplateAdded(),e.appendChild(n),t.onTemplateAdded&&t.onTemplateAdded(),n}appendChildTemplateToElementById(e,t,o,n){const s=document.getElementById(e);if(!s)throw Error(`Unable to append to element with ID=${e} because the element is not on the page.`);return this.appendChildTemplateToElement(s,t,o,n)}appendChildTemplateToElement(e,t,o,n){if(!t.element.contains(e))throw Error("You cannot append a child to a mount that does not belong to the parent component");this.componentsMap.get(t).push(o),this.componentsMap.set(o,[]),this.componentInfoMap.set(o,{isMountedAsChild:!0,mount:e}),this.hydrateVerbosityTemplate(o);const s=this.templateLoader.loadTemplate(o,n);return o.beforeTemplateAdded&&o.beforeTemplateAdded(),e.appendChild(s),o.onTemplateAdded&&o.onTemplateAdded(),s}removeTemplate(e){var t;this.removeAllChildren(e),e.beforeTemplateRemoved&&e.beforeTemplateRemoved();const o=e.element;null===(t=o.parentElement)||void 0===t||t.removeChild(o),e.afterTemplateRemoved&&e.afterTemplateRemoved(),this.clearVerbosityTemplateFromDom(e)}removeChildTemplate(e,t){const o=this.componentInfoMap.get(t);if(!o.isMountedAsChild)throw Error("You cannot remove a child component that was not added as a child");const n=this.componentsMap.get(e);this.componentsMap.set(e,n.filter((e=>e!==t))),this.componentInfoMap.delete(t),this.recursiveBeforeVerbosityTemplateRemoved(t),o.mount.removeChild(t.element),this.recursiveAfterVerbosityTemplateRemoved(t),this.clearVerbosityTemplateFromDom(t)}removeAllChildren(e){const t=this.componentsMap.get(e);t&&(t.forEach((e=>{const t=this.componentInfoMap.get(e);this.componentInfoMap.delete(e),this.recursiveBeforeVerbosityTemplateRemoved(e),t.mount.removeChild(e.element),this.recursiveAfterVerbosityTemplateRemoved(e),this.clearVerbosityTemplateFromDom(e)})),this.componentsMap.set(e,[]))}hydrateVerbosityTemplate(e){this.templateHydrater&&this.templateHydrater(e)}recursiveBeforeVerbosityTemplateRemoved(e){this.componentsMap.get(e).forEach((e=>this.recursiveBeforeVerbosityTemplateRemoved(e))),e.beforeTemplateRemoved&&e.beforeTemplateRemoved()}recursiveAfterVerbosityTemplateRemoved(e){this.componentsMap.get(e).forEach((e=>this.recursiveAfterVerbosityTemplateRemoved(e))),e.afterTemplateRemoved&&e.afterTemplateRemoved()}clearVerbosityTemplateFromDom(e){this.componentsMap.get(e).forEach((e=>this.clearVerbosityTemplateFromDom(e))),this.componentInfoMap.delete(e),this.componentsMap.delete(e)}}return t})()));