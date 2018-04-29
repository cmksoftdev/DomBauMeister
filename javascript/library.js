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


// Level 4
// Framework level

class DomBauMeister {
    constructor(config) {
        this.config = config;
    }
}


// Level 3
// High level classes

class FacilityManager {
    constructor(eventManager, actionManager, domManager, config) {
        this.actionManager = actionManager;
        this.eventManager = eventManager;
        this.domManager = domManager;
        this.config = config;
        this.models = [];
    }

    addActions(actions) {
        if (Array.isArray(actions)) {
            actions.forEach((x) => this.actionManager.addAction(x.actionName, x.listeners));
        }
    }

    addView(view) {
        if (!parameterValidator([view.name, view.rootElementId, view.render, view.events, view.model])) {
            log();
            return false;
        }
        this.domManager.addDom(view.name, view.rootElementId, view.render);
        if (Array.isArray(view.events)) {
            view.events.forEach((x) => {
                if (x.action !== undefined)
                    this.eventManager.addEvent(x.elementId, x.domTreeId, x.eventId, x.eventName, x.action, x.enabled);
                else
                    this.eventManager.addEventA(x.elementId, x.domTreeId, x.eventId, x.eventName, x.actionName, x.enabled);
            });
        }
        this.models.push({
            name: view.name,
            model: new Property(view.model, (m) => {
                this.renderTree(view.name, m);
            }),
        });
    }

    getAndSetModel(name, action) {
        const model = this.models.find((x) => x.name === name);
        const m = model.model.get();
        model.model.set(action(m));
    }

    renderTree(domTreeId, m) {
        let domTree = this.domManager.getDom(domTreeId);
        let model = m === undefined ? this.models.find((x) => x.name === domTreeId).model.get() : m;
        let dom = domTree.render(model);
        renderDOM(domTree.rootElementId, createDOM(dom));
        const events = this.eventManager.getEventsForTree(domTreeId);
        events.forEach((x) => {
            if (x.action !== undefined)
                addEvent(x.elementId, x.eventId, (e) => x.action(e));
            else
                addEvent(x.elementId, x.eventId, (e) => this.actionManager.callAction(x.actionName, e));
        });
    }
}


// Level 2
// Upper level functions and classes

class DomManager {
    constructor() {
        this.domArray = [];
    }

    addDom(name, rootElementId, render) {
        this.domArray.push({
            name: name,
            rootElementId: rootElementId,
            render: render,
        });
    }

    getDom(name) {
        return this.domArray.find((x) => x.name === name);
    }

    searchElementInDom(dom, elementId) {
        let result = undefined;
        dom.forEach((x) => {
            if (x.id === elementId) {
                result = x;
            } else if (Array.isArray(x.content)) {
                const result2 = searchElementInDom(x.content, elementId);
                if (result !== undefined) {
                    result = result2;
                }
            }
        });
        return result;
    }
}

class EventManager {
    constructor(onChange) {
        this.events = [];
        this.onChange = onChange;
    }

    addEvent(elementId, domTreeId, eventId, eventName, action, enabled) {
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
            isEnabled: enabled !== undefined ? enabled : true,
        });
        return true;
    }

    addEventA(elementId, domTreeId, eventId, eventName, actionName, enabled) {
        if (!parameterValidator([elementId, domTreeId, eventId, eventName, actionName])) {
            log();
            return false;
        }
        this.events.push({
            elementId: elementId,
            domTreeId: domTreeId,
            eventId: eventId,
            eventName: eventName,
            actionName: actionName,
            isEnabled: enabled !== undefined ? enabled : true,
        });
        return true;
    }

    getEventsForTree(domTreeId) {
        if (!parameterValidator([domTreeId])) {
            log();
        }
        return this.events.filter((x) => x.domTreeId === domTreeId && x.isEnabled);
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

    changeEventActivity(eventId, isEnabled, action) {
        const i = this.events.findIndex((x) => x.eventId === eventId);
        this.events[i] = {
            ...this.events[i],
            isEnabled: isEnabled,
        };
        const a = this.events[i].action === undefined ? action : this.events[i].action;
        removeEvent(this.events[i].elementId, this.events[i].eventId, a);
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

function removeEvent(elementId, eventName, action) {
    if (!parameterValidator([eventName, action])) {
        log();
        return false;
    }
    if (!parameterValidator([elementId])) {
        const e = document.body;
        e.removeEventListener(eventName, (event) => {
            action(event);
        });
        return true;
    }
    return workWithElement(elementId, (element) => {
        element.removeEventListener(eventName, (event) => {
            action(event);
        });
    });
}

function createHtmlElement(element) {
    let htmlElement = "";
    let style = null;
    let content = null;
    let id = null;
    let events = null;
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
    }
    if (element.events !== undefined && element.events !== null) {
        for (let e in events.events) {
            events = " " + e + "=\"" + element.events[e] + "\"";
        }
    }
    if (element.extend !== undefined && element.extend !== null) {
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