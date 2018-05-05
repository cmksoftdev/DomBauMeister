
function getWindowView(rootElement, name, x, y, title, content, footer) {
    return {
        name: name,
        rootElementId: rootElement,
        render: function getDom(model) {
            if (!model.isVisible)
                return null;
            const elements = [
                {
                    type: "div",
                    style: [{
                        key: "position",
                        value: "fixed"
                    }, {
                        key: "width",
                        value: "100%"
                    }, {
                        key: "height",
                        value: "80%"
                    }, {
                        key: "pointer-events",
                        value: model.isMouseDown ? "all" : "none"
                    }, {
                        key: "z-index",
                        value: getZindex()
                    },],
                    content: [{
                        type: "div",
                        content: [
                            {
                                type: "div",
                                style: "background-color:blue;color:white;font-size:20px;text-align:center;height:28px;min-width:150px;",
                                content: [{
                                    type: "label",
                                    style: "background-color:color:white;font-size:22px;text-align:center;font-family: Arial;pointer-events: all;",
                                    content: title,
                                    id: name + "_label"
                                }, {
                                    type: "button",
                                    style: "background-color:lightgray;margin:3px;float:right;pointer-events: all;",
                                    content: "X",
                                    id: name + "_button"
                                }],
                                id: name + "_w1"
                            },
                            {
                                type: "div",
                                style: "background:lightgray;margin:5px;overflow: scroll;height:" + (model.height - 40) + "px;pointer-events: all;",
                                content: model.content,
                                id: name + "_w2"
                            },
                            {
                                type: "div",
                                style: "background-color:gray;color:white;height:20px;position:absolute;bottom:0px;width:100%;text-align:center;pointer-events: all;",
                                content: footer,
                                id: name + "_w3"
                            }],
                        style: "position: absolute;" +
                        "width:" + model.width + "px;height:" + model.height + "px;" +
                        "border-style:ridge;border-color:lightgray;border-width:7px;" +
                        "left:" + model.x + "px;top:" + model.y + "px;background:lightgray;",
                        id: name + "_wc"
                    },
                    ],
                    id: name + "_main"
                },
            ];
            return elements;
        },
        events: [{
            elementId: name + "_main",
            domTreeId: name,
            eventId: "mousemove",
            eventName: name + "_mousemove",
            actionName: name + "_mousemove",
            enabled: false
        }, {
            elementId: name + "_main",
            domTreeId: name,
            eventId: "mousemove",
            eventName: name + "_mousemove2",
            actionName: name + "_mousemove2",
            enabled: false
        }, {
            elementId: name + "_label",
            domTreeId: name,
            eventId: "mousedown",
            eventName: name + "_mousedown",
            actionName: name + "_mousedown"
        }, {
            elementId: name + "_main",
            domTreeId: name,
            eventId: "mouseup",
            eventName: name + "_mouseup",
            actionName: name + "_mouseup",
            enabled: false
        }, {
            elementId: name + "_w3",
            domTreeId: name,
            eventId: "mousedown",
            eventName: name + "_mousedown2",
            actionName: name + "_mousedown2"
        }, {
            elementId: name + "_button",
            domTreeId: name,
            eventId: "click",
            eventName: name + "_click_button",
            actionName: name + "_hide"
        }],
        model: {
            isVisible: false,
            x: x,
            y: y,
            height: 200,
            width: 200,
            isMouseDown: false,
            content: content,
        },
        actions: [{
            actionName: name + "_mousemove",
            listeners: [
                (x) => {
                    x.preventDefault();
                    dbm.facilitymanager.getAndSetModel(name, (m) => {
                        return {
                            ...m,
                            x: m.x + x.clientX - m.xOld,
                            y: m.y + x.clientY - m.yOld,
                            xOld: x.clientX,
                            yOld: x.clientY,
                        }
                    });
                },
            ]
        }, {
            actionName: name + "_mousemove2",
            listeners: [
                (x) => {
                    x.preventDefault();
                    dbm.facilitymanager.getAndSetModel(name, (m) => {
                        return {
                            ...m,
                            width: (m.width + x.clientX - m.xOld2) < 180 ? 180 : (m.width + x.clientX - m.xOld2),
                            height: (m.height + x.clientY - m.yOld2) < 180 ? 180 : (m.height + x.clientY - m.yOld2),
                            xOld2: x.clientX,
                            yOld2: x.clientY,
                        }
                    });
                },
            ]
        }, {
            actionName: name + "_mousedown",
            listeners: [
                (x) => {
                    x.preventDefault();
                    dbm.facilitymanager.eventManager.changeEventActivity(name + "_mouseup", true);
                    dbm.facilitymanager.eventManager.changeEventActivity(name + "_mousemove", true);
                    dbm.facilitymanager.getAndSetModel(name, (m) => {
                        return {
                            ...m,
                            xOld: x.clientX,
                            yOld: x.clientY,
                            isMouseDown: true,
                        }
                    });
                },
            ]
        }, {
            actionName: name + "_mousedown2",
            listeners: [
                (x) => {
                    x.preventDefault();
                    dbm.facilitymanager.eventManager.changeEventActivity(name + "_mouseup", true);
                    dbm.facilitymanager.eventManager.changeEventActivity(name + "_mousemove2", true);
                    dbm.facilitymanager.getAndSetModel(name, (m) => {
                        return {
                            ...m,
                            xOld2: x.clientX,
                            yOld2: x.clientY,
                            isMouseDown: true,
                        }
                    });
                },
            ]
        }, {
            actionName: name + "_mouseup",
            listeners: [
                () => {
                    dbm.facilitymanager.eventManager.changeEventActivity(name + "_mousemove", false);
                    dbm.facilitymanager.eventManager.changeEventActivity(name + "_mousemove2", false);
                    dbm.facilitymanager.eventManager.changeEventActivity(name + "_mouseup", false);
                    dbm.facilitymanager.getAndSetModel(name, (m) => {
                        return {
                            ...m,
                            isMouseDown: false,
                        }
                    });
                },
            ]
        }, {
            actionName: name + "_hide",
            listeners: [() => {
                dbm.facilitymanager.getAndSetModel(name, (m) => {
                    return {
                        ...m,
                        isVisible: false,
                    }
                });
            }
            ]
        }, {
            actionName: name + "_show",
            listeners: [() => {
                dbm.facilitymanager.getAndSetModel(name, (m) => {
                    return {
                        ...m,
                        isVisible: true,
                    }
                });
            }
            ]
        }
        ]
    };
}

