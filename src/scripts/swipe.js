
export default class Swipe {
    constructor(element) {
        this.xDown = null;
        this.yDown = null;
        this.element = typeof element === 'string' ? document.querySelector(element) : element;

        this.element.addEventListener('touchstart', (e) => {
            this.xDown = e.touches[0].clientX;
            this.yDown = e.touches[0].clientY;
        }, false);

        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
    }

    onLeft(callback) {
        this.onLeft = callback;

        return this;
    }

    onRight(callback) {
        this.onRight = callback;

        return this;
    }

    onUp(callback) {
        this.onUp = callback;

        return this;
    }

    onDown(callback) {
        this.onDown = callback;

        return this;
    }

    handleTouchMove(evt) {
        if (!this.xDown || !this.yDown) {
            return;
        }

        const { clientX, clientY } = evt.touches[0];

        const xDiff = this.xDown - clientX;
        const yDiff = this.yDown - clientY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) { // Most significant.
            this[xDiff > 0 ? 'onLeft' : 'onRight']();
        } else {
            this[yDiff > 0 ? 'onUp' : 'onDown']();
        }

        // Reset values.
        this.xDown = null;
        this.yDown = null;
    }
}
