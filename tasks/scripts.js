// import path from 'path';
import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import $ from './helpers';
import babelConfig from '../.babelrc.json';

const scripts = () => browserify($.config.scripts.src)
    .transform('babelify', babelConfig)
    .bundle()
    .on('error', $.onError())
    .pipe(source('script.js'))
    .pipe(gulp.dest($.config.scripts.dest));

module.exports = scripts;
