'use strict';

let db = require('./db');
let movieRepo = require('./movie-repo');
let personRepo = require('./person-repo');

movieRepo.getMovieForEdit(3)
    .then((rows) => {
        console.log(rows);
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        console.log('Finally done!!!');
        db.destroy();
    });