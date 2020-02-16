import deepmerge from 'deepmerge';

export const isArr = (arr) => arr && Array.isArray(arr);

export const isObj = (obj) => obj && typeof obj === 'object';

export const merge = (...args) => deepmerge.all(args, { arrayMerge: (_, src) => src });

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {Function} fn      A function to be executed after delay milliseconds. The `this` context and all arguments are
 *                             passed through, as-is, to `callback` when the debounced-function is executed.
 * @param  {Number}   delay   A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 *
 * @return {Function} A new, debounced function.
 */
export const debounce = (fn, delay) => {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
};

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {Function} fn         A function to be executed after delay milliseconds. The `this` context and all arguments are
 *                              passed through, as-is, to `callback` when the throttled-function is executed.
 * @param {Number}   threshold  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param {Object}   scope      Optional, you can pass context for callback function.
 *
 * @return {Function} A new, throttled, function.
 */
export const throttle = (fn, threshold = 250, scope) => {
    let last;
    let deferTimer;
    return (...list) => {
        const context = scope || this;
        const now = +new Date();
        const args = list;
        if (last && now < last + threshold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                fn.apply(context, args);
            }, threshold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
};

/**
 * Add class/classes to element.
 * @example
 * addClass(elem, 'your-class')
 * addClass(elem, ['your-class1', 'your-class2', 'your-class3'])
 *
 * @param {Element} el DOM HTML Element
 * @param {String||Array} classNames class or list of classes to add
 */
export const addClass = (el, classNames) => {
    [].concat(classNames)
        .forEach((className) => {
            if (el.classList) {
                el.classList.add(className); // IE 10+
            } else {
                el.className += ` ${className}`; // IE 8+
            }
        });
};

/**
 * Remove element class/classes.
 *
 * @example
 * removeClass(elem, 'your-class')
 * removeClass(elem, ['your-class1', 'your-class2', 'your-class3'])
 *
 * @param {Element} el DOM HTML Element
 * @param {String||Array} classNames class or list of classes to remove
 */
export const removeClass = (el, classNames) => {
    [].concat(classNames)
        .forEach((className) => {
            if (el.classList) {
                el.classList.remove(className); // IE 10+
            } else {
                el.className = el.className.replace(new RegExp(`(^|\\b)${className.split(' ')
                    .join('|')}(\\b|$)`, 'gi'), ' '); // IE 8+
            }
        });
};

/**
 * Checks if element has className.
 *
 * @example
 * hasClass(elem, 'your-class')
 * Accept one or more classes and checks if el has at least one of them
 * @example
 * hasClass(elem, 'class');
 * hasClass(elem, 'class1 class2');
 * hasClass(elem, ['class1', 'class2']);
 *
 * @param {Element} el, DOM HTML Element
 * @param {String|Array} className, class or list of classes to check
 * @returns {Boolean} `true` or `false`
 *
 * @todo: add inclusive option, to check if element should has all passed classes or at least one of them.
 */
export const hasClass = (el, className) => {
    const classNames = Array.isArray(className) ? className : [].concat(className.split(' '));

    if (el.classList) {
        return Boolean(classNames.filter((name) => el.classList.contains(name)).length); // IE 10+
    }

    // If anchor within a svg element in IE; https://caniuse.com/#search=classList
    const classProp = Object.prototype.toString.call(el) === '[object SVGAElement]' ? el.className.baseVal : el.className;

    return new RegExp(`(^| )(${classNames.join('|')})( |$)`, 'gi').test(classProp); // IE 8+ ?
};

/**
 * Switch element className.
 *
 * @example
 * toggleClass(elem, 'your-class')
 *
 * @param {Element} el DOM HTML Element
 * @param {String} className class to check
 * @returns {bool} `true` or `false`
 */
export const toggleClass = (el, className) => {
    if (hasClass(el, className)) {
        removeClass(el, className);
    } else {
        addClass(el, className);
    }
};

/**
 * Set list of attributes on a given element
 *
 * @param {Node} el, Node element to set attributes to.
 * @param {Object} attrs, list of attributes.
 */
export const setAttributes = (el, attrs) => {
    Object
        .keys(attrs)
        .forEach((attr) => {
            el.setAttribute(attr, attrs[attr]);
        });
};

/**
 * Check wether attribute exists on element
 *
 * @param {Node} el, Node to check attr.
 * @param {String} attr, attributes to check.
 * @param {Function} cb, return attribute value with given cb
 */
export const checkAttr = (el, attr, cb = (v) => v) => {
    const val = el.getAttribute(attr);
    return val ? cb(val) : false;
};

/**
 * Find ancestor by className, works like parents() method in jQuery.
 * http://jsfiddle.net/8RfbT/69/
 *
 * @param {Element|EventTarget} el DOM HTML Element
 * @param {String} cls parent class
 * @returns {Node} parent node
 */
export const findAncestor = (el, cls) => {
    let elem = el;
    while (!hasClass(elem, cls)) {
        if (elem === document.body) {
            elem = null;
            break;
        }
        elem = elem.parentNode;
    }

    return elem;
};

/**
 * Convert templates string into html dom element
 *
 * @param {String} tpl, template to convert
 * @param {Function} cb, method which should be used
 * @returns {Node|HTMLCollection} Returns ready html code, depends on used method
 */
export const tpl2html = (tpl, cb = (el) => el.firstElementChild) => {
    const div = document.createElement('div');
    div.innerHTML = tpl;
    return cb(div);
};

export const checkSmoothScroll = () => {
    let supports = false;
    try {
        document.createElement('div').scrollTo({
            top: 0,
            get behavior() {
                supports = true;
                return 'smooth';
            },
        });
    } catch (err) {
        console.log('Smooth scroll is not supported!', err);
    }
    return supports;
};

/**
 * Convert templates string into html dom element
 *
 * @param {Object} dataset, object to process
 * @param {String} prefix, prefix to remove from object key
 * @return {Object} filtered object
 */
export const getDataOptions = ({ dataset }, prefix = '') => Object.keys(dataset)
    .filter((key) => key.indexOf(prefix) === 0)
    .reduce((obj, key) => {
        let newKey = key.substring(prefix.length);
        newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);
        obj[newKey] = dataset[key]; // eslint-disable-line no-param-reassign
        return obj;
    }, {});

export const snakeToCamel = (str) => str.replace(/[-_]\w/g, (g) => g[1].toUpperCase());

export const camelToSnake = (str, delim = '_') => str.replace(/[A-Z]/g, (char) => `${delim}${char[0].toLowerCase()}`);

/**
 * Inserting Node element after given element.
 *
 * @param {Node} newNode, new Node element to be inserted after refNode.
 * @param {Node} refNode, reference Node element for inserting.
 */
export const insertAfter = (newNode, refNode) => {
    refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
};

export const offset = (element) => {
    let el = element;
    let left = 0;
    let top = 0;
    while (el) {
        left += el.offsetLeft;
        top += el.offsetTop;
        el = el.offsetParent;
    }

    return [top, left];
};

/**
 * Split array into two chunks using filter callback.
 *
 * @param {Array} array, Given array to be partitioned.
 * @param {Function} fn, reference Node element for inserting.
 */
export const partition = (array, fn) => {
    const [pass, fail] = [[], []];
    array.forEach((e, idx, arr) => (fn(e, idx, arr) ? pass : fail).push(e));
    return [pass, fail];
};

export const clearElement = (el) => {
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
};
