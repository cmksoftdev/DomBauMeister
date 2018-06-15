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
        if (parameterValidator([config.logger])) {
            this.logger = config.logger();
            log = this.logger;
        }
        if (!parameterValidator([config.rootElement, config.renderOnEventChange, config.renderOnModelChange])) {
            throw error;
        }
        this.config = config;
        this.facilitymanager = new FacilityManager(
            new EventManager((x) => {
                if (x !== undefined)
                    this.facilitymanager.renderTree(x, this.facilitymanager.models.find((y) => y.name === x).model.get())
            }),
            new ActionManager(),
            new DomManager(),
            null
        );
        this.forker = new Forker(this.config.rootElement);
    }

    addViews(views) {
        if (Array.isArray(views)) {
            views.forEach((x) => {
                this.forker.addFork(x.name);
                x.rootElementId = x.name;
                this.facilitymanager.addView(x);
                if (x.actions !== undefined) {
                    this.facilitymanager.addActions(x.actions);
                }
            });
        }
    }

    addActions(actions) {
        if (Array.isArray(actions)) {
            this.facilitymanager.addActions(actions);
        }
    }

    start() {
        const dom = createDOM(this.forker.getTreeForks());
        renderDOM(this.config.rootElement, dom);
        this.facilitymanager.domManager.domArray.forEach((x) => {
            this.facilitymanager.renderTree(x.name);
        });
    }

    call(actionName, event) {
        this.facilitymanager.actionManager.callAction(actionName, event);
    }

    injectModel(name, injection) {
        this.facilitymanager.getAndSetModel(name, (x) => {
            return {
                ...x,
                ...injection
            };
        });
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
            actions.forEach((x) => {
                if (x.interval === undefined)
                    this.actionManager.addAction(x.actionName, x.listeners);
                else
                    this.actionManager.addRepeatingAction(x.actionName, x.listeners, x.interval);
            });
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
        const events = this.eventManager.getEventsForTree(domTreeId);
        console.log("render tree " + domTreeId);
        //events.forEach((x) => {
        //    if (x.action !== undefined)
        //        removeEvent(x.elementId, x.eventId, (e) => x.action(e));
        //    else
        //        removeEvent(x.elementId, x.eventId, (e) => this.actionManager.callAction(x.actionName, e));
        //});
        renderDOM(domTree.rootElementId, createDOM(dom));
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

class Forker {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.domForks = [];
    }

    addFork(id) {
        this.domForks.push({
            type: "div",
            id: id,
        });
    }

    getTreeForks() {
        return this.domForks;
    }
}

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
        if (this.events.find((x) => x.eventName === eventName) === undefined) {
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
        return false;
    }

    addEventA(elementId, domTreeId, eventId, eventName, actionName, enabled) {
        if (!parameterValidator([elementId, domTreeId, eventId, eventName, actionName])) {
            log();
            return false;
        }
        if (this.events.find((x) => x.eventName === eventName) === undefined) {
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
        return false;
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
        return this.events.filter((x) => x.eventName === elementId);
    }

    getEventsById(eventId) {
        if (!parameterValidator([eventId])) {
            log();
        }
        return this.events.filter((x) => x.eventName === eventId);
    }

    changeEventActivity(eventId, isEnabled, action) {
        const i = this.events.findIndex((x) => x.eventName === eventId);
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

class ImageManager {
    constructor() {
        this.images = [];
    }

    getImage(n) {
        let img = this.image.find((x) => x.name === n);
        if (img === undefined) {
            img = {
                name = n,
                image = new Image(),
            };
            img.image.src = n;
            this.images.push(img);
        }
        return img.image;
    }
}

function createStyles(styles) {
    if (Array.isArray(styles)) {
        let styleString = "style=\"";
        styles.forEach((x) => {
            styleString += x.key + ":" + x.value + ";";
        });
        styleString += "\"";
        return styleString;
    }
}

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

    removeAction(actionName) {
        if (!parameterValidator([actionName, listeners])) {
            log();
            return false;
        }
        const i = this.actions.findIndex(action);
        this.actions = this.actions.splice(i, 1);
    }

    addRepeatingAction(actionName, listeners, interval) {
        if (!parameterValidator([actionName, listeners])) {
            log();
            return false;
        }
        this.actions.push({
            actionType: actionName,
            interval: interval,
            listenerArray: listeners !== undefined &&
                listeners !== null &&
                Array.isArray(listeners) ? listeners : [],
        });
        return true;
    }

    callAction(actionName, payload) {
        if (!parameterValidator([actionName])) {
            log();
        }
        const action = this.actions.filter((x) => x.actionType === actionName);
        if (action !== undefined) {
            action.forEach((a) => {
                a.listenerArray.forEach((l) => {
                    if (a.interval === undefined)
                        l(payload);
                    else {
                        let i = -1;
                        this.actions.forEach((item, index) => {
                            if (item.interval !== undefined)
                                i = index;
                        });
                        if (!this.actions[i].run) {
                            this.callRepeatingAction(l, i, null);
                            this.actions[i] = {
                                ...this.actions[i],
                                run: true
                            };
                        }
                    }
                    console.log("called " + actionName);
                });
            });
        }
    }

    callRepeatingAction(func, i, lastState) {
        const action = this.actions[i];
        if (action.run || lastState === null) {
            console.log("called " + action.actionName);
            const newState = func(lastState);
            setTimeout(() => this.callRepeatingAction(func, i, newState), action.interval);
        }
    }

    cancelRepeatingAction(actionName) {
        let i = -1;
        this.actions.forEach((item, index) => {
            if (item.interval !== undefined)
                i = index;
        });
        this.actions[i].run = false;
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

    removeListener(actionName, listener) {
        if (!parameterValidator([actionName, listener])) {
            log();
        }
        const action = this.actions.find((x) => x.actionType === actionName);
        if (action !== undefined) {
            const i = action.listenerArray.findIndex(action);
            action.listenerArray = action.listenerArray.splice(i, 1);
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

let zindex = 0;
function getZindex() {
    zindex++;
    return zindex;
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
        element.removeEventListener(eventName, action);
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
        if (Array.isArray(element.style)) {
            style = createStyles(element.style);
        } else {
            style = " style=\"" + element.style + "\"";
        }        
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
        extend = "";
        for (let e in element.extend) {
            extend += " " + e + "=\"" + element.extend[e] + "\"";
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
    if (dom !== undefined && dom !== null) {
        setElementContent(rootElementId, dom)
    }
    if (Array.isArray(actions)) {
        actions.forEach((x) => { x(); });
    }
}

function createDOM(elements) {
    let dom = "";
    if (Array.isArray(elements)) {
        elements.forEach((x) => {
            if (Array.isArray(x)) {
                dom += createDOM(x);
            } else {
                dom += createHtmlElement(x);
            }
        });
    }
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

function postRequestAsync(url, data, action, header) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = (e) => {
        action(xhr.responseText);
    };
    xhr.onerror = function (e) {
        log(xhr.statusText);
    };
    xhr.send(data);
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

// This function is from http://geraintluff.github.io/sha256/
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    };

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)

    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e & hash[5]) ^ ((~e) & hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
                ) | 0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

            hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
}