const sleepwm = (ms = 0) => {
    return new Promise(r => setTimeout(r, ms));
};



const getHttpOnlyCookieProduct = async (domain, name) => {
    return await new Promise(async (resolve, reject) => {
        chrome.runtime.sendMessage({ type: 'GET_COOKIES', domain }, (response) => {
            const cookie = response.cookies.find(cookie => cookie.name == name);
            if (cookie) {
                resolve(cookie.value);
                return;
            }
            resolve(null);
        });
    });
};
const clearCookies = async (domain) => {
    return await new Promise(async (resolve, reject) => {
        chrome.runtime.sendMessage({ type: 'CLEAR_COOKIES', domain }, (response) => {
            console.log('cookies were cleared');
            resolve();
        });
    });
};

const PATHS = {
    CART_CLEAR: '/cart/clear.js',
    CART: '/cart',
    CART_JSON: '/cart.json',
    CART_ADD: '/cart/add.js',
    CHECKOUT: '/checkout',
    LOGIN: '/login',
    CHECKPOINT: '/checkpoint',
    QUEUE: '/throttle',
    QUEUE_STATUS: '/checkout/poll?js_poll=1',
    QUEUE_STATUS_NEW: '/queue/poll',
    CHECKOUTS: '/checkouts/',
    SHIPPING_RATES: '/shipping_rates',
    PROCESSING: '/processing',
    STOCK_PROBLEMS: '/stock_problems',
    PAYMENT_CONFIG: '/payments/config',
    CREATE_PP_CHECKOUT: '/wallets/checkouts.json',
    ORDER_CONFIRMED: '/thank_you'
};


const cartTocheckOut = async (profile) => {
    console.log('here')
    const shippingObserver = new MutationObserver(async (mutations, self) => {
        // const elem = document.getElementsByClassName('sqs-add-to-cart-button sqs-suppress-edit-mode');
        const elem = document.getElementById('AddToCart-product-template');
        // alert('i am')
        if (!elem) {
            // alert('he')
            // console.log('here')
            return;
        }

        self.disconnect();

        await sleepwm(500);
        elem.click();



    });

    shippingObserver.observe(document, { childList: true, subtree: true });
};

// const route = async (path, profile) => {
//     // alert('dadsa')
//     waitForAddToCart(profile)
//     // waitForCheckOutButton(profile);
//     // waitforEmailconfirm(profile);
//     // waitforPaymentDiscount(profile);
//     // waitForReview(profile);


// };

const goToCheckout = (profile) => {



    const shippingObserver = new MutationObserver(async (mutations, self) => {
        const elem = document.querySelector('button[name="checkout"]');
        const termsCheckbox = document.querySelector(
            'form[action="/cart"] input[type="checkbox"]'
        );
        if (termsCheckbox) {
            console.log("found terms checkbox");

            self.disconnect();
            await sleepwm(500);
            termsCheckbox.click();
        } else if (elem) {
            self.disconnect();
            setTimeout(() => {
                elem.click();
            }, 1000)

        }



    });
    shippingObserver.observe(document, { childList: true, subtree: true });
};



const selectSize = async () => {
    console.log("selectsize")



    const shippingObserver = new MutationObserver(async (mutations, self) => {
        // const elem = document.getElementsByClassName('sqs-add-to-cart-button sqs-suppress-edit-mode');
        const inputelem = document.getElementById('swatch-0-medium')
        // alert('i am')
        if (!inputelem) {
            // alert('he')
            // console.log('here')
            return;
        }

        self.disconnect();

        await sleepwm(500);
        inputelem.click()




    });
    shippingObserver.observe(document, { childList: true, subtree: true });
}



const waitForCheckOutButton = async (profile) => {
    const shippingObserver = new MutationObserver(async (mutations, self) => {
        const elem = document.getElementById('update-cart');

        if (!elem) {
            return;
        }

        self.disconnect();

        await sleepwm(500);
        elem.click();

    });

    shippingObserver.observe(document, { childList: true, subtree: true });
};


const submitall = async (profile) => {
    const shippingObserver = new MutationObserver(async (mutations, self) => {
        const elem = document.getElementById('continue_button');

        if (!elem) {
            return;
        }

        self.disconnect();

        setTimeout(() => {
            elem.click();
        }, 5000)


    });

    shippingObserver.observe(document, { childList: true, subtree: true });
};



