import * as helpers from './helpers';
import Swipe from './swipe';

export default class Carousel {
    /**
     * Create Carousel instance.
     * @param {(String|Node)} selector - element to initialize plugin
     * @param {Object} options - Carousel options
     */
    constructor(selector = '.carousel', options = {}) {
        this.carousel = selector;

        this.opts = {
            carousel: 'carousel',
            content: 'carousel__content',
            container: 'carousel__container',
            hidden: 'ghost',

            arrow: {
                enable: true,
                hideFocus: false,
                class: {
                    main: 'carousel__arrow',
                    prev: 'carousel__arrow--prev',
                    next: 'carousel__arrow--next',
                },
                tpl: {
                    prev: '<span class="ghost">Previous Slide</span>',
                    next: '<span class="ghost">Next Slide</span>',
                },
            },

            bullet: {
                enable: true,
                list: 'carousel__bullets',
                item: 'carousel__bullets-item',
                tpl: (txt) => `<span class="ghost">${txt}</span>`,
            },

            data: {
                activeSlide: 0,
                autoplay: 0,
                // autoplay: 5000,
                hxExisting: false,
                hxDefault: 'span',
                hxDefaultText: 'Slide',
                transition: 'slide', // 'none', 'slide', 'fade'
            },
        };

        this.salt = null;
        this.slides = [];
        this.bullets = [];

        if (typeof this.carousel === 'string') {
            [].slice.call(document.querySelectorAll(this.carousel)).forEach((el) => new Carousel(el, options));
        } else if (this.carousel instanceof Element) {
            this.init(options);
        } else {
            throw new Error(`${this.selector} should be a DOM Object or string`);
        }
    }

    init(options) {
        this.opts = helpers.merge(this.opts, options);

        const dataOpts = helpers.getDataOptions(this.carousel, 'carousel');
        this.opts.data = helpers.merge(this.opts.data, dataOpts);

        this.create();

        this.initEvents();
    }

    handleHeading(slide, idx) {
        let hx = slide.querySelector(this.opts.data.hxExisting);

        if (!hx) {
            hx = document.createElement(this.opts.data.hxDefault);
            hx.innerHTML = `${this.opts.data.hxDefaultText} ${idx}`;
            helpers.addClass(hx, this.opts.hidden);
            slide.insertBefore(hx, slide.firstChild);
        }

        helpers.setAttributes(hx, { tabindex: '-1' });

        return hx;
    }

    get activeSlide() {
        return Number(this.opts.data.activeSlide);
    }

    set activeSlide(id) {
        this.opts.data.activeSlide = id;
        helpers.setAttributes(this.carousel, { [this.attrName('activeSlide')]: id });
    }

    createArrow(dir) {
        const { arrow } = this.opts;

        const tpl = helpers.tpl2html(arrow.tpl[dir], (el) => el);

        const btn = document.createElement('BUTTON');
        helpers.setAttributes(btn, {
            type: 'button',
            id: `${arrow.class[dir]}-${this.salt}`,
            title: tpl.textContent,
            class: `${arrow.class.main} ${arrow.class[dir]}`,
        });

        if (this.opts.arrow.hideFocus) {
            helpers.setAttributes(btn, {
                'aria-hidden': true,
                'tabindex': '-1',
            });
        }

        btn.innerHTML = tpl.innerHTML;

        return btn;
    }

    createBullet(obj) {
        const { bullet } = this.opts;
        const li = document.createElement('li');
        helpers.setAttributes(li, {
            role: 'presentation',
        });

        const button = document.createElement('button');
        helpers.setAttributes(button, {
            'class': bullet.item,
            'id': obj.id,
            'data-id': obj.dataId,
            'role': 'tab',
            'aria-controls': obj.controlsId,
            'aria-selected': obj.selected,
            'tabindex': obj.selected ? '0' : '-1',
            // [this.opts.data.elementNumber]: obj.elementNumber,
        });
        button.innerHTML = bullet.tpl(obj.text);

        this.bullets.push(button);
        li.appendChild(button);
        return li;
    }

    getArrowDirrection(arrow = 'next') {
        const count = this.slides.length;
        const dir = arrow === 'prev' ? -1 : 1;
        return (dir + this.activeSlide + count) % count;
    }

    activateSlide(id = false, arrow, giveFocus) {
        const current = id === false ? this.getArrowDirrection(arrow) : id;

        // Do nothing if current slide already active
        if (this.activeSlide === current) {
            return;
        }

        // Manage bullets: deactivate active and activate current
        if (this.opts.bullet.enable) {
            helpers.setAttributes(this.bullets[this.activeSlide], { 'aria-selected': 'false', 'tabindex': '-1' });
            helpers.setAttributes(this.bullets[current], { 'aria-selected': 'true', 'tabindex': '0' });
        }

        // Manage slides: deactivate active and activate current
        helpers.setAttributes(this.slides[this.activeSlide], { 'aria-hidden': 'true' });
        helpers.setAttributes(this.slides[current], { 'aria-hidden': 'false' });

        // Update active slide
        this.activeSlide = current;

        if (giveFocus) {
            setTimeout(() => this.bullets[current].focus(), 0); // avoid bug on VoiceOver
        }
    }

