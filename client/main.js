const CREATE = 'CREATE';
const REMOVE = 'REMOVE';
const UPDATE_ATTRS = 'UPDATE_ATTRS';
const UPDATE_TAGNAME = 'UPDATE_TAGNAME';
const ATTR_CREATE = 'ATTR_CREATE';
const ATTR_DELETE = 'ATTR_DELETE';
const ATTR_UPDATE = 'ATTR_UPDATE';

function doAction(node, actionInfo) {
  const actionName = actionInfo[0];

  if (actionName === CREATE) {
    const elem = createElement(actionInfo[1], actionInfo[2]);
    try {
      node.appendChild(elem);
    } catch {
      console.log('error: trying to append node on a text node or comment node or something');
    }

  } else if (actionName === REMOVE) {
    //node.remove();

  } else if (actionName === UPDATE_ATTRS) {
    const attrActions = actionInfo[1];
    for (const [action, key, value] of attrActions) {
      if (action === ATTR_DELETE) {
        node.removeAttribute(key);
      } else {
        node.setAttribute(key, value);
      }
    }

  } else if (actionName === UPDATE_TAGNAME) {
    // Not implemented
    console.error('tagname swap not implemented');

  }
}

function createElement(tagName, attrs = null) {
  if (tagName === '#text') {
    elem = document.createTextNode(attrs);
  } else {
    elem = document.createElement(tagName);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        elem.setAttribute(key, value);
      }
    }
  }
  return elem;
}

//const topNode = document.documentElement;
const topNode = document.body;

function getNode(breadcrumbs) {
  //let node = 
  let node = topNode; // start at body
  for (const crumb of breadcrumbs) {
    const lastNode = node;
    node = node.childNodes[crumb];
    if (!node) {
      console.error('was at', lastNode, '... cannot access', crumb);
      return null;
    }
  }
  return node;
}

function main() {
  var socket = io();
  socket.emit('ready', getDocumentHtml());
  socket.on('response', (payload) => {
    console.log('Received response length', payload.length);
    const data = JSON.parse(payload);
    const {patch, initial} = data;
    //console.log('patch', patch);
    for (const [breadcrumbs, actionInfo] of patch) {
      const node = getNode(breadcrumbs);
      if (node) {
        doAction(node, actionInfo);
      } else {
        console.error('Could not find node');
      }
    }

    console.log('loaded new patch');
  });
}

function getDocumentHtml() {
  const node = document.doctype;
  const doctypeString = "<!DOCTYPE "
          + node.name
          + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
          + (!node.publicId && node.systemId ? ' SYSTEM' : '')
          + (node.systemId ? ' "' + node.systemId + '"' : '')
          + '>';
  return doctypeString + document.documentElement.outerHTML;
}

main();
