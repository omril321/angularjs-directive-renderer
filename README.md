# angularjs-isolate-directive

> Render a directive in an isolated environment. Great for UI tests of components on AngularJS 1.x

Ever wished you could use Storybook on your legacy AngularJS project?  
Well, you still can't. But you can use this library to achieve very close results.
Read the instructions below to see how you can write full UI tests for your components (with actual CSS!). 

## Install

TODO

## API Reference
### renderIsolatedDirective
The library exports a main function - `renderIsolatedDirective(config)`, 
which can be used to load a directive on an (almost) isolated environment (*).
The function expects a single `config` object, with the following properties:
* `doc`: Document (Optional) - the document of the page which loaded your application. 
If omitted, the global `document` will be used instead
* `injectedScopeProperties`: Object (Optional) - default value is an empty object (`{}`). 
Specify the scope properties which will be passed to the scope of the created directive instance 
It is important to note that the tested directive will receive a *new* scope. 
If you wish to access the injected scope directly from your scope, without any other tools, 
then you should bind your data to a property of the scope, and not directly to the scope.
Read more on [this StackOverflow question](https://github.com/angular/angular.js/wiki/Understanding-Scopes#javascript-prototypal-inheritance),
and on [AngularJS wiki - JavaScript Prototypal Inheritance](https://stackoverflow.com/questions/30787147/angularjs-ng-if-and-scopes)
* `templateToCompile`: String - the template which will render the tested directive instance 
Don't forget the injected properties, that should match the data from `injectedScopeProperties` (if it exists).

> \* (Almost) isolated environment 

Since the library requires a document of a loaded application, 
it is possible that the loaded page will perform actions that will affect the test.  
From this reason, it is recommended to use a page which simply loads all of your assets (scripts and stylesheets).


#### How it works
When rendering a test directive from template, the actions are performed:
1. A clone of the original HTML element is generated in memory.
2. All of the children of the body of the cloned HTML element are removed.
3. A new ng-app wrapper `<div>` element is added to the cloned HTML body. 
The wrapper element has a `data-ng-app` attribute, with the name of the `ng-app` attribute from the original document, which this test runs on.
4. Next, the original HTML element is removed from the document, and the new (cloned) HTML element is added to the document.
5. The template is inserted to the application wrapper element. The template is compiled and injected with the properties that the user specified.

### Cypress commands
If you use Cypress, the library will automatically add a few useful commands to Cypress when it is `import`-ed.


* `cy.renderIsolatedDirective` - loads an isolated directive using Cypress' IFrame's document as the tested document.
The function requires the same configuration object as the library's `renderIsolatedDirective`, *except* for the `doc` property - 
Cypress will supply the document. 
If `doc` will be defined, it will be used instead of Cypress' document
This way, you can easily test your app using the following flow:
```javascript
    beforeEach(() => {
          cy.visit('http://localhost:1234'); //webpack-dev-server for example, which serves your entire app
      });
    
    it('should look as expected', () => {
      cy.renderIsolatedDirective({
          templateToCompile: '<my-awesome-directive/>'
      })
      .screenshot();
    });
```


* `cy.getTestedElementScope()` - quickly access your compiled element's scope, and start a Cypress chain:
For example:
```javascript
    cy.getTestedElementScope().then(scope => expect(scope.myBoolean).to.be.false);
```


* `cy.getAngular()` - access your application's global `angular` object. 
Can be used for special requirements, where you wish to use `angular` directly from the running application.


* `cy.getTestedDirectiveDomElement()` - quickly access your compiled directive's DOM element, and start a Cypress chain: 
```javascript
    cy.renderIsolatedDirective({
            templateToCompile: '<my-awesome-directive/>'
        })
        .find('input')
        .click()
        .screenshot();
    
    cy.getTestedDirectiveDomElement()
    .click()
    .screenshot();
```

You can also access the element using `cy.get('@testedDirectiveElement')` (which is exactly what `cy.getTestedDirectiveElement` does).

**IMPORTANT NOTE** - this function is used to access the DOM element, and not the compiled AngularJS element. 
This means the the element can be interacted with (using `click()` for example), 
but it will not have AngularJS' functionality, like `scope()`.
If you only need the element's scope, use the convenient method `cy.getTestedElementScope()`.
If you need the element as an AngularJS element, use in combination with `cy.getAngular()`.


## Usage example

The following example will load the tested directive as an isolated component:
```javascript
    import renderIsolatedDirective from 'renderIsolatedDirective'; //1
    
    describe('my-directive', () => {
        beforeEach(() => {
            //load your application, with all your `/dist` files
        });
        
        it('should load my-directive, and displayed properly', () => {
            const data = { //2
                name: 'test',
                testArr: ['wow', 'much', 'data'],
            };
            
            const testedElement = renderIsolatedDirective({ 
                        doc: document, //3
                        templateToCompile: `<my-directive name="data.name" some-array="data.testArr"/>`, //4
                        injectedScopeProperties: {data}, //5
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
5. `injectedScopeProperties` (Optional) - specify the scope properties which will be passed to the scope of the created directive instance (data is copied, and then injected by `$compile` service).  
Default value is an empty object (`{}`)
6. Interact with the returned element, as test it as you wish.


## License

[MIT](http://vjpr.mit-license.org)