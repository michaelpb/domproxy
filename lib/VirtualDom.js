const {parse, generateNodeDiffs} = require('./domutils.js');


class VirtualDom {
  constructor(html) {
    this.root = parse(html);
  }

  diffAndUpdate(newHTML) {
    const otherRoot = parse(newHTML);
    const nodeDiff = this.diffNode(this.root, otherRoot);
    this.root = otherRoot;
    return nodeDiff;
  }

  diffNode(left, right, diffs=null, indexBreadcrumb=null) {
    if (!diffs) {
      diffs = [];
      indexBreadcrumb = [];
      //console.log('left', JSON.stringify(left));
      //console.log('right', JSON.stringify(right));
      console.log('left', left);
      console.log('right',right);
    }

    // Extend diffs with diffs for this node
    generateNodeDiffs(left, right, diffs, indexBreadcrumb);

    // Now, run through children of both in parallel, diffing those
    const leftChildren = left && left.childNodes ? left.childNodes : [];
    const rightChildren = right && right.childNodes ? right.childNodes : [];

    const childCount = Math.max(leftChildren.length, rightChildren.length);

    // note: No use of heuristics, keys, or "run detection", should use better
    // diffing algo
    let i = 0;
    while (i < childCount) {
      const leftChild = leftChildren[i] || null;
      const rightChild = rightChildren[i] || null;
      const breadcrumb = indexBreadcrumb.concat([i]);
      this.diffNode(leftChild, rightChild, diffs, breadcrumb);
      i++;
    }
    return diffs;
  }

}



module.exports = VirtualDom;
