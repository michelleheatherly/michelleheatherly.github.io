// Fonts
import(/* webpackPrefetch: true */ './assets/fonts/Play.css');

// Stylesheets
import(/* webpackPrefetch: true */ './assets/css/custom.scss');
import(/* webpackPrefetch: true */ './assets/css/custom.css');
import(/* webpackPrefetch: true */ './assets/css/bootstrap.css');
import 'animate.css/animate.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Javascript
import 'bootstrap';
import 'jquery-parallax.js/parallax';

// Custom Javascript
import { animateEffect } from './animate-effect';
import { scroll } from "./scroll";

// update the current year
const updateYear = () => {
    const year = new Date().getFullYear();
    const elm = document.getElementById("cYear");
    if (elm) elm.innerHTML = year;
}

// fade out the loader when page is loaded
const fadeOutEffect = () => {
    const fadeTarget = document.getElementById("pageLoader");
    const fadeEffect = setInterval(() => {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.visibility = "visible";
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            document.getElementById("pageLoader").style.visibility = "hidden";
            document.body.style.overflowY = "auto";
            document.body.style.height = "100%";
            clearInterval(fadeEffect);
            // after loader is faded out, update text and fade in content
            updateYear();
            fadeInEffect();
        }
    }, 200);
};

// fade in the content of the webpage
const fadeInEffect = () => {
    const fadeTarget = document.getElementById("wrapper");
    fadeTarget.style.opacity = 0;
    fadeTarget.style.visibility = "visible";
    let opacity = 0;
    const inEffect = setInterval(() => {
        if (opacity < 1) {
            opacity += 0.1;
            fadeTarget.style.opacity = opacity;
        } else {
            clearInterval(inEffect);
        }
    }, 200);
};

window.addEventListener("DOMContentLoaded", () => {
    fadeOutEffect();
});


scroll();
animateEffect();