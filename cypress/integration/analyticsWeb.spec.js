import loadDirectiveAsComponent from "./testingUtil";
import cookies from './cookies';

describe('analytics web', () => {

    it('should test analytics web', () => {
        cy.setCookie(cookies.analyticsWebCookie.key, cookies.analyticsWebCookie.value);
        cy.visit('http://vm.innovid.com:9000/analytics/v3/contextual-report-select-campaign');
        cy.loadDirectiveAsComponent({
            templateToCompile: `<contextual-report-checkbox-icon class="contextual-report-category-breakdown-card__checkbox-container"
                                                 checkbox-model="checkboxSelected"
                                                 on-checkbox-change="onCheckboxChange"
                                                 size="large"></contextual-report-checkbox-icon>`,
            injectedScope: {
                onCheckboxChange: () => console.log('yo, I have CHANGED!!'),
                checkboxSelected: false
            }
        })
            // .click()
            .then(elem => expect(elem.isolateScope().checkboxSelected).to.be.true)
            .screenshot()
            .click() //TODO: can i make the element accessible from other functions as well?
            .then(elem => expect(elem.isolateScope().checkboxSelected).to.be.false);

        cy.screenshot();
    });
});