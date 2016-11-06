exports.seed = function (knex, Promise) {
  let tableName = 'actor_movie';
  let rows = [
    { person_id: 1, movie_id: 4 },
    { person_id: 2, movie_id: 3 },
    { person_id: 3, movie_id: 2 },
    { person_id: 4, movie_id: 1 }
  ];

  return knex(tableName).del()
    .then(() => {
      return knex.insert(rows).into(tableName);
    });
};