    create() {
        this.container = this.carousel.querySelector(`.${this.opts.container}`);

        // Handle if container not found.
        if (!this.container) {
            throw new Error(`Carousel. Can't find container with selector: ".${this.opts.container}" within carousel element`);
        }

        this.salt = Math.random().toString(32).slice(2, 12);

        // carousel
        helpers.addClass(this.carousel, [`${this.opts.carousel}-transition-${this.opts.data.transition}`]);

        // container
        helpers.addClass(this.container, [this.opts.container]);

        // slides
        this.slides = [].slice.call(this.container.querySelectorAll(`.${this.opts.content}`));

        if (!this.slides.length) {
            console.warn('Carousel. No slides found!');
        }

        // create bullet list
        if (this.opts.bullet.enable) {
            const bulletList = document.createElement('ol');
            helpers.setAttributes(bulletList, { class: this.opts.bullet.list, role: 'tablist' });
        }

        this.slides.forEach((slide, id) => {
            const slideId = `${this.opts.carousel}-${this.salt}-${id}`;
            const bulletId = `${this.opts.carousel}-label-${this.salt}-${id}`;
            const hx = this.handleHeading(slide, id);

            helpers.setAttributes(slide, {
                'role': 'tabpanel',
                'id': slideId,
                'data-id': id,
                'aria-hidden': (this.activeSlide === id ? 'false' : 'true'),
                'aria-labelledby': bulletId,
            });

            // add bullet
            if (this.opts.bullet.enable) {
                bulletList.appendChild(this.createBullet({
                    id: bulletId,
                    dataId: id,
                    text: hx.textContent,
                    controlsId: slideId,
                    selected: this.activeSlide === id,
                }));
            }
        });

        if (this.opts.bullet.enable) {
            this.carousel.insertBefore(bulletList, this.container);
        }

        // Create arrow arrows
        if (this.opts.arrow.enable) {
            this.carousel.insertBefore(this.createArrow('prev'), this.container);
            this.carousel.appendChild(this.createArrow('next'));
        }

        // set up active slide
        helpers.setAttributes(this.carousel, { [this.attrName('activeSlide')]: this.activeSlide });
    }

    attrName = (attr) => `data-carousel-${helpers.camelToSnake(attr, '-')}`;

    arrowHandler() {
        return this.carousel;
    }

    initEvents() {
        document.body.addEventListener('click', ({ target }) => {
            const bullet = helpers.findAncestor(target, this.opts.bullet.item);
                if (bullet) {
                    this.activateSlide(Number(bullet.dataset.id), false, true);
                    return;
                }

            // Click on prev
            if (helpers.findAncestor(target, this.opts.arrow.class.prev)) {
                this.activateSlide(false, 'prev');
                return;
            }

            // Click on next
            if (helpers.findAncestor(target, this.opts.arrow.class.next)) {
                this.activateSlide(false, 'next');
            }
        });

        document.body.addEventListener('keydown', (e) => {
            // IE11 key map is different from other browsers.
            const keysPrev = ['ArrowLeft', 'Left', 'ArrowUp', 'Up'];
            const keysNext = ['ArrowRight', 'Right', 'ArrowDown', 'Down'];

            // Filter only needed key downs and carousel in target;
            if (
                ['Home', 'End'].concat(keysPrev, keysNext).indexOf(e.key) === -1
                || helpers.findAncestor(e.target, this.opts.carousel) === -1
            ) {
                return;
            }

            // e.preventDefault();
            const bullet = helpers.findAncestor(e.target, this.opts.bullet.item);
            if (bullet) {
                // Key Home = first tab
                if (e.key === 'Home') {
                    e.preventDefault();
                    this.activateSlide(0, false, true);
                    return;
                }

                // Key End => last tab
                if (e.key === 'End') {
                    e.preventDefault();
                    this.activateSlide(this.slides.length - 1, false, true);
                    return;
                }

                // Key Left/Up without Ctrl => prev tab
                if ((keysPrev.indexOf(e.key) !== -1) && !e.ctrlKey) {
                    e.preventDefault();
                    this.activateSlide(false, 'prev', true);
                    return;
                }

                // Key Right/Down without Ctrl => next tab
                if ((keysNext.indexOf(e.key) !== -1) && !e.ctrlKey) {
                    e.preventDefault();
                    this.activateSlide(false, 'next', true);
                    return;
                }
            }

            // Keyboard events in panels
            const panel = helpers.findAncestor(e.target, this.opts.content);
            if (panel && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && e.ctrlKey) {
                // avoid bug on VoiceOver
                setTimeout(() => this.bullets[Number(panel.dataset.id)].focus(), 0);
            }
        }, true);

        const autoplay = Number(this.opts.data.autoplay);
        if (autoplay) {
            setInterval(() => {
                this.activateSlide(false, 'next');
            }, autoplay);
        }

        const swiper = new Swipe(this.carousel);
        swiper.onLeft(() => {
            this.activateSlide(false, 'next');
        });
        swiper.onRight(() => {
            this.activateSlide(false, 'prev');
        });
    }
}
