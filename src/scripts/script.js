import * as helpers from './helpers';
import ResponsiveEvent from './responsive-event';
import MoveNodes from './move-nodes';
import Carousel from './carousel';

const event = new ResponsiveEvent();

document.addEventListener('DOMContentLoaded', () => {
    const moveNodes = new MoveNodes();

    const carousel = new Carousel('.carousel', {
        bullet: {
            enable: false,
        },
    });

});

window.addEventListener('load', () => {
    window.addEventListener('responsive', () => {
        console.log('current breakpoint: ', window.responsive);
    });

    event.checkView(true);
});
