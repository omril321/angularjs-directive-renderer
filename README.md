# angularjs-isolate-directive

> Render a directive in an isolated environment. Great for UI tests of components on AngularJS 1.x

Ever wished you could use Storybook on your legacy AngularJS project?  
Well, you still can't. But you can use this library to achieve very close results.
Read the instructions below to see how you can write full UI tests for your components (with actual CSS!). 

## Install

TODO

## Usage...

### ... As a library
The following example will load the tested directive as an isolated component:
```jsx harmony
import loadIsolatedDirective from 'loadIsolatedDirective'; //1

describe('my-directive', () => {
    beforeEach(() => {
        //load your application, with all your `/dist` files
    });
    
    it('should load my-directive, and displayed properly', () => {
        const data = { //2
            name: 'test',
            testArr: ['wow', 'much', 'data'],
        };
        
        const testedElement = loadIsolatedDirective({ 
                    doc: document, //3
                    templateToCompile: `<my-directive name="data.name" some-array="data.testArr"></my-directive>`, //4
                    injectedScope: {data}, //5
                });
        
        testedElement.find('#my-button').click();//6
    });
});
```

Explanation:
1. Import the rendering function of this library.
2. Create the data which will be injected to the tested directive.
3. `doc` (Optional) - Inject the document of the page which loaded your application.  
If not specified, the global variable `document` will be used.  
It is expected that `angular` will be defined on the page, and that an `ng-app` will exist somewhere on this page.
4. `templateToCompile` - Specify the template which will render the tested directive instance (don't forget the injected properties, that should match the data from step 2).
5. `injectedScope` (Optional) - specify the scope properties which will be passed to the scope of the created directive instance (data is copied, and then injected by `$compile` service).  
Default value is an empty object (`{}`)
6. Interact with the returned element, as test it as you wish.


### ... As a Cypress command
#### `cy.loadIsolatedDirective`
Use `cy.loadIsolatedDirective()` to use Cypress' IFrame's document as the tested document.
This way, you can easily test your app using the following flow:
```javascript
 beforeEach(() => {
        cy.visit('http://localhost:1234'); //webpack-dev-server for example, which serves your entire app
    });

it('should look as expected', () => {
    cy.loadIsolatedDirective({
        templateToCompile: '<my-awesome-directive/>'
    })
    .screenshot();
});
```
#### `cy.getTestedDirectiveElement`
Use `cy.getTestedDirectiveElement` to quickly access your compiled element, and start a Cypress chain.
For example:
```javascript
cy.loadIsolatedDirective({
        templateToCompile: '<my-awesome-directive/>'
    })
    .find('input')
    .click()
    .screenshot();

cy.getTestedDirectiveElement()
.click()
.screenshot();
```

You can also access the element using `cy.get('@testedDirectiveElement')` (which is exactly what `cy.getTestedDirectiveElement` does)

## License

[MIT](http://vjpr.mit-license.org)