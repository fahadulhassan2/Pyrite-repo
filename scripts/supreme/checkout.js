let prevPath = window.location.pathname;


const sleepSupreme = (ms = 0) => {
    return new Promise((r) => setTimeout(r, ms));
};
const sizeMap = {
    "": "",
    random: "random",
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "XLarge",
    Hat: "Random",
    Hat: "6 7/8",
    Hat: "7",
    Hat: "7 1/8",
    Hat: "7 1/4",
    Hat: "7 3/8",
    Hat: "7 1/2",
    Hat: "7 5/8",
    Hat: "7 3/4",
    Hat: "7 7/8",
    Hat: "8",
    Hat: "8 1/8",
};


const fillSupreme = (selector, value) => {
    const el = document.querySelector(selector);
    if (!el) {
        return;
    }

    el.dispatchEvent(new Event("focus", { bubbles: true }));

    el.value = value;
    el.setAttribute("value", value);

    el.dispatchEvent(new Event("keydown", { bubbles: true }));
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("keyup", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
};

const waitForPageLoaded = async () => {
    return await new Promise(async (resolve, reject) => {
        do {
            console.log(document.readyState);
            await sleepSupreme(10);
        } while (document.readyState != "complete");

        console.log(document.readyState);

        resolve();
    });
};



const fillCheckout = async (profile) => {
    // const form = document.querySelector('form[action="/checkout"]');
    const form = document.getElementById('checkout_form');
    if (!form) {
        console.log("no form");
        return;
    }

    let country =
        profile.Country == "United States"
            ? "USA"
            : profile.Country == "CANADA"
                ? "CANADA"
                : profile.Country == "MEXICO"
                    ? "MEXICO"
                    : profile.Country;
    if (profile.Country == "Northern Ireland") {
        country = "NB";
    }

    const state =
        profile.State == "New York" ? "NY" : profile.State
    //todo: improve MX states

    //console.log(profile.CAbr2LBilling, country);
    //console.log(profile.SAbrBilling, state);

    //console.log(profile);
    const str = profile.FirstName;
    const str2 = str.charAt(0).toUpperCase() + str.slice(1);
    const fullname = `${str} ${profile.LastName}`
    fillSupreme('input[name="order[billing_name]"]', fullname);
    fillSupreme('input[name="order[email]"]', profile.Email);
    fillSupreme('input[name="order[tel]"]', profile.PhoneNumber);
    fillSupreme('select[name="order[billing_country]"]', country);
    fillSupreme('input[name="order[billing_zip]"]', profile.PostalCode);
    fillSupreme('input[name="order[billing_city]"]', profile.City);
    fillSupreme('select[name="order[billing_state]"]', state);

    await sleepSupreme(200);

    fillSupreme('input[name="order[billing_address]"]', profile.Address);
    fillSupreme(
        'input[name="order[billing_address_2]"]',
        profile.Address2
    );
    const [cardExpMonth, cardExpYear2Digit] = profile.CardExpirationDate.split('/');
    const cardExpYear4Digit = `${new Date().getFullYear().toString().substring(0, 2)}${cardExpYear2Digit}`;


    fillSupreme('input[placeholder="number"]', profile.CardNumber);
    fillSupreme('input[name="credit_card[cnb]"]', profile.CardNumber);
    fillSupreme('select[name="credit_card[month]"]', cardExpMonth);
    fillSupreme('select[name="credit_card[year]"]', cardExpYear4Digit);
    fillSupreme('input[placeholder="CVV"]', profile.CardCVC);
    fillSupreme('input[name="credit_card[ovv]"]', profile.CardCVC);

    const termsLabel = document.querySelector("label.has-checkbox.terms");
    const termsCheckbox = document.querySelector("#order_terms");
    if (!termsLabel || !termsCheckbox) {
        console.log("could not find terms");
        return;
    }

    console.log("found terms");

    if (!termsCheckbox.checked) {
        console.log("will click terms label");
        termsLabel.click();
    } else {
        console.log("will not click terms label");
    }

    console.log(`terms checked? ${termsCheckbox.checked}`);


    console.log("no autopay");


    const submit = document.querySelector('input[type="submit"]');
    if (!submit) {
        console.log("no submit");
        return;
    }

    // const footerNote = document.querySelector(".checkout_free_shipping, #pay p");
    // if (footerNote) {
    //     footerNote.innerHTML = "This is waiting for page to load...";
    //     footerNote.style = "color: red";
    // }

    await waitForPageLoaded();

    //todo: not sure how to handle for EU


    console.log(submit);


    console.log("will pay");
    setTimeout(() => {
        submit.click();
    }, 1000)

    // if (footerNote) {
    //     footerNote.innerHTML = "Form has submitted";
    // }
};

const waitForFormChange = (form, styleId, callback) => {
    const formObserver = new MutationObserver((mutations, self) => {
        const styleInput = form.querySelector(
            `input[name="style"][value="${styleId}"], input[name="st"][value="${styleId}"]`
        );
        const soldOutIndicator = form.querySelector("b.sold-out");

        console.log("form changed", styleInput, soldOutIndicator);

        if (!styleInput && !soldOutIndicator) {
            return;
        }
        self.disconnect();

        console.log("form is ready");

        callback();
    });
    formObserver.observe(form, { childList: true, subtree: true });
};


const waitForAddForm = async () => {
    return await new Promise(async (resolve, reject) => {
        const formObserver = new MutationObserver((mutations, self) => {
            const form = document.querySelector("div#cctrl");
            if (!form) {
                return;
            }
            self.disconnect();
            console.log("got form");
            resolve(form);
        });
        formObserver.observe(document, { childList: true, subtree: true });
    });
};



const selectSize = (form, sizeId, sizeValue) => {
    const sizeInput = form.querySelector('[name="size"], [name="s"]');
    if (!sizeInput) {
        // sold out
        console.log("no size input");
        return false;
    }

    if (sizeInput.nodeName.toLowerCase() == "input") {
        console.log("one size, good to go");
        return true;
    }

    const sizeOption = sizeInput.querySelector(`option[value="${sizeId}"]`);
    if (!sizeOption) {
        console.log("chosen size id not available");

        const sizeOptions = Array.from(sizeInput.querySelectorAll("option"));
        if (sizeOptions.length == 0) {
            console.log("no sizes available");
            return false;
        }

        if (["", "random"].includes(sizeValue)) {
            if (sizeValue == "random") {
                console.log("shuffling sizes");
                sizeOptions.sort((a, b) => 0.5 - Math.random());
            }
            console.log("selecting alternative size");
            sizeId = sizeOptions[0].value;
        } else {
            const sizeOption = sizeOptions.find(
                (sizeOption) =>
                    sizeOption.label.toLowerCase() == sizeValue.toLowerCase()
            );
            if (!sizeOption) {
                console.log("could not find size option for", sizeValue);
                return;
            }
            console.log("selected", sizeValue);
            sizeId = sizeOption.value;
        }
    }

    sizeInput.value = sizeId;
    console.log("size set, good to go");
    return true;
};






const selectStyle = async (
    form,
    styleId,
    styleValue,
    sizeId,
    sizeValue,
    attemptedStyleIds = []
) => {
    return await new Promise(async (resolve, reject) => {
        console.log(`selectStyle(${styleId})`);

        const styleButton = document.querySelector(`[data-style-id="${styleId}"]`);
        if (!styleButton) {
            console.log("resolved failed no style");
            resolve(false);
            return;
        }

        waitForFormChange(form, styleId, async () => {
            const sizeSelected = selectSize(form, sizeId, sizeValue);

            if (!sizeSelected && ["", "random"].includes(styleValue)) {
                attemptedStyleIds.push(styleId);

                const styleButtons = Array.from(
                    document.querySelectorAll('[data-style-id][data-sold-out="false"]')
                );
                if (styleButtons.length == 0) {
                    console.log("resolved could not find styles");
                    resolve(false);
                    return;
                }

                const styleIds = styleButtons.map(
                    (styleButton) => styleButton.dataset.styleId
                );
                const remainingStyleIds = styleIds.filter(
                    (styleId) => !attemptedStyleIds.includes(styleId)
                );

                console.log("ids", styleIds);
                console.log("attempted", attemptedStyleIds);
                console.log("remaining", remainingStyleIds);

                if (remainingStyleIds.length == 0) {
                    console.log("resolved no styles in stock");
                    resolve(false);
                    return;
                }



                if (styleValue == "random") {
                    console.log("shuffling styles");
                    remainingStyleIds.sort((a, b) => 0.5 - Math.random());
                }
                console.log("selecting alternative style");
                styleId = remainingStyleIds[0];

                resolve(
                    await selectStyle(
                        form,
                        styleId,
                        styleValue,
                        sizeId,
                        sizeValue,
                        attemptedStyleIds
                    )
                );
                return;
            } else if (!sizeSelected && !["", "random"].includes(styleValue)) {
                console.log("resolved style/size is OOS");
                resolve(false);
                return;
            }

            console.log("resolved size selected");
            resolve(true);
            return;
        });

        console.log(styleButton);
        styleButton.click();
    });
};



const waitForItemAdded = async () => {
    return await new Promise(async (resolve, reject) => {
        const cartedObserver = new MutationObserver((mutations, self) => {
            const inCartIndicator = document.querySelector("b.in-cart");
            if (!inCartIndicator || !inCartIndicator.offsetParent) {
                return;
            }
            console.log("was carted");
            self.disconnect();
            resolve();
        });
        cartedObserver.observe(document, { childList: true, subtree: true });
    });
};
const submitAddToCartForm = async (
    form,
    profile,
    goToCheckout,
    fromMonitor
) => {
    const frm = form.querySelector('select[name="qty"]');
    if (frm) {
        frm.value = quantit;
    }
    const submit = form.querySelector('[type="submit"]:not(.remove)');
    if (!submit) {
        console.log("no submit");
        return;
    }

    console.log("good to checkout, about to click button");

    submit.click();

    console.log("goToCheckout", goToCheckout);

    const expiry = new Date();
    expiry.setTime(expiry.getTime() + 60 * 1000);
    if (fromMonitor) {
        document.cookie = `_lightning_monitor_fallback_cart_ts=${Date.now()}; Expires=${expiry.toGMTString()}; path=/`;
    } else {
        document.cookie = `_lightning_autocart_cart_ts=${Date.now()}; Expires=${expiry.toGMTString()}; path=/`;
    }

    if (!goToCheckout) {
        return;
    }

    console.log("before waitForItemAdded");
    await waitForItemAdded();
    console.log("after waitForItemAdded");



    const checkoutButton = document.querySelector("a.button.checkout");
    if (checkoutButton) {
        checkoutButton.innerHTML = "Going to checkout...";
    }

    window.location.href = "/checkout";
};



const addTOCart = async (profile) => {
    console.log("addToCart()");

    console.log(window.location.search);

    let fromMonitor =
        true;

    if (!fromMonitor) {
        console.log("nothing to do");
        return;
    }

    if (!document.body.classList.contains("show")) {
        console.log("not product");
        return;
    }

    let form = document.querySelector("div#cctrl");
    if (!form) {
        console.log("no form");
        /////////////////some stuff that i did
        console.log("aabout to refresh");
        window.location.reload();
        form = await waitForAddForm();
    } else {
        console.log("got form");
    }


    const styleButton = document.querySelector(
        `button[class="selected"], a[class="selected"]`
    );
    if (
        !styleButton ||
        !styleButton.dataset.styleId ||
        !styleButton.dataset.styleName ||
        (!styleButton.dataset.url && !styleButton.href)
    ) {
        console.log("could not find style details");

        return;
    }

    const url = styleButton.dataset.url
        ? styleButton.dataset.url
        : styleButton.href;
    const preferredSize = url.includes("shoes")
        ?
        sizeMap.random : sizeMap.random;
    console.log(url, preferredSize);

    if (typeof preferredSize == "undefined") {
        console.log(`no size mapping for "${preferredSize}"`);

        return;
    }

    let styleId = styleButton.dataset.styleId;
    let sizeId = "-1";
    let styleValue = styleButton.dataset.styleName;
    let sizeValue = preferredSize;


    console.log(
        "styleID",
        styleId,
        "sizeID",
        sizeId,
        "style",
        styleValue,
        "size",
        sizeValue
    );
    // console.log("fromMonitor", fromMonitor, "autocart");

    if (window.location.search.length > 0) {
        const styleButtons = document.querySelectorAll("[data-style-id]");
        for (let i = 0; i < styleButtons.length; ++i) {
            if (styleButtons[i].nodeName.toLowerCase() == "a") {
                styleButtons[i].href =
                    styleButtons[i].href.replace(/\?.*$/, "") + window.location.search;
            } else {
                styleButtons[i].dataset.url =
                    styleButtons[i].dataset.url.replace(/\?.*$/, "") +
                    window.location.search;
            }
        }
    }



    const styleSelected = await selectStyle(
        form,
        styleId,
        styleValue,
        sizeId,
        sizeValue
    );
    if (!styleSelected) {
        console.log("could not select item");

        return;
    }

    console.log("item was selected");

    const goToCheckout = true
    submitAddToCartForm(form, profile, goToCheckout, fromMonitor);
};


const route = async (path, profile) => {

    if (path.includes("/shop/")) {
        console.log("before addToCart call");
        addTOCart(profile);

    }
    if (path.includes("/shop/cart")) {
        const checkoutButton = document.querySelector("a.button.checkout");
        if (checkoutButton) {
            checkoutButton.innerHTML = "Going to checkout...";
        }

        window.location.href = "/checkout";
    }
    else if (path == "/checkout") {
        await sleepSupreme(100);
        fillCheckout(profile);
    }
};









window.addEventListener("DOMContentLoaded", () => {


    // 'profiles', 'activeProfileID', 'blackList', 'delays'


    chrome.storage.local.get(['allProfile'], function (data) {
        // check if data exists.
        // console.log('sss', data)
        const profile = data.allProfile[0]
        route(window.location.pathname, profile);

        //todo: better method
        const pageChangeObserver = new MutationObserver((mutations, self) => {
            if (window.location.pathname == prevPath) {
                console.log("no change");
                return;
            }
            prevPath = window.location.pathname;

            console.log("page change", window.location.pathname);
            route(window.location.pathname, profile);
        });
        pageChangeObserver.observe(document, {
            childList: true,
            subtree: true,
        });




    });







});
