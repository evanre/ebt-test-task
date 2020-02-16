import plugins from 'gulp-load-plugins';
import browser from 'browser-sync';
import { argv } from 'yargs';
import config from '../config.json';

const $ = {
    plugin: plugins(),

    port: Number(argv.port || argv.p) || 3002,

    IS_DEV: !!(argv.dev),

    onError: () => $.plugin.notify.onError({
        title: '<%= error.plugin %>',
        message: '\nmessage:<%= error.message %>\nfileName:<%= error.fileName %>',
        // 'error' object contains:
        // name, message, stack ,fileName, plugin, showProperties, showStack properties
        sound: 'Submarine',
    }),

    errorHandler(...args) {
        $.onError().apply(this, args);
        this.emit('end');
    },

    dest(obj) {
        return obj[$.flags.env];
    },

    reload(done) {
        browser.reload();
        done();
    },

    config,
};

console.log(`IS_DEV: ${$.IS_DEV}`);

export const { errorHandler } = $;

export default $;