const confirmAddress = async (profile) => {
    const shippingObserver = new MutationObserver(async (mutations, self) => {
        const elem = document.querySelector('button[class="button2"]');

        if (!elem) {
            return;
        }

        self.disconnect();

        await sleepwm(500);
        elem.click();

    });

    shippingObserver.observe(document, { childList: true, subtree: true });
};

const continueToPayment = async (profile) => {
    console.log('isithere')
    const shippingObserver = new MutationObserver(async (mutations, self) => {
        const elem = document.querySelector('button[name="button"]');

        if (!elem) {
            // alert('her')
            return;
        }

        self.disconnect();
        fillEmail('input[id="checkout_email"]', profile.Email);
        fillEmail('input[id="checkout_email_or_phone"]', profile.Email);
        fillEmail('input[id="checkout_shipping_address_first_name"]', profile.Email);
        fillEmail('input[id="checkout_shipping_address_first_name"]', profile.FirstName);
        fillEmail('input[id="checkout_shipping_address_last_name"]', profile.LastName);
        fillEmail('select[id="checkout_shipping_address_country"]', profile.Country);
        // if (document.querySelector('select[id="checkout_shipping_address_province"]') != null) {
        //     document.querySelector('select[id="checkout_shipping_address_province"]').focus()
        //     document.querySelector('select[id="checkout_shipping_address_province"]').value = profile.State
        // }


        setTimeout(() => {
            document.querySelector('select[id="checkout_shipping_address_province"]').focus()
            document.querySelector('select[id="checkout_shipping_address_province"]').value = profile.State
            fillEmail('select[id="checkout_shipping_address_province"]', profile.State);
        }, 1000)
        fillEmail('[name="checkout[billing_address][province]"]:not(.visually-hidden)', profile.State)
        fillEmail('input[id="checkout_shipping_address_zip"]', profile.PostalCode);
        fillEmail('input[id="checkout_shipping_address_city"]', profile.City);
        fillEmail('input[id="checkout_shipping_address_address1"]', profile.Address);
        fillEmail('input[id="checkout_shipping_address_phone"]', profile.PhoneNumber);
        // fillEmail('input[id="checkout_shipping_address_phone"]', profile.PhoneNumber);


        // fillEmail('input[id="name"]', profile.CardName);



        fillEmail('input[name="checkout[billing_address][first_name]"]:not(.visually-hidden)', profile.FirstName);
        fillEmail('input[name="checkout[billing_address][last_name]"]:not(.visually-hidden)', profile.LastName);
        fillEmail('input[name="checkout[billing_address][address1]"]:not(.visually-hidden)', profile.Address);
        fillEmail('input[name="checkout[billing_address][address2]"]:not(.visually-hidden)', profile.Address2);
        fillEmail('input[name="checkout[billing_address][city]"]:not(.visually-hidden)', profile.City);
        fillEmail('[name="checkout[billing_address][country]"]:not(.visually-hidden)', profile.Country);
        fillEmail('[name="checkout[billing_address][province]"]:not(.visually-hidden)', profile.State);
        fillEmail('input[name="checkout[billing_address][zip]"]:not(.visually-hidden)', profile.PostalCode);
        fillEmail('input[name="checkout[billing_address][phone]"]:not(.visually-hidden)', profile.PhoneNumber);

        fillEmail('input[name="checkout[billing_address][first_name]"].visually-hidden', profile.FirstName);
        fillEmail('input[name="checkout[billing_address][last_name]"].visually-hidden', profile.LastName);
        fillEmail('input[name="checkout[billing_address][address1]"].visually-hidden', profile.Address);
        fillEmail('input[name="checkout[billing_address][address2]"].visually-hidden', profile.Address2);
        fillEmail('input[name="checkout[billing_address][city]"].visually-hidden', profile.City);
        fillEmail('input[name="checkout[billing_address][country]"].visually-hidden', profile.Country);
        fillEmail('input[name="checkout[billing_address][province]"].visually-hidden', profile.State);
        fillEmail('input[name="checkout[billing_address][zip]"].visually-hidden', profile.PostalCode);
        fillEmail('input[name="checkout[billing_address][phone]"].visually-hidden', profile.PhoneNumber);





        // alert('herdsa')
        setTimeout(() => {
            elem.click();
        }, 5000)


    });

    shippingObserver.observe(document, { childList: true, subtree: true });
}

