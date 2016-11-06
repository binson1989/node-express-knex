'use strict';

let Promise = require('bluebird');
let db = require('./db');

module.exports = {
    listTags: () => {
        return db.select('id', 'name as text').from('tag').then();
    },
    listRatings: () => {
        return db.select('id', 'name as text').from('rating').then();
    },
    getMovie: (movieId) => {
        return db('movie as m')
            .join('person as p', 'p.id', 'm.director_id')
            .select('m.*', 'p.name as director')
            .where('m.id', movieId)
            .first().then();
    },
    listTagsFor: (movieId) => {
        return db('tag as t')
            .select('t.id', 't.name as text')
            .joinRaw('JOIN tag_movie tm ON tm.tag_id=t.id AND tm.movie_id=?', movieId)
            .then();
    },
    listActorsFor: (movieId) => {
        return db('person as p')
            .select(db.raw("p.id, p.firstname || ' ' || p.lastname as text"))
            .joinRaw('JOIN actor_movie am ON am.person_id=p.id AND am.movie_id=?', movieId)
            .then();
    },
    getMovieForEdit: (movieId) => {
        let pMovie = this.getMovie(movieId),
            pActors = this.listActorsFor(movieId),
            pTags = this.listTagsFor(movieId);
        
        return Promise.all([pMovie, pActors, pTags])
            .then((results) => {
                let movie = results[0];
                movie.actors = results[1];
                movie.tags = results[2];
                return movie;
            });
    }
};