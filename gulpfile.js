let gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', () => {
    nodemon({
        script: 'app.js',
        ext: 'js',
        env: {
            PORT: 9100
        },
        ignore: ['./node_modules/**', './migrations/**', './seeds/**', './typings/**']
    })
    .on('restart', () => console.log('Restarting node app...'));
});
