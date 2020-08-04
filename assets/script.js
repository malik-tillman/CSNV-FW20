let page = '{{ template }}';
let vContent = document.body;

let removeTriggers = document.getElementsByClassName('.shopping-cart__cart-remove');
let itemContainer = document.getElementsByClassName('shopping-cart__item');
let removeAllTrigger = document.getElementById('remove-all__btn');
let indexCallback = 0;

let headerSection = document.querySelector('.header__container').style;
let marqueeSection = document.getElementsByClassName('marquee__section')[0].style;
let logoContainer = document.getElementsByClassName('logo__container')[0].style;
let navContainer = document.querySelector('.nav__container').style;
let rightsTextHTMLElement = document.getElementsByClassName('logo__rights--text')[0];
let rightsText = rightsTextHTMLElement.style;
let rightsHeight = rightsTextHTMLElement.offsetHeight + "px";

let cookiesContainer = document.querySelector("#disclaimer__container");

let lastScrollPos = 0;
let lastScrollDownPos = 0;
let lastScrollUpPos = 0;

const initialize = () => {
    /* Initialize Nav Dropdown Event Listener */
    let nav_dropdown_trigger = document.querySelectorAll(".nav--dropdown__trigger");

    if (nav_dropdown_trigger) {
        nav_dropdown_trigger.forEach(element => element.addEventListener('click', toggleDropdownMenu));
        //nav_dropdown_trigger.forEach(element => element.addEventListener('mouseleave', toggleDropdownMenu));
    }


    /* Initialize Menu Trigger Event Listener */
    let menu_triggers = [document.querySelector(".menu__button"), document.querySelector(".nav__mask")];
    if (menu_triggers && Array.isArray(menu_triggers))
        menu_triggers.forEach(element => element.addEventListener('click', toggleMenu));

    /* Initialize Cart Trigger */
    let header_cart_button = document.querySelector(".cart--icon__container");
    let close_cart_button = document.querySelector(".shopping-cart__close");
    let cart_triggers = [header_cart_button, close_cart_button];

    if (cart_triggers && Array.isArray(cart_triggers))
        cart_triggers.forEach(element => element.addEventListener('click', toggleCart));

    let bounceContainer = document.querySelector(".bounce--container")

    let logoContainer = document.querySelector(".logo__container").style;
    setTimeout(() => {
        //logoContainer.position = "fixed";
        //logoContainer.top = "0";
    }, 5000)
};

const toggleDropdownMenu = ev => {
    let clicked_element = ev.target;
    let clicked_dropdown_container = ev.target.parentElement.nextElementSibling;

    getAllSiblings(clicked_element.parentElement).forEach( e => {
        if (e.classList.contains('is-active')) {
            let dropdown_container = e.querySelector('.dropdown');

            if (dropdown_container) {
                dropdown_container.setAttribute('aria-expanded', 'false');
                //dropdown_container.style.maxHeight = "0";
            }

            e.classList.remove('is-active');
        }
    });

    if (clicked_element.parentElement.classList.contains('is-active')) {
        clicked_dropdown_container.setAttribute('aria-expanded', 'false');
        //clicked_dropdown_container.style.maxHeight = "0";
        clicked_dropdown_container.classList.remove('is-active')
        clicked_element.parentElement.classList.remove('is-active')
    }
    else {
        clicked_dropdown_container.setAttribute('aria-expanded', 'true');
        //clicked_dropdown_container.style.maxHeight = `${clicked_dropdown_container.scrollHeight}px`;
        clicked_dropdown_container.classList.add('is-active');
        clicked_element.parentElement.classList.add('is-active');
    }
};

const toggleMenu = ev => {
    console.log("toggle");
    let content = document.body;

    if (ev.type === 'resize' && content.classList.contains('side-bar--is-open'))
        content.classList.remove('side-bar--is-open');

    else content.classList[!content.classList.contains('side-bar--is-open') ? 'add' : 'remove']('side-bar--is-open');
};

