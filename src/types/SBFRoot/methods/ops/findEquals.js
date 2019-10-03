module.exports = async function findEquals(value){
  let leafIndex = 0;
  this.keys.forEach((_key)=>{
    if(value<=_key) return;
    leafIndex++;
  });

  let result = [];
  let p = []

  const {childrens} = this;
  if(childrens.length===0){
    result.push(this.identifiers[leafIndex])
  }else{
    const left = childrens[leafIndex];
    if(left){
      p.push(left.find(value));
    }
    // We also check the leaf nearby
    if(childrens.length>leafIndex+1){
      const right = childrens[leafIndex+1];
      p.push(right.find(value));
    }

    await Promise.all(p).then((res)=>{

      res.forEach((_pRes)=>{
        result = result.concat(_pRes);
      })
    });
  }
  return result;

};
