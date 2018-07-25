import loadIsolatedDirective from "./loadIsolatedDirective";

const testedDirectiveElementAlias = 'testedDirectiveElement';

const isCypressEnabled = () => cy || Cypress;

const addLoadDirectiveCommand = () => {
    Cypress.Commands.add('loadIsolatedDirective', (paramsObj) => {
        cy.document()
            .then(cyDoc => {
                paramsObj.doc = paramsObj.doc || cyDoc;
                return loadIsolatedDirective(paramsObj)
            }).as(testedDirectiveElementAlias);
    });
};

const addGetTestedDirectiveCommand = () => {
    Cypress.Commands.add('getTestedDirectiveElement', () => cy.get(`@${testedDirectiveElementAlias}`));
};

const addCypressCommandsIfPossible = () => {

    if (isCypressEnabled()) {
        addLoadDirectiveCommand();
        addGetTestedDirectiveCommand();
    }

};

addCypressCommandsIfPossible();