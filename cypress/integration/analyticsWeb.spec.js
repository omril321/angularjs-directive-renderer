import '../../src/loadIsolatedDirective';
import cookies from './cookies';

describe('analytics web', () => {

    beforeEach( () => {
        cy.setCookie(cookies.analyticsWebCookie.key, cookies.analyticsWebCookie.value);

        cy.visit('http://vm.innovid.com:9000/analytics/v3/contextual-report-select-campaign');
    });

    it('should set the bound value to true when clicked', () => {
        let isCalled = false;
        cy.loadIsolatedDirective({
            templateToCompile: `<contextual-report-checkbox-icon class="contextual-report-category-breakdown-card__checkbox-container"
                                                 checkbox-model="checkboxSelected"
                                                 on-checkbox-change="onCheckboxChange"
                                                 size="large"></contextual-report-checkbox-icon>`,
            injectedScopeProperties: {
                onCheckboxChange: () => isCalled = true,
                checkboxSelected: false
            }
        });

        cy.getTestedElementScope().then(scope => expect(scope.checkboxSelected).to.be.false);

        cy.getTestedDirectiveDomElement()
            .screenshot()
            .click();

        cy.getTestedElementScope().then(scope => expect(scope.checkboxSelected).to.be.true);

        cy.getTestedDirectiveDomElement().screenshot();
    });

    it('should fail :(', () => {
        let isCalled = false;
        cy.loadIsolatedDirective({
            templateToCompile: `<contextual-report-checkbox-icon class="contextual-report-category-breakdown-card__checkbox-container"
                                                 checkbox-model="checkboxSelected"
                                                 on-checkbox-change="onCheckboxChange"
                                                 size="large"></contextual-report-checkbox-icon>`,
            injectedScopeProperties: {
                onCheckboxChange: () => isCalled = true,
                checkboxSelected: true
            }
        });

        cy.getTestedElementScope().then(scope => expect(scope.checkboxSelected).to.be.false);
    });
});