const getProperties = () => {
    const properties = {};
    const fields = document.querySelectorAll('input[name^="properties["]:not([disabled]), select[name^="properties["]:not([disabled])');
    let filled = 0;
    let totalNotHidden = 0;
    for (let i = 0; i < fields.length; ++i) {
        const name = fields[i].name.match(/^properties\[(.+)]$/)[1];
        properties[name] = fields[i].value;
        if (!fields[i].matches('[type="hidden"]')) {
            ++totalNotHidden;
            if (fields[i].value.length > 0) {
                ++filled;
            }
        }
    }
    const complete = filled == totalNotHidden;
    return { fields, properties, complete };
};


const getVariantId = () => {
    let id = document.querySelector('form[action^="/cart/add"] [name="id"], form[action^="/cart/add"] [name="id[]"]');
    if (id && id.matches('[type="radio"]')) {
        id = document.querySelector('form[action^="/cart/add"] [name="id"]:checked');
    }
    if (!id) {
        console.log('could not get prod id');
        return null;
    }
    if (id.value.length == 0) {
        console.log('prod id empty');
        return null;
    }
    return id.value;
};



const getVariants = async () => {
    const response = await fetch(window.location.href.split('?')[0], {
        method: 'GET',
        credentials: 'same-origin',
        headers: { 'Accept': 'application/javascript' }
    });
    if (!response || !response.ok || response.status != 200) {
        return null;
    }
    const body = await response.json();
    if (!body.variants || body.variants.length == 0 || !body.options || body.options.length == 0) {
        return null;
    }
    body.variants = body.variants.filter(variant => variant.available == true);
    if (body.variants.length == 0) {
        return null;
    }

    body.options = body.options.map(option => option.values);
    return { ids: body.variants, options: body.options, type: body.type ? body.type : '' };
};

const getSizeId = async (profile, auto) => {
    if (!auto || window.location.pathname == '/') {
        return getVariantId();
    }
    const variants = await getVariants();
    if (!variants) {
        console.log('autocart size', 'could not get variants');
        return null;
    }
    let productType = 'Clothing';
    if (variants.type.toLowerCase().includes('sneaker') || variants.type.toLowerCase().includes('shoe') || variants.type.toLowerCase().includes('footwear')) {
        console.log('autocart size', 'type is shoe based on product type');
        productType = 'Shoe';
    } else {
        for (let i = 0; i < variants.options.length; ++i) {
            const options = variants.options[i];
            const allValuesNumeric = options.every(val => /^[0-9\.]+$/.test(val));
            if (allValuesNumeric) {
                console.log('autocart size', 'type is shoe based on sizes');
                productType = 'Shoe';
                break;
            }
        }
    }
    console.log('autocart size', 'product type is', productType);
    if (variants.ids.length == 1 && ['Default Title', 'OS', 'O/S'].includes(variants.ids[0].title)) {
        console.log('selecting OS');
        return variants.ids[0].id;
    }
    let size = profile[`${productType}Size`];
    // size may not be set in profile
    if (typeof size == 'undefined' || size == null) {
        size = '';
    }
    console.log('autocart size', 'product type size is', size);
    if (size.length == 0) {
        console.log('selecting first available');
        return variants.ids[0].id;
    }

    let sizes;
    if (size == 'random') {
        console.log('autocart size', 'selecting random');

        console.log('!!!', variants);

        return variants.ids[Math.floor(Math.random() * variants.ids.length)].id;
    } else if (size.includes(',')) {
        console.log('autocart size', 'selecting random custom');
        sizes = size.split(',');
    } else {
        sizes = [size];
        if (/^[0-9\.]+$/.test(size)) {
            sizes.push(`US ${size}`);
            sizes.push(`US${size}`);
            sizes.push(`UK ${size}`);
            sizes.push(`UK${size}`);
            sizes.push(`EU ${size}`);
            sizes.push(`EU${size}`);
            sizes.push(`${size} US`);
            sizes.push(`${size}US`);
            sizes.push(`${size} UK`);
            sizes.push(`${size}UK`);
            sizes.push(`${size} EU`);
            sizes.push(`${size}EU`);
            sizes.push(`Men's US Size ${size}`);
            sizes.push(`Men's US ${size}`);
            sizes.push(`UK ${size} : US ${parseFloat(size) + 0.5}`);
        } else if (size == 'XXS') {
            sizes.push('XX-Small');
            sizes.push('XXSmall');
            sizes.push('XXSml');
        } else if (size == 'XS') {
            sizes.push('X-Small');
            sizes.push('XSmall');
            sizes.push('XSml');
        } else if (size == 'S') {
            sizes.push('Small');
            sizes.push('Sm');
            sizes.push('Sml');
        } else if (size == 'M') {
            sizes.push('Medium');
            sizes.push('Md');
            sizes.push('Med');
        } else if (size == 'L') {
            sizes.push('Large');
            sizes.push('Lg');
            sizes.push('Lrg');
        } else if (size == 'XL') {
            sizes.push('X-Large');
            sizes.push('XLarge');
            sizes.push('XLrg');
            sizes.push('Extra Large');
        } else if (size == 'XXL') {
            sizes.push('XX-Large');
            sizes.push('XXLarge');
            sizes.push('XXLrg');
            sizes.push('2XL');
            sizes.push('2X-Large');
            sizes.push('2XLarge');
            sizes.push('2XLrg');
        } else if (size == 'XXXL') {
            sizes.push('XXX-Large');
            sizes.push('XXXLarge');
            sizes.push('XXXLrg');
            sizes.push('3XL');
            sizes.push('3X-Large');
            sizes.push('3XLarge');
            sizes.push('3XLrg');
        }
        sizes = sizes.map(size => size.toLowerCase());
    }
    let variantId = null;
    for (let i = 0; i < variants.ids.length; ++i) {
        const variant = variants.ids[i];
        const variantDetails = [variant.title, variant.option1, variant.option2, variant.option3]
            .filter(details => details != null)
            .map(details => details.toLowerCase());
        if (variantDetails.filter(value => sizes.includes(value)).length > 0) {
            console.log('autocart size', 'matched size', variantDetails);
            variantId = variant.id;
            break;
        }
    }
    if (!variantId) {
        console.log('autocart size', 'size not available', variants.ids);
        return null;
    }
    return variantId;
};

