import https from 'https';
import gulp from 'gulp';
import { loremIpsum } from 'lorem-ipsum';
import pretty from 'pretty';
import deepmerge from 'deepmerge';
import $, { errorHandler } from './helpers';

const manageEnv = (env) => {
    env.addGlobal('lorem', (
        count = '10',
        units = 'sentences',
        makeSentence = false,
        sentenceLowerBound = 5,
        sentenceUpperBound = 15,
        format = 'plain',
    ) => {
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
        const str = loremIpsum({
            // More options here: https://www.npmjs.com/package/lorem-ipsum
            count, // Number of words, sentences, or paragraphs to generate.
            units, // Generate 'words', 'sentences', or 'paragraphs'.
            sentenceLowerBound, // Minimum words per sentence.
            sentenceUpperBound, // Maximum words per sentence.
            format, // Plain text or html
        });
        return units === 'words' && makeSentence ? `${capitalize(str)}.` : str;
    });

    env.addFilter('getUsers', (str, params = '', cb) => {
        https.get(`https://randomuser.me/api/?exc=login,location&nat=au,ca,gb,us${params}`, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => cb(null, JSON.parse(data).results));
        }).on('error', (err) => {
            console.log(`Error: ${err.message}`);
        });
    }, true);

    env.addFilter('slug', (str) => str && str.replace(/\s/g, '-', str).toLowerCase());

    env.addGlobal('assetPath', $.config.images.inline);

    env.addGlobal('picsumIds', $.config.picsumIds);

    env.addGlobal('isDEV', $.IS_DEV);

    env.addGlobal('merge', (x = {}, y = {}) => deepmerge(x, y, { arrayMerge: (_, src) => src }));

    env.addFilter('debug', (str) => console.log('[DEBUG_NJK]:', str));

    env.addFilter('interpolate', (str) => env.renderString(str));

    env.addGlobal('unique', () => Math.random() * 0xffffff | 0);
};

const templates = () => gulp.src(`${$.config.templates.src}/*.njk`)
    .pipe($.plugin.plumber({ errorHandler }))
    .pipe($.plugin.nunjucksRender({
        path: [$.config.templates.src],
        envOptions: { autoescape: false },
        manageEnv, // docs https://github.com/carlosl/gulp-nunjucks-render#environment
    }))
    .pipe($.plugin.injectString.replace('.njk', '.html'))
    .pipe($.plugin.injectString.custom((t) => pretty(t, { ocd: true })))
    .pipe(gulp.dest($.config.templates.dest));

export default templates;
