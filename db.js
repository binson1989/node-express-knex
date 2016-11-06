'use strict';

let config = require('./knexfile');
let knex = require('knex')(config.development);

module.exports = knex;