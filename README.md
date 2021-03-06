# DBM.js
DomBauMeister.js is a lightweight framework to create dynamic html sites. It's easy to use and debug. If you have any questions, just ask.
<br />
see a demo on http://cmk-1.firewall-gateway.com
or
http://cmk-1.firewall-gateway.com/rr.html
<br />
How to initialize DBM.js<br />
```javascript
const dbm = new DomBauMeister({
            rootElement: "app",
            renderOnEventChange: "",
            renderOnModelChange: ""
        });
...
dbm.addViews([view1, view2, view3]);
dbm.start();
...
```
<br /><br />
Views<br />
Every view has its own model and render function. It can also have events and actions. The model includes informations like content or visibility and is used by the render function. The render function returns a array of elements, filled with values of the model. Everytime the model is changed by injectModel(name) the render function gets called to render the view.
<br />
<br />
How to create a view<br />
```javascript
const view = {
        name: "viewName",
        rootElementId: "rootElement",
        render: (model) => {
            if (!model.isVisible) // This "if" is on top of the function because we don't want 
                return null;      // to create the elements if model.isVisible is false.
            const elements = [{
                        type: "div",
                        content: model.content, // Here we set content from model to the element 
                        id: "id_of_element"
                    }];
            return elements;
        },
        model: { // This are the start values of the model
            isVisible: true,
            content: "text"
        },
        events: []
};
```
<br/>
Actions
<br />
There are two different kinds of actions in DBM, normal actions and repeating actions. Actions can call one or more listeners, if invoked. Repeating actions are called again after a time interval, till they got canceled.
<br />
<br />
How to use repeating actions<br />

```javascript
        dbm.addActions([{
            actionName: "timer",
            listeners: [() => {
                var currentdate = new Date();
                var datetime = "Time: "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();
                dbm.injectModel("window2", {
                    content: datetime
                });
            }],
            interval: 1000,
        }]);
```

## Classes: 
###### DomBauMeister<br />

######  ActionManager<br />
Methods:<br />
  addAction(actionName, listeners)<br />
  callAction(actionName)<br />
  addListener(actionName, listener)<br />

## Functions:
  log(message)<br />
  addClickEvent(elementId, action)<br />
  addMouseDownEvent(elementId, action)<br />
  addMouseUpEvent(elementId, action)<br />
  addMouseMoveEvent(elementId, action)<br />
  createHtmlElement(element)<br />
  renderDOM(rootElementId, dom)<br />
  createDOM(elements)<br />
  getRequest(url)<br />
  workWithElement(elementId, action)<br />
  setElementContent(elementId, content)<br />
  addElement(elementId, innerElementId, content)<br />
  setElementXY(elementId, x, y)<br />
