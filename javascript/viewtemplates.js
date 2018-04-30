
function getWindowView(rootElement, name, x, y, title, content, footer) {
    return {
        name: name,
        rootElementId: rootElement,
        render: function getDom(model) {
            const elements = [
                {
                    type: "div",
                    style: "position:fixed;width:100%;height:80%;",
                    content: [{
                        type: "div",
                        content: [
                            {
                                type: "div",
                                style: "background-color:blue;color:white;font-size:20px;text-align:center;height:28px;min-width:150px;",
                                content: [{
                                    type: "label",
                                    style: "background-color:color:white;font-size:22px;text-align:center;font-family: Arial;",
                                    content: title,
                                    id: name + "_label"
                                }, {
                                    type: "button",
                                    style: "background-color:lightgray;margin:3px;float:right;",
                                    content: "X",
                                    id: "button"
                                }],
                                id: name + "_w1"
                            },
                            {
                                type: "div",
                                style: "background:lightgray;margin:5px;",
                                content: content,
                                id: name + "_w2"
                            },
                            {
                                type: "div",
                                style: "background-color:gray;color:white;height:20px;position:absolute;bottom:0px;width:100%;text-align:center;",
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
            actionName: name + "_mouseup"
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
            actionName: name + "_click_button"
        }],
        model: {
            x: x,
            y: y,
            height: 200,
            width: 200,
        }
    };
}