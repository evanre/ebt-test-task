// import path from 'path';
import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import $ from './helpers';
import babelConfig from '../.babelrc.json';

const scripts = () => browserify($.config.scripts.src, { debug: true })
    .transform('babelify', babelConfig)
    .bundle()
    .on('error', $.onError())
    .pipe(source('script.js'))
    .pipe(buffer())
    .pipe($.plugin.if($.IS_DEV, $.plugin.sourcemaps.init({ loadMaps: true })))
    .pipe($.plugin.if(!$.IS_DEV, $.plugin.uglify()))
    .pipe($.plugin.if($.IS_DEV, $.plugin.sourcemaps.write()))
    .pipe(gulp.dest($.config.scripts.dest));

export default scripts;
