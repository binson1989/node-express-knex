// 'use strict';

let Promise = require('bluebird');
let db = require('./db');
let util = require('./dbutil');

module.exports = {
    listTags: () => {
        return db.select('id', 'name as text').from('tag').then();
    },
    listRatings: () => {
        return db.select('id', 'name as text').from('rating').then();
    },
    getMovies: () => {
        return db.select('*').from('movie').then();
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
        let pMovie = module.exports.getMovie(movieId),
            pActors = module.exports.listActorsFor(movieId),
            pTags = module.exports.listTagsFor(movieId);
        
        return Promise.all([pMovie, pActors, pTags])
            .then((results) => {
                let movie = results[0];
                movie.actors = results[1];
                movie.tags = results[2];
                return movie;
            });
    },
    listMovies: (qf) => {
        let result = {},
            sort = util.parseSortString(qf.sort, 'm.id'),
            pgSize = Math.min(qf.pgSize, 10),
            offset = (qf.pgNum - 1) * pgSize;
        
        return db('movie as m')
            .select('m.id', 'm.title', 'm.lastplaydate', 'm.score', 'm.runtime', 'm.releaseyr', 'r.name as rating')
            .select(db.raw('count(*) OVER() AS _fullcount_'))
            .join('rating as r', 'r.id', 'm.rating_id')
            .limit(pgSize).offset(offset)
            .orderBy(sort.column, sort.direction)
            .then((rows) => {
                if (rows.length < 1) {
                    return null;
                }
                result.total = rows[0]._fullcount_;
                result.pgSize = pgSize;
                result.items = rows;
                return result;
            });
    },
    deleteMovie: (movieId) => {
        return db('movie').where('id', movieId).del().then();
    },
    add: (m) => {
        //pull actors/tags from the movie graph
        let actors = m.actors,
            tags = m.tags;
        delete m.actors;
        delete m.tags;

        //ensure no ID is present for an INSERT, we want the DB to assign a new one
        delete m.id;

        return db.transaction((trx) => {
            return trx.insert(m, 'id').into('movie')
                .then((ids) => {
                    m.id = ids[0];
                    actors = util.idToMMObjArr('person_id', actors, 'movie_id', m.id);
                    tags = util.idToMMObjArr('tag_id', tags, 'movie_id', m.id);
                    if (actors.length) {
                        return trx.insert(actors).into('actor_movie');
                    }
                })
                .then(() => {
                    if (tags.length) {
                        return trx.insert(tags).into('tag_movie');
                    }    
                })
                .then(() => {
                    return m.id;
                });
        });
    },
    getTagIdsFor: (movieId) => {
        return db('tag_movie').pluck('tag_id').where('movie_id', movieId).then();
    },
    getActorIdsFor: (movieId) => {
        return db('actor_movie').pluck('person_id').where('movie_id', movieId).then();
    },
    //updates a movie using the given movie graph
    update: (m) => {
        let id = m.id,
            newActorIds = m.actors,
            newTagIds = m.tags;
        delete m.tags;
        delete m.actors;
        delete m.id;

        let actorDelta, tagDelta;

        //get existing actor/tag ids for the movie
        return Promise.all([module.exports.getActorIdsFor(id), module.exports.getTagIdsFor(id)])
            .then((results) => {
                actorDelta = util.getMMDelta(newActorIds, results[0], 'person_id', 'movie_id', id);
                tagDelta = util.getMMDelta(newTagIds, results[1], 'tag_id', 'movie_id', id);
            })
            .then(() => {
                return db.transaction((trx) => {
                    return Promise.all([
                        trx('movie').where('id', id).update(m),
                        trx('actor_movie').whereIn('person_id', actorDelta.del).andWhere('movie_id', id).del(),
                        trx('tag_movie').whereIn('tag_id', tagDelta.del).andWhere('movie_id', id).del(),
                        trx.insert(actorDelta.add).into('actor_movie'),
                        trx.insert(tagDelta.add).into('tag_movie')
                    ]);
                });
            });
    }
};