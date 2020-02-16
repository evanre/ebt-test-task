import gulp from 'gulp';
import $ from './helpers';

// Copy and compress img
const images = () => gulp.src($.config.images.src, { nodir: true })
    .pipe($.plugin.imagemin())
    .pipe(gulp.dest($.config.images.dest));

export default images;
