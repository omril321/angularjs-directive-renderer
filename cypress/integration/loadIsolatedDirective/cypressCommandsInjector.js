import loadIsolatedDirective from "./loadIsolatedDirective";
import detectDocumentAngular from "./detectDocumentAngular";

const testedDirectiveElementAlias = 'testedDirectiveElement';

const isCypressEnabled = () => cy || Cypress;

const addLoadDirectiveCommand = () => {
    Cypress.Commands.add('loadIsolatedDirective', (paramsObj) => {
        cy.document()
            .then(cyDoc => {
                paramsObj.doc = paramsObj.doc || cyDoc;
                let isolatedDirective = loadIsolatedDirective(paramsObj);
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
                    return ngElem.scope() || ngElem.isolateScope();
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
            addLoadDirectiveCommand,
            addGetTestedDirectiveDomElementCommand,
            addGetAngularCommand,
            addGetTestedElementScope,
        ];

        commandInjectors.forEach(cmd => cmd());
    }

};

addCypressCommandsIfPossible();