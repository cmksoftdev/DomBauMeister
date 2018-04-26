// JavaScript Library
// Copyright CMK Software Development 2018

let logger = null;

class ActionManager {
	constructor() {
		this.actions = [];
	}
  
	addAction(actionName, listeners) {
		if (actionName === undefined || actionName === null
			|| listeners === undefined || listeners === null) {
			log();
			return false;
		}
		this.actions.push({
			actionType: actionName, 
			listenerArray: listeners !== undefined && 
				listeners !== null && 
				Array.isArray(listeners) ? listeners : [],
		});
		return true;
	}
	
	callAction(actionName, event) {
		const action = this.actions.filter((x) => x.actionType === actionName);
		if (action !== undefined) {
			action.forEach((a) => {
				a.listenerArray.forEach((l) => {
					l(event);
				});
			});
		}
	}
	
	addListener(actionName, listener) {
		const action = this.actions.find((x) => x.actionType === actionName);
		if (action !== undefined) {
			action.listenerArray.push(listener);
		}
	}
}

function log(message) {
	if (logger !== null)
			logger(message);
}

function getMouseX(event) {
	return event.clientX;
}

function getMouseY(event) {
	return event.clientY;
}

function getMousePosition(event) {
	return {x: getMouseX(event), y: getMouseY(event)}
}

function addClickEvent(elementId, action) {
	return addEvent(elementId, "click", action);
}

function addMouseDownEvent(elementId, action) {
	return addEvent(elementId, "mousedown", action);
}

function addMouseUpEvent(elementId, action) {
	return addEvent(elementId, "mouseup", action);
}

function addMouseMoveEvent(elementId, action) {
	return addEvent(elementId, "mousemove", action);
}

function addEvent(elementId, eventName, action) {
		if (elementId === undefined || elementId === null
		|| eventName === undefined || eventName === null
		|| action === undefined || action === null) {
		log();
		return false;
	}
	return workWithElement(elementId, (element) => {
		element.addEventListener(eventName, function (event) {
            action(event);
        });
	});
}

function createHtmlElement(element) {
	let htmlElement = "";
	let style = null;
	let content = null;
	let id = null;
	if (element.style !== undefined && element.style !== null) {
		style = " style=" + element.style;
	}	
	if (element.content !== undefined && element.content !== null) {
		if (Array.isArray(element.content)) {
			content = createDOM(element.content);
		} else {
			content = element.content;
		}
	}
	if (element.id !== undefined && element.id !== null) {
		id = " id=" + element.id;
	}
	if (element.type !== undefined && element.type !== null) {
		htmlElement += "<" + element.type +
		(id !== null ? id : "") +
		(style !== null ? style : "") + ">" +
		(content !== null ? content : "") + "</" + element.type + ">";
	}
	return htmlElement;
}

function renderDOM(rootElementId, dom, actions) {
	if (dom !== undefined && dom !== null) {
		setElementContent(rootElementId, dom)
	}
	if (Array.isArray(actions)) {
		actions.forEach((x) => {x();});
	}
}

function createDOM(elements) {
	let dom = "";
	elements.forEach((x) => {
		if (Array.isArray(x)) {
			dom += createDOM(x);
		} else {
			dom += createHtmlElement(x);
		}
	});
	return dom;
}

function getRequest(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onload = function (e) {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
			  return xhr.responseText;
			} else {
			  log(xhr.statusText);
			}
		}
	};
	xhr.onerror = function (e) {
	  log(xhr.statusText);
	};
	xhr.send(null);
}

function workWithElement(elementId, action) {
	const element = document.getElementById(elementId)
	if (element !== null)
		action(element);
	else {
		log();
		return false;
	}
	return true;
}

function setElementContent(elementId, content) {
	if (elementId === undefined || elementId === null
		|| content === undefined || content === null) {
		log();
		return false;
	}
	return workWithElement(elementId, (element) => {
		element.innerHTML = content;
	});
}

function addElement(elementId, innerElementId, content) {
	if (elementId === undefined || elementId === null
		|| innerElementId === undefined || innerElementId === null
		|| content === undefined || content === null) {
		log();
		return false;
	}
		return workWithElement(elementId, (element) => {
		element.innerHTML += "<div  id=" + innerElementId + 
			" style=\"position: absolute;\">" + content + "</div>";
	});
}

function setElementXY(elementId, x, y) {
	if (elementId === undefined || elementId === null
		|| x === undefined || x === null
		|| y === undefined || y === null) {
		log();
		return false;
	}
	return workWithElement(elementId, (element) => {
		element.style = "position: absolute;";
		element.style.left = x + "px";
		element.style.top = y + "px";
	});
}