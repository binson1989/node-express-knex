exports.seed = function (knex, Promise) {
  let tableName = 'tag_movie';
  let rows = [
    { tag_id: 1, movie_id: 4 },
    { tag_id: 2, movie_id: 3 },
    { tag_id: 3, movie_id: 2 },
    { tag_id: 4, movie_id: 1 }
  ];

  return knex(tableName).del()
    .then(() => {
      return knex.insert(rows).into(tableName);
    });
};