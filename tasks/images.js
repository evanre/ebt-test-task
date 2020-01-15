import gulp from 'gulp';
import $ from './helpers';

// Copy and compress img
const images = () => gulp.src($.config.images.src)
    .pipe($.plugin.imagemin())
    .pipe(gulp.dest($.config.images.dest));

module.exports = images;
