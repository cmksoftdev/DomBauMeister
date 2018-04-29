const windowtest = {
    name: "window",
    rootElementId: "app2",
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
                            style: "background-color:blue;color:white;font-size:22px;text-align:center;",
                            content: [{
                                type: "label",
                                style: "background-color: color:white;font-size:22px;text-align:center;",
                                content: "Uberschrift",
                                id: "label"
                            }, {
                                type: "button",
                                style: "background-color: lightgray;margin:3px;float: right;",
                                content: "X",
                                id: "button"
                            },
                            ],
                            id: "w1"
                        },
                        {
                            type: "div",
                            style: "background-color: lightgray;width:100%;height:78%;",
                            content: "Uberschrift",
                            id: "w2"
                        },
                        {
                            type: "div",
                            style: "background-color: gray;",
                            content: "Uberschrift",
                            id: "w3"
                        }],
                    style: "position: absolute;" +
                    "width:200px;height:200px;" +
                    "border-style:ridge;border-color:lightgray;border-width:7px;;" +
                    "left:" + model.x + "px;top:" + model.y + "px;",
                    id: "wc"
                },
                ],
                id: "main"
            },
        ];
        return elements;
    },
    events: [{
        elementId: "main",
        domTreeId: "window",
        eventId: "mousemove",
        eventName: "mousemove",
        actionName: "mousemove",
        enabled: false
    }, {
        elementId: "w1",
        domTreeId: "window",
        eventId: "mousedown",
        eventName: "mousedown",
        actionName: "mousedown"
    }, {
        elementId: "main",
        domTreeId: "window",
        eventId: "mouseup",
        eventName: "mouseup",
        actionName: "mouseup"
    }],
    model: {
        x: 300,
        y: 0
    }
};