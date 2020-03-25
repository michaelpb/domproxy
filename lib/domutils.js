const parse5 = require('parse5');
const domactions = require('./domactions');
const {diffObjects} = require('./utils');


function generateNodeDiffs(left, right, diffs, bc) {
  if (left === null && right === null) {
    throw new Error('Impossible!'); // sanity check
  }

  const breadcrumbs = bc.slice(); // Duplicate array

  if (left === null) {
    breadcrumbs.splice(-1); // remove last item, since we're dealing with parent
    diffs.push([breadcrumbs, domactions.create(right)]);
  } else if (right === null) {
    diffs.push([breadcrumbs, domactions.remove()]);
  } else {

    if (left.name === '#text' && right.name === '#text') {
      // diffs.push([breadcrumbs, domactions.updateTextValue(right)]);
      diffs.push([breadcrumbs, domactions.remove()]);
      breadcrumbs.splice(-1); // remove last item, since we're dealing with parent
      diffs.push([breadcrumbs, domactions.create(right)]);
    } else if (left.name !== right.name) {
      // diffs.push([breadcrumbs, domactions.updateTagname(right)]);
      // If tagname is different, assume completely unrelated
      diffs.push([breadcrumbs, domactions.remove()]);
      breadcrumbs.splice(-1); // remove last item, since we're dealing with parent
      diffs.push([breadcrumbs, domactions.create(right)]);

    } else {
      const attrChanges = domactions.updateAttributes(left, right);
      if (attrChanges.length > 0) {
        diffs.push([breadcrumbs, domactions.updateAttributes(left, right)]);
      }
    }
  }
}

function cleanNodeRecursively(node){
  // TODO: Should rewrite to use TreeAdapter so we don't have to clean anything
  // https://github.com/inikulin/parse5/blob/master/packages/parse5/docs/options/parser-options.md 

  // Delete unneeded attributes
  delete node.parentNode;
  delete node.namespaceURI;
  delete node.tagName;
  node.name = node.nodeName;
  delete node.nodeName;
  delete node.mode;

  if (node.name === '#text') {
    console.log('heyo its text time', node);
  } else {

    // Restructure attributes as an object, or delete if empty
    if (node.attrs && node.attrs.length) {
      const newAttrs = {};
      for (const {name, value} of node.attrs) {
        newAttrs[name] = value;
      }
      node.attrs = newAttrs;
    } else {
      delete node.attrs;
    }

    // Recursive call to child nodes
    if (node.childNodes && node.childNodes.length) {
      for (const childNode of node.childNodes) {
        cleanNodeRecursively(childNode);
      }
    } else {
      // If no children, delete
      delete node.childNodes;
    }
  }
}

function getFirstByName(elem, name) {
  // DFS
  if (elem.name === name) {
    return elem;
  } else if (elem.childNodes) {
    for (const child of elem.childNodes) {
      const result = getFirstByName(child, name);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

function parse(html) {
  const root = parse5.parse(html);
  cleanNodeRecursively(root);
  // Now find body and return that only
  return getFirstByName(root, 'body');
}

module.exports = {
  parse,
  generateNodeDiffs,
};
