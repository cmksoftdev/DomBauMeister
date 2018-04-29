// JavaScript Library
// Copyright CMK Software Development 2018

let logger = null;

// No specific Level

// Property with on change notification
class Property {
    constructor(value, notifier, id) {
        this.value = value === undefined ? null : value;
        this.notifier = notifier === undefined ? null : notifier;
        this.id = id === undefined ? null : id;
    }

    get() {
        return this.value;
    }

    getId() {
        return this.id;
    }

    set(v) {
        if (parameterValidator([v])) {
            this.value = v;
            if (parameterValidator([this.notifier])) {
                this.notifier(v);
            }
        }
    }
}

// Level 3
// High level classes

class FacilityManager {
    constructor(eventManager, actionManager, config) {
        this.actionManager = actionManager;
        this.eventManager = eventManager;
        this.config = config;
        this.domTrees = [];
    }

    addView(view) {

    }
}

// Level 2
// Upper level functions and classes

class EventManager {
    constructor(onChange) {
        this.events = [];
        this.onChange = onChange;
    }

    addEvent(elementId, domTreeId, eventId, eventName, action) {
        if (!parameterValidator([elementId, domTreeId, eventId, eventName, action])) {
            log();
            return false;
        }
        this.events.push({
            elementId: elementId,
            domTreeId: domTreeId,
            eventId: eventId,
            eventName: eventName,
            action: action,
            isEnabled: true,
        });
        return true;
    }

    getEventsForTree(domTreeId) {
        if (!parameterValidator([domTreeId])) {
            log();
        }
        return this.events.filter((x) => x.domTreeId === domTreeId);
    }

    getEventsForElement(elementId) {
        if (!parameterValidator([elementId])) {
            log();
        }
        return this.events.filter((x) => x.elementId === elementId);
    }

    getEventsById(eventId) {
        if (!parameterValidator([eventId])) {
            log();
        }
        return this.events.filter((x) => x.eventId === eventId);
    }

    changeEventActivity(eventId, isEnabled) {
        const i = this.events.findIndex((x) => x.eventId === eventId);
        this.events[i] = {
            ...this.events[i],
            isEnabled: isEnabled,
        };
        this.onChange(this.events[i].domTreeId);
    }
}

// Level 1
// Lower level functions and classes

class ActionManager {
    constructor() {
        this.actions = [];
    }

    addAction(actionName, listeners) {
        if (!parameterValidator([actionName, listeners])) {
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
        if (!parameterValidator([actionName, event])) {
            log();
        }
        const action = this.actions.filter((x) => x.actionType === actionName);
        if (action !== undefined) {
            action.forEach((a) => {
                a.listenerArray.forEach((l) => {
                    l(event);
                    console.log(actionName);
                });
            });
        }
    }

    addListener(actionName, listener) {
        if (!parameterValidator([actionName, listener])) {
            log();
        }
        const action = this.actions.find((x) => x.actionType === actionName);
        if (action !== undefined) {
            action.listenerArray.push(listener);
        }
    }
}

function parameterValidator(parameterArray) {
    if (Array.isArray(parameterArray)) {
        let result = true;
        parameterArray.forEach((x) => {
            if (x === undefined || x === null) {
                result = false;
            }
        });
        return result;
    } else {
        return false;
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
    return { x: getMouseX(event), y: getMouseY(event) }
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
    if (!parameterValidator([eventName, action])) {
        log();
        return false;
    }
    if (!parameterValidator([elementId])) {
        const e = document.body;
            e.addEventListener(eventName, (event) => {
                action(event);
        });
            return true;
    }
    return workWithElement(elementId, (element) => {
        element.addEventListener(eventName, (event) => {
            action(event);
        });
    });
}

function createHtmlElement(element) {
    let htmlElement = "";
    let style = null;
    let content = null;
    let id = null;
    let extend = null;
    if (element.style !== undefined && element.style !== null) {
        style = " style=\"" + element.style + "\"";
    }
    if (element.content !== undefined && element.content !== null) {
        if (Array.isArray(element.content)) {
            content = createDOM(element.content);
        } else {
            content = element.content;
        }
    }
    if (element.id !== undefined && element.id !== null) {
        id = " id=\"" + element.id + "\"";
    } if (element.extend !== undefined && element.extend !== null) {
        for (let e in element.extend) {
            extend = " " + e + "=\"" + element.extend[e] + "\"";
        }
    }
    if (element.type !== undefined && element.type !== null) {
        htmlElement += "<" + element.type +
            (id !== null ? id : "") +
            (extend !== null ? extend : "") +
            (style !== null ? style : "") + ">" +
            (content !== null ? content : "") + "</" + element.type + ">";
    }
    return htmlElement;
}

function renderDOM(rootElementId, dom, actions) {
    console.log("render");
    if (dom !== undefined && dom !== null) {
        setElementContent(rootElementId, dom)
    }
    if (Array.isArray(actions)) {
        actions.forEach((x) => { x(); });
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

function getRequestAsync(url, action) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = (e) => {
        action(xhr.responseText);
    };
    xhr.onerror = function (e) {
        log(xhr.statusText);
    };
    xhr.send(null);
    return xhr.responseText;
}

function getRequest(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                return xhr.responseText;
            } else {
                log(xhr.statusText);
                return xhr.statusText;
            }
        }
    };
    xhr.onerror = function (e) {
        log(xhr.statusText);
    };
    xhr.send(null);
    return xhr.responseText;
}

function workWithElement(elementId, action) {
    if (!parameterValidator([elementId, action])) {
        log();
        return false;
    }
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
    if (!parameterValidator([elementId, content])) {
        log();
        return false;
    }
    return workWithElement(elementId, (element) => {
        element.innerHTML = content;
    });
}

function addElement(elementId, innerElementId, content) {
    if (!parameterValidator([elementId, innerElementId, content])) {
        log();
        return false;
    }
    return workWithElement(elementId, (element) => {
        element.innerHTML += "<div  id=" + innerElementId +
            " style=\"position: absolute;\">" + content + "</div>";
    });
}

function setElementXY(elementId, x, y) {
    if (!parameterValidator([elementId, x, y])) {
        log();
        return false;
    }
    return workWithElement(elementId, (element) => {
        element.style = "position: absolute;";
        element.style.left = x + "px";
        element.style.top = y + "px";
    });
}