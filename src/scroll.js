/* Scroll indicator styling */
/* https://codepen.io/tr13ze/pen/VjLLgJ */
const scroll = () => {
    $('.scroll-down').on("click", () => {
        $('html, body').animate({ scrollTop: $('section.grace-hopper-quote').offset().top }, 'slow');
        return false;
    });
};

export { scroll };