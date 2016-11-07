'use strict';

let db = require('./db');
let movieRepo = require('./movie-repo');
let personRepo = require('./person-repo');

// let qf = {
//     pgNum: 1,
//     pgSize: 2,
//     sort: 'title desc'
// };

let edward = {
    firstname: 'Edward1',
    lastname: 'Zwick1',
    name: 'Edward Zwick1'
}; //id = 5

let movie = {
    id: 5, //new movie`
    rating_id: 4,
    director_id: 5, //edward zwick
    actors: [2, 3],
    tags: [1, 3],
    title: 'The Last Samurai123',
    releaseyr: 2003,
    score: 10,
    runtime: 154,
    lastplaydate: new Date(2015, 11, 20),
    overview: 'good samurai movie updated'
};

// movieRepo.update(movie)
//     .then((rows) => {
//         console.log(rows);
//     })
//     .catch((error) => {
//         console.log(error);
//     })
//     .finally(() => {
//         console.log('Finally done!!!');
//         db.destroy();
//     });

let express = require('express');
let app = express();
let port = process.env.PORT || 3000;

let movieRouter = express.Router();
movieRouter.route('/movies')
    .get((req, res) => {
        let qf = {};
        if (req.query.pgNum && req.query.pgSize && req.query.sort) {
            qf.pgNum = req.query.pgNum;
            qf.pgSize = req.query.pgSize;
            qf.sort = req.query.sort;
        }
        movieRepo.listMovies(qf)
            .then((movies) => {
                res.json(movies);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send(error);
            });
    });
movieRouter.route('/movies/:movieId')
    .get((req, res) => {
        movieRepo.getMovie(req.params.movieId)
            .then((movie) => {
                res.json(movie);
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send(error);
            });
    });

app.use('/api', movieRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

app.listen(port, () => console.log('started listening on port ' + port));