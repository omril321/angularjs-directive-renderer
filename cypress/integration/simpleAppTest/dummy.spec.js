import "../../../src/renderIsolatedDirective/index";

describe('dummy directive test', () => {

    const htmlsToTest = [
        'index_angular1.2_body_ng-app.html',
        'index_angular1.2_html_data-ng-app.html',
        'index_angular1.2_child_ng-app.html',
        'index_angular1.5_body_data-ng-app.html',
        'index_angular1.5_html_ng-app.html',
        'index_angular1.5_child_data-ng-app.html',
        'index_angular1.7_body_ng-app.html',
        'index_angular1.7_html_data-ng-app.html',
        'index_angular1.7_child_ng-app.html',
    ];

    htmlsToTest.forEach(html => {

        describe(`html: ${html}`, () => {
            it(`should compile a template on html: ${html}`, () => {
                cy.visit(`http://localhost:5000/dummyDirective/${html}`);

                const scope = {
                    data: {
                        arrayByReference: ['injection', 'by', 'reference'],
                        toBeOverriden: 'this should be overriden'
                    }
                };
                cy.renderIsolatedDirective({
                    templateToCompile: '<dummy-directive injected-name="by value" injected-array="data.arrayByReference" override-by-controller="data.toBeOverriden"></dummy-directive>',
                    injectedScopeProperties: scope,
                });

                cy.getTestedElementScope().then(elemScope => {
                    expect(elemScope.data.toBeOverriden).to.equal('controller has overriden')
                });
            });

            it('should reset the application state when loading a test template', () => {
                cy.visit(`http://localhost:5000/dummyDirective/${html}`);

                cy.get('#counter-value').invoke('text').then(text => expect(text).to.equal('counter: 1'));

                const scope = {
                    data: {
                        arrayByReference: ['injection', 'by', 'reference'],
                        toBeOverriden: 'this should be overriden'
                    }
                };
                cy.renderIsolatedDirective({
                    templateToCompile: '<dummy-directive injected-name="by value" injected-array="data.arrayByReference" override-by-controller="data.toBeOverriden"></dummy-directive>',
                    injectedScopeProperties: scope,
                });

                //the dummy directive increases the counter by 3
                cy.get('#dummy-elem-counter').invoke('text').then(text => expect(text).to.equal('dummy element counter: 3'));
            });
        });

    });
});