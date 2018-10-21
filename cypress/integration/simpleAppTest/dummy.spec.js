import "../../../dist/renderIsolatedDirective";

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
            it('should update object injected by reference, in the isolated element scope AND the injected scope', () => {
                cy.visit(`http://localhost:5000/dummyDirective/${html}`);

                const injectedScope = {
                    data: {
                        arrayByReference: ['injection', 'by', 'reference'],
                        toBeOverriden: {value: 'override me'}
                    }
                };
                cy.renderIsolatedDirective({
                    templateToCompile: '<dummy-directive injected-name="by value" injected-array="data.arrayByReference" override-by-controller="data.toBeOverriden"></dummy-directive>',
                    injectedScopeProperties: injectedScope,
                });

                cy.getTestedElementScope().then(elemScope => {
                    const expectedValue = 'controller has overriden';
                    expect(injectedScope.data.toBeOverriden.value).to.equal(expectedValue);
                    expect(elemScope.overrideByController.value).to.equal(expectedValue);
                });
            });

            it('should insert new members to injected array, affecting element scope and parent scope', () => {
                cy.visit(`http://localhost:5000/dummyDirective/${html}`);

                const injectedScope = {
                    data: {
                        arrayByReference: ['injection', 'by', 'reference'],
                        toBeOverriden: {value: 'override me'}
                    }
                };
                cy.renderIsolatedDirective({
                    templateToCompile: '<dummy-directive injected-name="by value" injected-array="data.arrayByReference" override-by-controller="data.toBeOverriden"></dummy-directive>',
                    injectedScopeProperties: injectedScope,
                });

                cy.getTestedElementScope().then(elemScope => {
                    const expectedArray = ['injection', 'by', 'reference', 'is', 'updated'];
                    expect(JSON.stringify(injectedScope.data.arrayByReference)).to.equal(JSON.stringify(expectedArray));
                    expect(JSON.stringify(elemScope.injectedArray)).to.equal(JSON.stringify(expectedArray));
                });
            });

            it('should add a property to the element isolated scope, based on the injected scope property which is passed by value', () => {
                cy.visit(`http://localhost:5000/dummyDirective/${html}`);

                const injectedScope = {
                    data: {
                        arrayByReference: ['injection', 'by', 'reference'],
                        toBeOverriden: {value: 'override me'},
                        byValue: 'by value'
                    }
                };
                cy.renderIsolatedDirective({
                    templateToCompile: '<dummy-directive injected-name="{{data.byValue}}" injected-array="data.arrayByReference" override-by-controller="data.toBeOverriden"></dummy-directive>',
                    injectedScopeProperties: injectedScope,
                });

                cy.getTestedElementScope().then(elemScope => {
                    expect(elemScope.addedValue).to.equal('by value, with some added value');
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