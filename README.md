# DBM.js
DomBauMeister.js is a lightweight framework to create dynamic views.

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
