const {intersection} = require('lodash');

const get = require('./get');

async function resolveDocuments(self, objectIds) {
  const documents = [];
  for (const oid of objectIds) {
    const doc = await self.getDocument(oid);
    documents.push(doc);
  }
  return documents;
}

async function query(query) {
  const self = this;
  let listOfFieldLookup = [];
  if(query===undefined) return [];
  if (query._id && Object.keys(query).length === 1) {
    const {_id} = query;
    return [await get.call(this, _id)]
  }

  for (const queryFieldName in query) {
    const queryFieldValue = query[queryFieldName];
    const fieldTree = this.getFieldTree(queryFieldName);
    if (!fieldTree) {
      continue;
    }

    // At this point, query can still be either strict or diverse. Let's sort this out
    const queryFieldValueType = typeof queryFieldValue;

    const keys = [];


    // We try to look up the easy cases, strict equality
    if (['string', 'number'].includes(typeof queryFieldValue)) {
      let operator = '$eq';
      const value = await fieldTree.find(queryFieldValue, operator);
      if (value) {
        listOfFieldLookup = listOfFieldLookup.concat(value)
      } else {
        throw new Error(`No value ${queryFieldName} found : ${value}, query(${JSON.stringify(query)})`)
      }
    } else {
      if (Array.isArray(queryFieldValue)) throw new Error(`Not supported array input. Please open a Github issue to specify your need.`);
      if (typeof queryFieldValue === "object" && !Array.isArray(queryFieldValue)) {
        const operators = Object.keys(queryFieldValue).filter((el) => el[0] === '$');

        // TODO : Move to Promise.all. Expect changes, no point to not parallel the calls. We use this for now.
        for (let operator of operators) {
          const value = await fieldTree.find(queryFieldValue[operator], operator);
          if (value) {
            listOfFieldLookup = listOfFieldLookup.concat(value)
          } else {
            throw new Error(`No value ${queryFieldName} found : ${value}, query(${JSON.stringify(query)})`)
          }
        }
      }
    }
  }

  const matchingObjectIds = intersection(listOfFieldLookup);
  const documents = await resolveDocuments(self, matchingObjectIds);
  return documents;
};
module.exports = query;