const addToshopcart = async (profile, auto) => {
    const properties = getProperties();
    if (!properties.complete) {
        console.log('properties not complete', properties);
        return null;
    }
    const id = await getSizeId(profile, auto);
    if (id == null) {
        return null;
    }
    console.log('prod id is', id);

    const quantityInput = document.querySelector('form[action^="/cart/add"] [name="quantity"]');
    const quantity = quantityInput ? quantityInput.value : 1;
    const form = {
        form_type: 'product',
        utf_8: '✓',
        quantity: parseInt(quantity),
        id,
        properties: properties.properties
    };
    const response = await fetch(PATHS.CART_ADD, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(form)
    });
    return response;
};





const confirmautoCart = async (profile) => {
    if (
        // checkprice(profile) == 
        1) {
        console.log(`in underpax`)
        const response = await addToshopcart(profile, true);
        if (!response) {
            console.log('Autocart failed (preferred size not available), please cart manually');
            return;
        }

        if (!response.ok || response.status != 200) {
            console.log(response);
            console.log('Autocart failed (bad response), please cart manually');
            return;
        }

        const body = await response.json();
        if (!body.product_title) {
            console.log(body);
            console.log('Autocart failed (bad response), please cart manually');
            return;
        }
        window.location.href = PATHS.CHECKOUT


    }
    else {
        // chrome.runtime.sendMessage({ type: 'Not under max Price', item: body.product_title });
    }
};




const fillPayment = async (profile) => {

    await waitForPageLoaded();

    console.log("fillShopifyPaymentField", window.location.pathname);

    if (window.location.pathname == "/number") {
        fillEmail('input[name="number"]', profile.CardNumber);

    } else if (window.location.pathname == "/name") {
        fillEmail('input[id="name"]', 'Talha');

    } else if (window.location.pathname == "/expiry") {
        fillEmail('input[name="expiry"]', profile.CardExpirationDate);

    } else if (window.location.pathname == "/verification_value") {
        fillEmail('input[name="verification_value"]', profile.CardCVC);

    }


};

