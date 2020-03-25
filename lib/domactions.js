const CREATE = 'CREATE';
const REMOVE = 'REMOVE';
const UPDATE_ATTRS = 'UPDATE_ATTRS';
const UPDATE_TAGNAME = 'UPDATE_TAGNAME';
const ATTR_CREATE = 'ATTR_CREATE';
const ATTR_DELETE = 'ATTR_DELETE';
const ATTR_UPDATE = 'ATTR_UPDATE';
// TODO: Have innerHTML set be one
// It's used if there are more than X changes to children, it just assumes it
// should wipe children

function create(node) {
  let attrs = null;

  if (node.name === '#text') {
    // text node
    attrs = node.value;
  } else if (node.attr) {
    // normal element
    attrs = node.attrs;
  }

  return [
    CREATE,
    node.name,
    attrs,
  ];
}


function remove() {
  return [
    REMOVE,
  ];
}


function diffAttributes(left, right) {
  const diff = [];

  for (const key of Object.keys(right)) {
    const value = right[key];
    if (!(key in left)) {
      diff.push([ATTR_CREATE, key, value]);
    } else if (left[key] !== value) {
      diff.push([ATTR_UPDATE, key, value]);
    }
  }

  for (const key of Object.keys(left)) {
    if (!(key in right)) {
      diff.push([ATTR_DELETE, key, null]);
    }
  }
  return diff;
}


function updateAttributes(left, right) {
  // Need to CRUD on attributes
  return [
    UPDATE_ATTRS,
    diffAttributes(left, right),
  ];
}


function updateTagname(node) {
  // Need to CRUD on attributes
  return [
    UPDATE_TAGNAME,
    node.name,
  ];
}


module.exports = {
  create,
  remove,
  updateAttributes,
  updateTagname,
};
