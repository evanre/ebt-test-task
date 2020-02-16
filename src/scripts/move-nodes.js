import * as helpers from './helpers';

export default class MoveNodes {
    constructor(options = null) {
        this.opts = {
            selector: 'data-move',
            breakpoints: 'data-on-breakpoints',
            insert: 'data-insert'
        };

        if (options instanceof Object) {
            this.opts = helpers.merge(this.opts, options);
        }

        this.store = [];

        this.init();

        window.addEventListener('responsive', this.checkView.bind(this));
    }

    init() {
        // Looking for all wrappers that should have moved elements
        [].slice.call(document.querySelectorAll(`[${this.opts.selector}]`)).forEach((wrap) => {
            const selector = wrap.getAttribute(this.opts.selector) || false;
            const bps = (wrap.getAttribute(this.opts.breakpoints) || '').split(' ').filter((s) => !!s);

            if (!selector || !bps.length) {
                return;
            }

            // Looking for moved elements
            [].slice.call(document.querySelectorAll(selector)).forEach((el, i) => {
                // Create comments, that we'll use as anchors on moved elements current place
                const comment = document.createComment(`${selector}-${i}`);

                // Put this comments on el current place
                helpers.insertAfter(comment, el);

                // Store current element.
                this.store.push({
                    el,
                    bps,
                    isMoved: false,
                    comment,
                    wrap,
                });
            });
        });
    }

    checkView() {
        const view = helpers.partition(this.store, ({ bps }) => bps.indexOf(window.responsive) !== -1);

        // inView
        view[0]
            .filter(({ isMoved }) => !isMoved) // Filter not yet moved items
            .forEach((obj) => {
                if (obj.wrap.getAttribute(this.opts.insert) === 'start') {
                    obj.wrap.insertBefore(obj.el, obj.wrap.childNodes[0]);
                } else {
                    obj.wrap.appendChild(obj.el);
                }
                obj.isMoved = true; // eslint-disable-line no-param-reassign
            });

        // notInView
        view[1]
            .filter(({ isMoved }) => isMoved) // Filter already moved items
            .forEach((obj) => {
                obj.comment.parentNode.insertBefore(obj.el, obj.comment);
                obj.isMoved = false; // eslint-disable-line no-param-reassign
            });
    }
}
