import "../../../src/loadIsolatedDirective/index";

describe('dummy directive test', () => {

    it('should visit a page', () => {
        cy.visit('http://localhost:5000/dummyDirective/');

        const scope = {data: {arrayByReference: ['injection', 'by', 'reference'], toBeOverriden: 'this should be overriden'}};
        cy.loadIsolatedDirective({
            templateToCompile: '<dummy-directive injected-name="by value" injected-array="data.arrayByReference" override-by-controller="data.toBeOverriden"></dummy-directive>',
            injectedScopeProperties: scope,
        });

        cy.getTestedElementScope().then(elemScope => {
            expect(elemScope.data.toBeOverriden).to.equal('controller has overriden')
        });


        cy.screenshot();
    });

});