import gulp from 'gulp';
import $, { errorHandler } from './helpers';

const icons = () => gulp.src($.config.icons.src)
    .pipe($.plugin.plumber({ errorHandler }))
    .pipe($.plugin.iconfontTemplate({
        fontName: $.config.icons.name,
        path: $.config.icons.htmlSrc,
        targetPath: $.config.icons.htmlDist,
    }))
    .pipe($.plugin.iconfontCss({
        fontName: $.config.icons.name,
        path: $.config.icons.cssSrc,
        targetPath: $.config.icons.cssDist,
        fontPath: $.config.icons.fontPath,
    }))
    .pipe($.plugin.iconfont({
        fontName: $.config.icons.name,
        prependUnicode: true, // recommended option
        formats: ['woff', 'woff2'],
        timestamp: Math.round(Date.now() / 1000), // recommended to get consistent builds when watching files
    }))
    .pipe(gulp.dest($.config.icons.dest));

export default icons;