function getIconView(rootElement, imageUrl, name, x, y, content, actionName) {
    return {
        name: name,
        rootElementId: rootElement,
        render: function getDom(model) {
            if (!model.isVisible)
                return null;
            const elements = [{
                type: "div",
                content: [
                    {
                        type: "div",
                        style: "margin:auto;",
                        content: [
                            {
                                type: "img",
                                style: "height:64px;width:64px;margin:auto;",
                                extend: {
                                    src: imageUrl
                                }
                            }
                        ],
                        id: name + "_img"
                    },
                    {
                        type: "div",
                        style: "margin:auto;pointer-events: all;background:#00BFFF;color:white;text-align: center;",
                        content: content,
                        id: name + "_w3"
                    }],
                style: "position: absolute;" +
                "left:" + model.x + "px;top:" + model.y + "px;",
                id: name + "_wc"
            },
            ];
            return elements;
        },
        events: [{
            elementId: name + "_img",
            domTreeId: name,
            eventId: "click",
            eventName: name + "_img",
            actionName: actionName
        }],
        model: {
            isVisible: true,
            x: x,
            y: y
        }
    };
}

function getOverlayLoginView(rootElement, name, actionName) {
    return {
        name: name,
        rootElementId: rootElement,
        render: function getDom(model) {
            if (!model.isVisible)
                return null;
            const elements = [{
                type: "div",
                style: "position: absolute;background-color:rgba(0,0,0,0.6);height:100%;width:100%;z-index:1000;pointer-events: all;position:fixed;top: 0;left: 0;",
                content: [
                    {
                        type: "div",
                        style: "margin:auto;height:200px;width:300px;position:absolute;" +
                        "background-color:rgb(235,235,235);top:0;bottom: 0;left: 0;right: 0;" +
                        "border-style:solid;border-color:gray;border-width:3px;box-shadow: 15px 10px rgba(0,0,0,0.2);border-radius: 5px;",
                        content: [
                            {
                                type: "form",
                                id: name + "_form",
                                style: "height:100%;width:100%;float: left;",
                                content: [{
                                    type: "div",
                                    content: [{
                                        type: "label",
                                        id: name + "_user_label",
                                        content: "Username:",
                                        style: "margin-left:30px;",
                                    }],
                                    style: "pointer-events: all;padding:10px;",
                                }, {
                                    type: "div",
                                    content: [{
                                        type: "input",
                                        id: name + "_user_input",
                                        extend: {
                                            type: "text",
                                            maxlength: "30"
                                        },
                                        style: "pointer-events:all;margin:auto;position:relative;display:block;width:90%;",
                                    }],
                                    style: "pointer-events: all;",
                                }, {
                                    type: "div",
                                    content: [{
                                        type: "label",
                                        id: name + "_password_label",
                                        content: "Password:",
                                        style: "height:23px;pointer-events: all;margin-left:30px;",
                                    }],
                                    style: "pointer-events: all;padding:10px;",
                                }, {
                                    type: "div",
                                    content: [{
                                        type: "input",
                                        id: name + "_password_input",
                                        extend: {
                                            type: "password",
                                            maxlength: "30"
                                        },
                                        style: "pointer-events:all;margin:auto;position:relative;display:block;width:90%;",
                                    }],
                                    style: "pointer-events: all;",
                                }, {
                                    type: "div",
                                    content: [{
                                        type: "input",
                                        id: name + "_button",
                                        extend: {
                                            type: "submit",
                                            event: "dbm.call(\"submit\", this)",
                                        },
                                        style: "pointer-events:all;margin:auto;position:relative;display:block;padding:25px,5px;",
                                    }],
                                    style: "pointer-events: all;padding:10px;",
                                }]
                            }
                        ],
                        id: name + "_container"
                    }],
                id: name + "_overlay"
            },
            ];
            return elements;
        },
        events: [{
            elementId: name + "_form",
            domTreeId: name,
            eventId: "submit",
            eventName: name + "_button",
            actionName: actionName
        }],
        model: {
            isVisible: true,
        }
    };
}