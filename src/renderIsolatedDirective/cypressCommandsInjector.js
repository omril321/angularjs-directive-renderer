const renderIsolatedDirective = require("./renderIsolatedDirective");
const detectDocumentAngular = require("./detectDocumentAngular");

const testedDirectiveElementAlias = 'testedDirectiveElement';

const isCypressEnabled = () => cy || Cypress;

const addRenderDirectiveCommand = () => {
    Cypress.Commands.add('renderIsolatedDirective', (paramsObj) => {
        cy.document()
            .then(cyDoc => {
                paramsObj.doc = paramsObj.doc || cyDoc;
                let isolatedDirective = renderIsolatedDirective(paramsObj);
                const angular = detectDocumentAngular(cyDoc);
                return angular.element(isolatedDirective)
            }).as(testedDirectiveElementAlias);
    });
};

const addGetTestedDirectiveDomElementCommand = () => {
    Cypress.Commands.add('getTestedDirectiveDomElement', () => cy.get(`@${testedDirectiveElementAlias}`));
};

const addGetTestedElementScope = () => {
    Cypress.Commands.add('getTestedElementScope', () => {
        return cy.getTestedDirectiveDomElement()
            .then(elem => cy.getAngular()
                .then(angular => {
                    const ngElem = angular.element(elem);
                    return ngElem.isolateScope() || ngElem.scope();
                }));
    })
};

const addGetAngularCommand = () => {
    Cypress.Commands.add('getAngular', () => {
        cy.document()
            .then(cyDoc => detectDocumentAngular(cyDoc))
    });
};

const addCypressCommandsIfPossible = () => {

    if (isCypressEnabled()) {
        const commandInjectors = [
            addRenderDirectiveCommand,
            addGetTestedDirectiveDomElementCommand,
            addGetAngularCommand,
            addGetTestedElementScope,
        ];

        commandInjectors.forEach(cmd => cmd());
    }

};

addCypressCommandsIfPossible();