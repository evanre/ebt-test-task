import gulp from 'gulp';
import images from './tasks/images';
import icons from './tasks/icons';
import scripts from './tasks/scripts';
import server from './tasks/server';
import styles from './tasks/styles';
import templates from './tasks/templates';
import $ from './tasks/helpers';

// Watch for file changes
const watch = () => {
    gulp.watch($.config.images.listen, gulp.series(images, $.reload));
    gulp.watch($.config.icons.listen, gulp.series(icons, $.reload));
    gulp.watch($.config.scripts.listen, gulp.series(scripts, $.reload));
    gulp.watch($.config.styles.listen, gulp.series(styles));
    gulp.watch($.config.templates.listen, gulp.series(templates, $.reload));
};

// Build the "build" folder by running all of the above tasks
gulp.task('build',
    gulp.parallel(gulp.series(templates, styles), images, icons, scripts));

gulp.task('default',
    gulp.series('build', server, watch));

gulp.task('test',
    gulp.series(scripts));
