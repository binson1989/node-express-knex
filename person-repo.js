'use strict';

let Promise = require('bluebird');
let db = require('./db');

module.exports = {
    listPeople: (searchText) => {
        return db('person')
            .whereRaw("LOWER(name) like '%' || LOWER(?) || '%'", searchText)
            .select('id', 'name as text')
            .orderBy('name')
            .then();
    }
};