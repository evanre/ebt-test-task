const gulp = require('gulp');
const images = require('./tasks/images');
const scripts = require('./tasks/scripts');
const server = require('./tasks/server');
const styles = require('./tasks/styles');
const templates = require('./tasks/templates');
const $ = require('./tasks/helpers');

// Watch for file changes
const watch = () => {
    gulp.watch($.config.images.listen, gulp.series(images, $.reload));
    gulp.watch($.config.scripts.listen, gulp.series(scripts, $.reload));
    gulp.watch($.config.styles.listen, gulp.series(styles));
    gulp.watch($.config.templates.listen, gulp.series(templates, $.reload));
};

// Build the "build" folder by running all of the above tasks
gulp.task('build',
    gulp.series(images, scripts, styles, templates));

gulp.task('default',
    gulp.series('build', server, watch));

gulp.task('test',
    gulp.series(scripts));
