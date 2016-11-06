exports.seed = function (knex, Promise) {
  let tableName = 'tag';
  let rows = [
    { name: '3D' },
    { name: 'Animation' },
    { name: 'Thriller' },
    { name: 'Comedy' }
  ];

  return knex(tableName).del()
    .then(() => {
      return knex.insert(rows).into(tableName);
    });
};