const toggleCart = e => {
    let off_screen_cart = document.querySelector('.shopping-cart');
    let mainContainer = document.querySelector('.container');

    off_screen_cart.classList[!off_screen_cart.classList.contains('is-open') ? 'add' : 'remove']('is-open');

    // mainContainer.style.overflow = off_screen_cart.classList.contains('is-open') ? 'hidden' : 'initial';
};

const getAllSiblings = elem => {
    let siblings = [];
    let sibling = elem.parentNode.firstChild;

    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }

    return siblings;
};

const isLocalStorageAvailable = () => {
    let val = 'Storage Success';

    try {
        localStorage.setItem(val, val);
        localStorage.removeItem(val);
        return true;
    } catch (e) {
        return false;
    }
};

const processCallback = e => {
    if(e != null) {
        let response = JSON.parse(e.responseText);

        if(response.status === "bad_status"){
            console.log("error");
            console.log(response);
        }
        else {
            console.log("success");
            location.reload();

            localStorage.setItem('load_with_cart', 'true');
        }
    }

    location.reload();
};

const animateHeader = (color, height, margin, padding) => {
    headerSection.backgroundColor = color;
    rightsText.height = height;
    logoContainer.margin = margin;
    navContainer.paddingLeft = padding
};

document.addEventListener('DOMContentLoaded', () => {
    initialize();

    let loader = document.getElementById("loader");

    setTimeout(function () {
        if(page !== "index")
            document.body.style.overflowY = "scroll";
    }, 500);

    setTimeout(function () {
        loader.style.opacity = "0";
    }, 1000);
});

document.querySelector('.disclaimer--accept').addEventListener("click", function () {
    localStorage.setItem('isCookieAcceptedByPrompt', "true");
    cookiesContainer.style.opacity = "0";
    document.querySelector('.disclaimer--accept').style.width = "90%";

    setTimeout(function () {
        cookiesContainer.style.display = "none";
    }, 1000)
});

window.addEventListener("scroll", function() {
    // Record Scroll Pos
    let thisScrollPos = window.pageYOffset || document.documentElement.scrollTop;

    if(thisScrollPos <= lastScrollPos)
        lastScrollUpPos = thisScrollPos;
    else
        lastScrollDownPos = thisScrollPos;

    // Initial and Up
    if (thisScrollPos === 0 || thisScrollPos <= lastScrollPos) {
        if(vContent.classList.contains('scrolled__down')
            && Math.abs(lastScrollUpPos-lastScrollDownPos) > 250
            || thisScrollPos === 0)
            vContent.classList['remove']('scrolled__down');
    }


    // Down if (thisScrollPos > lastScrollPos)
    else {
        if(!vContent.classList.contains('scrolled__down')
            && Math.abs(lastScrollUpPos-lastScrollDownPos) > 50) {
            vContent.classList['add']('scrolled__down');
        }
    }



    /* Mobile/Negative Scroll Fix */
    lastScrollPos = thisScrollPos <= 0 ? 0 : thisScrollPos;
}, false);

if(localStorage.getItem('isCookieAcceptedByPrompt') === null && isLocalStorageAvailable()) {
    cookiesContainer.style.display = 'flex';
    setTimeout(function () {
        cookiesContainer.style.opacity = '1';
    }, 300);
} else {
    cookiesContainer.style.display = 'none';
}

Array.from(removeTriggers).forEach(trigger => {
    let localIndexCallback = indexCallback;
    trigger.addEventListener("click", function () {
        let variantID = itemContainer[localIndexCallback].classList[1];

        $.ajax({
            type: 'POST',
            url: '/cart/change.js',
            data: "quantity=0&line=" + (localIndexCallback + 1),
            success: processCallback(null, null),
            error: e => processCallback(e)
        });
    });
    indexCallback++;
});

if(removeAllTrigger != null)
    removeAllTrigger.addEventListener('click', function () {
        $.ajax({
            type: 'POST',
            url: '/cart/clear.js',
            success: e => processCallback(null, null),
            error: e => processCallback(e, "error")
        });
    });
