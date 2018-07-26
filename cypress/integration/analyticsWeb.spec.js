import './loadIsolatedDirective';
import cookies from './cookies';

describe('analytics web', () => {

    it('should test analytics web', () => {
        cy.setCookie(cookies.analyticsWebCookie.key, cookies.analyticsWebCookie.value);
        cy.visit('http://vm.innovid.com:9000/analytics/v3/contextual-report-select-campaign');
        cy.loadIsolatedDirective({
            templateToCompile: `<contextual-report-checkbox-icon class="contextual-report-category-breakdown-card__checkbox-container"
                                                 checkbox-model="checkboxSelected"
                                                 on-checkbox-change="onCheckboxChange"
                                                 size="large"></contextual-report-checkbox-icon>`,
            injectedScopeProperties: {
                onCheckboxChange: () => console.log('yo, I have CHANGED!!'),
                checkboxSelected: false
            }
        });

        cy.getTestedDirectiveElement()
            .then(elem => expect(elem.isolateScope().checkboxModel).to.be.false) //TODO: is there a way to make the workflow with the scope less awkward? see checkboxModel VS checkboxSelected in the injected scope. ==> possible solution - inject an entire scope object (like the solution for ng-if scoping)

        cy.getTestedDirectiveElement()
            .screenshot()
            .click()
            .then(elem => expect(elem.isolateScope().checkboxModel).to.be.true);

        cy.getTestedDirectiveElement().screenshot();

    });
});