# DBM.js
DomBauMeister.js is a lightweight framework to create dynamic views.<br />
<br />
######Views<br />
Every view has its own model and render function. It can also have events and actions. The model includes informations like content or visibility and is used by the render function. The render function returns a array of elements, filled with values of the model. Everytime the model is changed by injectModel(name) the render function gets called to render the view.
<br />
<br />
How to create a view:<br />
```javascript
{
        name: "viewName",
        rootElementId: "rootElement",
        render: (model) => {
            if (!model.isVisible)
                return null;
            const elements = [{
                        type: "div",
                        content: model.content,
                        id: "id_of_element"
                    }];
            return elements;
        },
        model: {
            isVisible: true,
            content: "text"
        }
}
```



## Classes: 
######  DomBauMeister<br />

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
