// JavaScript Library
// Copyright CMK Software Development 2018

let logger = null;

function log(message) {
	if (logger !== null)
			logger(message);
}

function addClickEvent(elementId, action) {
		if (elementId === undefined || elementId === null
		|| action === undefined || action === null) {
		log();
		return false;
	}
	return workWithElement(elementId, (element) => {
		element.addEventListener('click', function (event) {
            action();
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

function renderDOM(rootElementId, dom) {
	if (dom !== undefined && dom !== null) {
		setElementContent(rootElementId, dom)
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