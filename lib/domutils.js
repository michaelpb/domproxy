const parse5 = require('parse5');
const domactions = require('./domactions');
const {diffObjects} = require('./utils');


function generateNodeDiffs(left, right, diffs, breadcrumbs) {
  if (left === null && right === null) {
    throw new Error('Impossible!'); // sanity check
  }

  if (left === null) {
    breadcrumbs.splice(-1); // remove last item, since we're dealing with parent
    diffs.push([breadcrumbs, domactions.create(right)]);
  } else if (right === null) {
    diffs.push([breadcrumbs, domactions.remove()]);
  } else {

    if (left.name !== right.name) {
      // diffs.push([breadcrumbs, domactions.updateTagname(right)]);
      // If tagname is different, assume completely unrelated
      diffs.push([breadcrumbs, domactions.remove()]);
      breadcrumbs.splice(-1); // remove last item, since we're dealing with parent
      diffs.push([breadcrumbs, domactions.create(right)]);

    } else {
      diffs.push([breadcrumbs, domactions.updateAttributes(left, right)]);
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

function parse(html) {
  const root = parse5.parse(html);
  cleanNodeRecursively(root);
  return root;
}

module.exports = {
  parse,
  generateNodeDiffs,
};
