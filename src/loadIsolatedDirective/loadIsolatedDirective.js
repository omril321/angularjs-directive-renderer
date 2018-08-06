import detectDocumentAngular from './detectDocumentAngular';

const WRAPPER_DIV_ID = "directive-test-wrapper-element"; //TODO: is there a way of reducing the usage of this element?

const addInjectionsToScope = (scope, objectToInject) => {
    for (const k in objectToInject) {
        if (objectToInject.hasOwnProperty(k)) {
            scope[k] = objectToInject[k];
        }
    }
};


const addCompiledElementToDocument = (doc, template, injectedScopeProperties) => {
    const body = doc.body;

    const angular = detectDocumentAngular(doc);
    if(angular === undefined) {
        throw new Error('angular should be defined in the loaded application');
    }

    const ngAppElement = doc.querySelector('*[ng-app]') || doc.querySelector('*[data-ng-app]');
    const injector = angular.element(ngAppElement).injector();
    const $compile = injector.get('$compile');

    body.innerHTML += `<div id=${WRAPPER_DIV_ID}>${template}</div>`;

    const elementUnderTest = angular.element(body.querySelector(`#${WRAPPER_DIV_ID}`).firstChild);
    const elementScope = elementUnderTest.scope();

    addInjectionsToScope(elementScope, injectedScopeProperties);
    $compile(elementUnderTest)(elementScope);

    elementScope.$digest();
    return elementUnderTest;
};

const removeBodyContentFromDocExceptTestedDirective = (doc) => {
    const allChildren = Array.from(doc.body.children);
    const isNotScriptOrTestedDirective = (element => {
        return element.tagName.toUpperCase() !== "SCRIPT" && element.id !== WRAPPER_DIV_ID;
    });

    const toRemove = allChildren.filter(isNotScriptOrTestedDirective);
    toRemove.forEach(child => child.remove());
    return doc;
};


const loadIsolatedDirective = ({
                                   doc = document,
                                   templateToCompile = "Supply a directive template",
                                   injectedScopeProperties = {},
                               }) => {
    const element = addCompiledElementToDocument(doc, templateToCompile, injectedScopeProperties);
    removeBodyContentFromDocExceptTestedDirective(doc);
    return element;
};

export default loadIsolatedDirective;