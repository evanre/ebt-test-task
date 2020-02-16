import gulp from 'gulp';
import browser from 'browser-sync';
import $, { errorHandler } from './helpers';

// Compile Sass into CSS
const styles = () => gulp.src($.config.styles.src)
    .pipe($.plugin.plumber({ errorHandler }))
    .pipe($.plugin.injectString.prepend(`$asset-path: "${$.config.images.inline}";`))
    .pipe($.plugin.if($.IS_DEV, $.plugin.sourcemaps.init()))
    .pipe($.plugin.sass({
        includePaths: $.config.styles.includePaths,
    }))
    .pipe($.plugin.if($.IS_DEV, $.plugin.sourcemaps.write()))
    .pipe($.plugin.if(!$.IS_DEV, $.plugin.groupCssMediaQueries()))
    // .pipe($.plugin.if(!$.IS_DEV, $.plugin.purgecss({
    //     content: [`${$.config.templates.dest}/**/*.html`],
    //     whitelistPatterns: [/^-/, /^carousel/], // exclude dashed classes
    // })))
    .pipe($.plugin.if(!$.IS_DEV, $.plugin.cleanCss()))
    .pipe(gulp.dest($.config.styles.dest))
    .pipe(browser.stream());

export default styles;
