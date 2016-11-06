exports.seed = function (knex, Promise) {
  let tableName = 'movie';
  let rows = [
    { title: 'Movie 1', rating_id: 1, director_id: 1, overview: 'good1', releaseyr: 2000, score: 7, runtime: 100, lastplaydate: new Date(2000, 9, 1) },
    { title: 'Movie 2', rating_id: 2, director_id: 2, overview: 'good2', releaseyr: 2001, score: 8, runtime: 110, lastplaydate: new Date(2001, 9, 1) },
    { title: 'Movie 3', rating_id: 3, director_id: 3, overview: 'good3', releaseyr: 2002, score: 9, runtime: 120, lastplaydate: new Date(2002, 9, 1) },
    { title: 'Movie 4', rating_id: 4, director_id: 4, overview: 'good4', releaseyr: 2003, score: 10, runtime: 130, lastplaydate: new Date(2003, 9, 1) }
  ];

  return knex(tableName).del()
    .then(() => {
      return knex.insert(rows).into(tableName);
    });
};