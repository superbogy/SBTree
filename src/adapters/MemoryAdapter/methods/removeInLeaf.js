async function removeInLeaf(leafName, identifier) {
  const identifiers = [];
  if (this.leafs[leafName]) {
    const index = this.leafs[leafName].meta.identifiers.indexOf(identifier);
    if (index >= 0) {
      this.leafs[leafName].meta.size -= 1;
      this.leafs[leafName].meta.identifiers.splice(index, 1);
      this.leafs[leafName].data.keys.splice(index, 1);
      identifiers.push(identifier);
    }
  }
  return identifiers;
}

module.exports = removeInLeaf;
