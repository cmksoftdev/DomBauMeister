const windowtest = {
    name: "window",
    rootElementId: "app2",
    render: function getDom(model) {
        const elements = [
            {
                type: "div",
                content: [
                    {
                        type: "h1",
                        content: "Uberschrift",
                        id: "w1"
                    },
                    {
                        type: "div",
                        style: "backgroundcolor:red;",
                        content: "Uberschrift",
                        id: "w2"
                    },
                    {
                        type: "div",
                        content: "Uberschrift",
                        id: "w3"
                    }],
                style: "position: absolute;left:" + model.x + "px;top:" + model.y + "px;",
                id: "wc"
            },

        ];
        return elements;
    },
    events: [{
        elementId: "main",
        domTreeId: "main",
        eventId: "mousemove",
        eventName: "mousemove",
        actionName: "mousemove",
        enabled: false
    }, {
        elementId: "wc",
        domTreeId: "main",
        eventId: "mousedown",
        eventName: "mousedown",
        actionName: "mousedown"
    }, {
        elementId: "main",
        domTreeId: "main",
        eventId: "mouseup",
        eventName: "mouseup",
        actionName: "mouseup"
    }],
    model: {
        x: 300,
        y: 0
    }
};