import loadIsolatedDirective from "./loadIsolatedDirective"

describe('dummy directive test', () => {

    it('should visit a page', () => {
        cy.visit('http://localhost:5000');

        loadIsolatedDirective({
            templateToCompile: '<dummy-directive injected-name="by value" injected-array="arrayByReference" override-by-controller="toBeOverriden"></dummy-directive>',
            injectedScope: {arrayByReference: ['injection', 'by', 'reference'], toBeOverriden: 'this should be overriden'},
            modulesToLoad: ['app']
        });

        cy.screenshot();
    });

});