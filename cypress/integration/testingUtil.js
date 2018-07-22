const addInjectionsToScope = (scope, objectToInject) => {
    for (const k in objectToInject) {
        if (objectToInject.hasOwnProperty(k)) {
            scope[k] = objectToInject[k];
        }
    }
};


const addCompiledElementToDocument = (doc, template, injectedScopeProperties) => {
    const body = doc.body;

    const angular = doc.defaultView.angular;
    expect(angular, 'angular should be defined in the loaded application').not.to.be.undefined;

    const injector = angular.element('*[ng-app]').injector(); //TODO: if this works, this needs to run before removing the body elements
    const $compile = injector.get('$compile');

    const wrapperDivId = "directive-test-wrapper-element"; //TODO: is there a way of reducing the usage of this element?
    body.innerHTML += `<div id=${wrapperDivId}>${template}</div>`;

    const elementUnderTest = angular.element(body.querySelector(`#${wrapperDivId}`).firstChild);
    const elementScope = elementUnderTest.scope();

    addInjectionsToScope(elementScope, injectedScopeProperties);
    $compile(elementUnderTest)(elementScope);

    elementScope.$apply();
    return elementUnderTest;
};

const removeBodyContentFromDoc = (doc) => {
    const allChildren = Array.from(doc.body.children);
    const toRemove = allChildren.filter(child => child.tagName.toUpperCase() !== "SCRIPT");
    toRemove.forEach(child => child.remove());
    return doc;
};


const loadDirectiveAsComponent = ({
                                      doc = document,
                                      templateToCompile = "Supply a directive template",
                                      injectedScopeProperties = {},
                                  }) => {
    removeBodyContentFromDoc(doc);
    return addCompiledElementToDocument(doc, templateToCompile, injectedScopeProperties);
};

if (cy || Cypress) {
    Cypress.Commands.add('loadDirectiveAsComponent', (paramsObj) => {
        cy.document()
            .then(cyDoc => {
            paramsObj.doc = paramsObj.doc || cyDoc;
            return loadDirectiveAsComponent(paramsObj)
        })
    })
}

export default loadDirectiveAsComponent;