const fillEmail = (selector, value, triggerEvents = true) => {
    console.log("ffilli")
    const el = typeof selector == 'string' ? document.querySelector(selector) : selector;
    if (!el) {
        console.log(`Could not find ${selector}`);
        return;
    }

    el.dispatchEvent(new Event('focus', { bubbles: true }));

    if (triggerEvents) {
        el.value = value;
    }
    el.setAttribute('value', value);

    el.dispatchEvent(new Event('input', { bubbles: true }));

    if (triggerEvents) {
        el.dispatchEvent(new Event('keydown', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('keyup', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
    }
};

const waitForPageLoaded = async () => {
    return await new Promise(async (resolve, reject) => {
        do {
            //console.log(document.readyState);
            await sleepwm(10);
        } while (document.readyState != "complete");

        console.log(document.readyState);

        resolve();
    });
};


const cartingstuff = async (profile) => {
    const addToCartForms = document.querySelectorAll('form[action^="/cart/add"]');
    let numVisibleAddToCartForms = 0;
    for (let i = 0; i < addToCartForms.length; ++i) {
        if (!addToCartForms[i].offsetParent) {
            continue;
        }
        ++numVisibleAddToCartForms;
    }
    if (window.location.href.includes('notre-shop') && document.querySelectorAll('input[id="addToCart"]').length > 0) {
        console.log('atc');
        numVisibleAddToCartForms++;
    }
    const isShopify = document.querySelector('link[href^="//cdn.shopify.com/"]') != null;
    const hasOneAddToCartForm = numVisibleAddToCartForms == 1;
    const pathContainsProducts = window.location.pathname.includes('/products/');
    const pathIsIndex = window.location.pathname == '/';

    if (!isShopify || !hasOneAddToCartForm || (!pathContainsProducts && !pathIsIndex)) {
        console.log(
            'not shopify product page', window.location.href,
            'isShopify', isShopify,
            'hasOneAddToCartForm', hasOneAddToCartForm,
            'pathContainsProducts', pathContainsProducts,
            'pathIsIndex', pathIsIndex
        );
        return;
    }
    console.log('is shopify product page');
    selectSize(profile)
    cartTocheckOut(profile)
    goToCheckout(profile)
    waitForCheckOutButton(profile)

}


window.addEventListener('DOMContentLoaded', () => {
    const isCardFrame = [
        "checkout.us.shopifycs.com",
        "checkout.shopifycs.com",
    ].includes(window.location.hostname);
    // alert('here')
    // let profile = {
    //     'Enabled': true,

    //     'Email': "talhabutt123@gmail.com",

    //     'FirstName': "test", 'LastName': "testlastname", 'FullName': "testfullname",

    //     'Address': "zb-179 street 9 ", 'Address2': "apprt 2",
    //     'City': "NewYork", 'State': "NY", 'Country': "United States", 'PostalCode': "10001", 'PhoneNumber': "4600054",

    //     'CardName': "mastercard", 'CardType': "visa", 'CardNumber': "4242424242424242",
    //     'CardExpirationDate': "04/26", 'CardExpirationMonth': "04", 'CardExpirationYear2D': "26", 'CardExpirationYear4D': "2026",
    //     'CardCVC': "456",

    //     'Email': "ybuyy004@gmail.com", 'Twitter': "test4real", 'Discord': "car#4666", 'Instagram': "test4instagram",

    //     'userkey': "45682", 'Name': "testname", 'WebhookEnabled': true, 'Webhook': "this is my url",

    //     'ShoeSize': "M"
    // }


    // if (!profile.Enabled) {
    //     return false;
    // }
    chrome.storage.local.get(['allProfile'], function (data) {
        // check if data exists.
        // console.log('sss', data)
        const profile = data.allProfile[0]
        if (window.location.pathname.includes('/collections') || window.location.pathname.includes('/cart')) {
            console.log('found collection');
            confirmautoCart(profile)
            cartingstuff(profile);
        }
        else
            if (window.location.pathname.includes('/checkouts')) {
                console.log('found checkout');
                continueToPayment(profile);
                // fillPayment(profile);

            }
            else if (isCardFrame) {
                fillPayment(profile);


            }
        confirmAddress(profile)
        submitall(profile)



    });







    // route(window.location.href, profile);


});