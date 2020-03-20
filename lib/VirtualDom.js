const parse5 = require('parse5');

class VirtualDom {
  constructor(html) {
    this.root = parse5.parse(html);
  }

  diffAndUpdate(newHTML) {
    const otherRoot = parse5.parse(newHTML);
    const nodeDiff = this.diffNode(this.root, otherRoot);
    this.root = otherRoot;
    return nodeDiff;
  }

  diffNode(left, right) {
    console.log('left', JSON.stringify(left));
    console.log('right', right);
    if (left.nodeName !== right.nodeName) {
    }
  }

}



module.exports = VirtualDom;
