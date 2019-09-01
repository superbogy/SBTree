# SBTree

[![NPM Version](https://img.shields.io/npm/v/sbtree.svg?&style=flat-square)](https://www.npmjs.org/package/sbtree)
[![Build Status](https://api.travis-ci.org/Alex-Werner/SBTree.svg?branch=master)](https://travis-ci.com/Alex-Werner/SBTree)

> Fast document store using B+ Tree for fields. Adapters support for In-Memory and FileSystem 

Complexity : `O(log(n))` - Help welcome to pass it `O(n)`.  

This library's goal is to provide a way to quickly store document-based data in-memory or on the filesystem.  
It uses a field-specific indexing system relaying on B+Tree structure.  
This allow to handle a lot of data, and have them indexed without the need to keep the whole dataset in-memory. 
Most of the databases uses B-Tree (MongoDB, CouchDB) or B+Tree (InnoDB, MariaDB, MySQL).


### Table of Contents
 - [Installation](#installation)
 - [Usage](#usage)
 - [Documentation](#documentation)
    - [Events](/doc/events.md)
    - [API](/doc/api.md)
 - [Adapters](#adapters)
 - [FAQ](#faq)
 
 
## Installation 

`npm install sbtree`

## Usage

```$xslt
mkdir myproject
cd myproject
npm init
npm install sbtree
touch index.js
```
 
And there just use that snipets to start playing ! : 


```js
const SBTree = require('SBTree');
const tree = new SBTree({order:100});
const start = async function () {
  const doc = {_id:'507f1f77bcf86cd799439011',name:"Alex", age:28};
  const doc2 = {name:"Jean", age:30}
  await tree.insertDocuments(doc);
  await tree.insertDocuments(doc2);

  // [ { _id: '507f1f77bcf86cd799439011', name: 'Alex', age: 28 } ]
  const search = await tree.findDocuments({age:28});

  // [ { _id: '507f1f77bcf86cd799439011', name: 'Alex', age: 28 } ]
  const get = await tree.getDocument(doc._id);
}
start();
```


## Documentation 

- [API](/doc/api.md)


## Adapters 

- `MemoryAdapter` : Default adapter. Set Store inMemory. Limited by heap memory available (good enough).
- `FsAdapter` : Set Data in filesystem. Limitation should be disksize on optimized order.

## FAQ : 

### What is a B+ Tree

Balanced Tree, are a n-ary type of tree data structure that self-balance.   
It allow to maintain sorted data in order to provide fast and complexity controlled (in logarithmic time) insertions, deletions, search or sequential access.  

### Why B+Tree and not B Tree

I have no idea why many DB uses BTree. 
The B+Tree, at the difference of B-Tree uses a linked list and have all elements in the last level, which allow us to totally removes identifiers and most of the data from the tree inner data.  
B+Tree is easier to implement (due to some condition not existing, it's clear where all data are, and references are just that, instead of holding data).  
That basically allow us to deal with bigger dataset.   

### Why node engine v.12 limitation

For development purpose, I decided that being able to console view the object without all the nested parent thing was handy a clean.   
That's the only reason. But Node V.12 is old enough already, no point sticking to the past.  
