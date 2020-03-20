const parse5 = require('parse5');

function isSame(left, right) {
}


function cleanAst(ast){
  if (ast.parentNode) {
    delete ast.parentNode;
  }

  if (ast.namespaceURI) {
    delete ast.parentNode;
  }

  // TODO: probably condense nodeName and tagName
}

function parse(html) {

}


module.exports = {
  parse,
  isSame,
};




