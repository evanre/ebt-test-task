import browser from 'browser-sync';
import $ from './helpers';

const server = (done) => {
    browser.init({
        server: $.config.templates.dest,
        port: $.port,
        open: false,
        watchOptions: {
            // This introduces a small delay when watching for file change events
            // to avoid triggering too many reloads
            debounceDelay: 500,
        },
    });
    done();
};

export default server;
