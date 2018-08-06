import "../../../src/loadIsolatedDirective/index";

describe('dummy directive test', () => {

    const htmlsToTest = [
        'index_angular1.2_body_ng-app.html',
        'index_angular1.2_html_data-ng-app.html',
        'index_angular1.5_body_data-ng-app.html',
        'index_angular1.5_html_ng-app.html',
        'index_angular1.7_body_ng-app.html',
        'index_angular1.7_html_data-ng-app.html'
    ];

    htmlsToTest.forEach(html => {

        it(`should visit a page (${html})`, () => {
            cy.visit(`http://localhost:5000/dummyDirective/${html}`);

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
});