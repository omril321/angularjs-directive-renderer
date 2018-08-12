import detectDocumentAngular from './detectDocumentAngular';

const TEST_ELEMENT_WRAPPER_ID = "directive-test-wrapper-element";
const TEST_APP_CONTAINER_ID = "directive-test-app-container";

const addInjectionsToScope = (scope, objectToInject) => {
    for (const k in objectToInject) {
        if (objectToInject.hasOwnProperty(k)) {
            scope[k] = objectToInject[k];
        }
    }
};

const findNgAppNameInDoc = (doc) => {
    const angular = detectDocumentAngular(doc);
    if(angular === undefined) {
        throw new Error('angular should be defined in the loaded application');
    }

    const ngAppElement = doc.querySelector('*[ng-app]') || doc.querySelector('*[data-ng-app]');
    const ngAppAttribute = ngAppElement.attributes["data-ng-app"] || ngAppElement.attributes["ng-app"];
    return ngAppAttribute.value;
};

const getCompileService = (doc, ngAppElement) => {
    const angular = detectDocumentAngular(doc);
    const injector = angular.element(ngAppElement).injector();
    return injector.get('$compile');
};

const removeAllChildrenOfElement = (elem) => {
    const children = Array.from(elem.children);
    children.forEach(child => child.remove());
};

const addTestElementFromTemplateAndScopeProperties = (doc, template, injectedScopeProperties) => {
    const angular = detectDocumentAngular(doc);
    const appContainer = doc.querySelector(`#${TEST_APP_CONTAINER_ID}`);

    //apply the injected scope to the wrapper
    const elementUnderTest = angular.element(appContainer.querySelector(`#${TEST_ELEMENT_WRAPPER_ID}`).firstChild);
    const elementScope = elementUnderTest.scope();
    addInjectionsToScope(elementScope, injectedScopeProperties);

    //compile the tested element with the scope
    const $compile = getCompileService(doc, appContainer);
    $compile(elementUnderTest)(elementScope);

    elementScope.$digest();
    return elementUnderTest;
};

const renderIsolatedDirective = ({
                                   doc = document,
                                   templateToCompile = "Supply a directive template",
                                   injectedScopeProperties = {},
                               }) => {
    //get original html app data
    const originalAppName = findNgAppNameInDoc(doc);

    //clone the original html
    const originalHtml = doc.querySelector('html');
    const htmlClone = originalHtml.cloneNode(true);

    //remove all children from body
    const clonedBody = htmlClone.querySelector('body');
    removeAllChildrenOfElement(clonedBody);

    //add a new app to the cloned body
    clonedBody.innerHTML += `<div id="${TEST_APP_CONTAINER_ID}" data-ng-app="${originalAppName}"></div>`;
    const appContainer = clonedBody.querySelector(`#${TEST_APP_CONTAINER_ID}`);

    //remove the old html from dom and add the newly cloned html to the dom
    originalHtml.remove();
    doc.appendChild(htmlClone);

    //bootstrap the new ng-app
    const angular = detectDocumentAngular(doc);
    angular.bootstrap(appContainer, [originalAppName]);

    //add the template (inside a wrapper) to the test app
    appContainer.innerHTML += `<div id="${TEST_ELEMENT_WRAPPER_ID}">${templateToCompile}</div>`;

    return addTestElementFromTemplateAndScopeProperties(doc, templateToCompile, injectedScopeProperties);
};

export default renderIsolatedDirective;