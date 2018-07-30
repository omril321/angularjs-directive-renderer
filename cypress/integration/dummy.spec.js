import "./loadIsolatedDirective";

describe('dummy directive test', () => {

    it('should visit a page', () => {
        cy.visit('http://localhost:5000');

        const scope = {data: {arrayByReference: ['injection', 'by', 'reference'], toBeOverriden: 'this should be overriden'}};
        cy.loadIsolatedDirective({
            templateToCompile: '<dummy-directive injected-name="by value" injected-array="data.arrayByReference" override-by-controller="data.toBeOverriden"></dummy-directive>',
            injectedScopeProperties: scope,
        });

        //TODO: add to readme: scope can be referenced by the local "scope", or by cy.getTestedElementScope()
        cy.getTestedElementScope().then(elemScope => {
            console.log("scope : ", scope);
            expect(elemScope.data.toBeOverriden).to.equal('controller has overriden')
        });


        cy.screenshot();
    });

});